"use client";

import Link from "next/link";
import JSZip from "jszip";
import {
  Download,
  ImagePlus,
  LockKeyhole,
  Move,
  Palette,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import {
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const GRID_COLUMNS = 3;
const DEFAULT_GRID_ROWS = 3;
const POST_TILE_WIDTH = 1080;
const POST_TILE_HEIGHT = 1350;
const PROFILE_TILE_WIDTH = 1015;
const PROFILE_TILE_HEIGHT = POST_TILE_HEIGHT;
const PROFILE_SIDE_BLEED = (POST_TILE_WIDTH - PROFILE_TILE_WIDTH) / 2;
const PREVIEW_WIDTH = 720;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DEFAULT_BORDER = 24;
const DEFAULT_BACKGROUND = "#0a0a0a";
const COLUMN_LABELS = ["Left", "Center", "Right"] as const;
const ROW_LABELS: Record<number, string[]> = {
  1: ["Only"],
  2: ["Top", "Bottom"],
  3: ["Top", "Middle", "Bottom"],
};

type Point = {
  x: number;
  y: number;
};

type LoadedImageInfo = {
  fileName: string;
  height: number;
  url: string;
  width: number;
};

type LoadedImageAsset = LoadedImageInfo & {
  image: HTMLImageElement;
};

type GeneratedTile = {
  blob: Blob;
  downloadName: string;
  gridLabel: string;
  positionLabel: string;
  postOrder: number;
  url: string;
};

type DragState = {
  lastX: number;
  lastY: number;
  pointerId: number;
};

type CompositeSize = {
  height: number;
  width: number;
};

type ImagePlacement = {
  clampedPan: Point;
  contentHeight: number;
  contentWidth: number;
  imageHeight: number;
  imageWidth: number;
  imageX: number;
  imageY: number;
};

type RenderCompositeArgs = {
  backgroundColor: string;
  canvasHeight: number;
  canvasWidth: number;
  compositeSize: CompositeSize;
  ctx: CanvasRenderingContext2D;
  gridRows: number;
  image: HTMLImageElement | null;
  imageInfo: LoadedImageInfo | null;
  outerBorder: number;
  pan: Point;
  showGuides?: boolean;
  zoom: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function baseName(value: string) {
  return value.replace(/\.[^/.]+$/, "");
}

function slugify(value: string) {
  const normalized = baseName(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "insta-grid";
}

function getCompositeSize(gridRows: number): CompositeSize {
  return {
    height: PROFILE_TILE_HEIGHT * gridRows,
    width: PROFILE_TILE_WIDTH * GRID_COLUMNS,
  };
}

function getPreviewHeight(gridRows: number) {
  const compositeSize = getCompositeSize(gridRows);

  return Math.round((PREVIEW_WIDTH * compositeSize.height) / compositeSize.width);
}

function getImagePlacement(
  imageInfo: LoadedImageInfo,
  compositeSize: CompositeSize,
  outerBorder: number,
  pan: Point,
  zoom: number,
): ImagePlacement {
  const contentWidth = Math.max(1, compositeSize.width - outerBorder * 2);
  const contentHeight = Math.max(1, compositeSize.height - outerBorder * 2);
  const baseScale = Math.min(contentWidth / imageInfo.width, contentHeight / imageInfo.height);
  const imageWidth = imageInfo.width * baseScale * zoom;
  const imageHeight = imageInfo.height * baseScale * zoom;
  const maxPanX = Math.abs(contentWidth - imageWidth) / 2;
  const maxPanY = Math.abs(contentHeight - imageHeight) / 2;
  const clampedPan = {
    x: clamp(pan.x, -maxPanX, maxPanX),
    y: clamp(pan.y, -maxPanY, maxPanY),
  };

  return {
    clampedPan,
    contentHeight,
    contentWidth,
    imageHeight,
    imageWidth,
    imageX: outerBorder + (contentWidth - imageWidth) / 2 + clampedPan.x,
    imageY: outerBorder + (contentHeight - imageHeight) / 2 + clampedPan.y,
  };
}

function clampPan(
  pan: Point,
  imageInfo: LoadedImageInfo | null,
  compositeSize: CompositeSize,
  outerBorder: number,
  zoom: number,
) {
  if (!imageInfo) {
    return { x: 0, y: 0 };
  }

  return getImagePlacement(imageInfo, compositeSize, outerBorder, pan, zoom).clampedPan;
}

function getRowLabel(rowIndex: number, gridRows: number) {
  return ROW_LABELS[gridRows]?.[rowIndex] ?? `Row ${rowIndex + 1}`;
}

function loadImageFile(file: File) {
  const objectUrl = URL.createObjectURL(file);

  return new Promise<LoadedImageAsset>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        fileName: file.name,
        height: image.naturalHeight,
        image,
        url: objectUrl,
        width: image.naturalWidth,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not decode image."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Could not encode tile."));
    }, "image/png");
  });
}

function renderCompositeCanvas({
  backgroundColor,
  canvasHeight,
  canvasWidth,
  compositeSize,
  ctx,
  gridRows,
  image,
  imageInfo,
  outerBorder,
  pan,
  showGuides = false,
  zoom,
}: RenderCompositeArgs) {
  const scaleX = canvasWidth / compositeSize.width;
  const scaleY = canvasHeight / compositeSize.height;
  const borderX = outerBorder * scaleX;
  const borderY = outerBorder * scaleY;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (image && imageInfo) {
    const placement = getImagePlacement(imageInfo, compositeSize, outerBorder, pan, zoom);

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      outerBorder * scaleX,
      outerBorder * scaleY,
      placement.contentWidth * scaleX,
      placement.contentHeight * scaleY,
    );
    ctx.clip();
    ctx.drawImage(
      image,
      placement.imageX * scaleX,
      placement.imageY * scaleY,
      placement.imageWidth * scaleX,
      placement.imageHeight * scaleY,
    );
    ctx.restore();
  }

  if (!showGuides) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = Math.max(1, canvasWidth / 360);

  for (let line = 1; line < GRID_COLUMNS; line += 1) {
    const verticalOffset = (canvasWidth / GRID_COLUMNS) * line;

    ctx.beginPath();
    ctx.moveTo(verticalOffset, 0);
    ctx.lineTo(verticalOffset, canvasHeight);
    ctx.stroke();
  }

  for (let line = 1; line < gridRows; line += 1) {
    const horizontalOffset = (canvasHeight / gridRows) * line;

    ctx.beginPath();
    ctx.moveTo(0, horizontalOffset);
    ctx.lineTo(canvasWidth, horizontalOffset);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  ctx.strokeRect(0.5, 0.5, canvasWidth - 1, canvasHeight - 1);

  if (borderX > 0 && borderY > 0) {
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.strokeRect(
      borderX + 0.5,
      borderY + 0.5,
      Math.max(0, canvasWidth - borderX * 2 - 1),
      Math.max(0, canvasHeight - borderY * 2 - 1),
    );
  }

  if (!image) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    ctx.font = `${canvasWidth / 18}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Upload an image to start", canvasWidth / 2, canvasHeight / 2);
  }

  ctx.restore();
}

export default function InstaToolClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const generatedUrlsRef = useRef<string[]>([]);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const imageUrlRef = useRef<string | null>(null);

  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND);
  const [border, setBorder] = useState(DEFAULT_BORDER);
  const [error, setError] = useState<string | null>(null);
  const [generatedTiles, setGeneratedTiles] = useState<GeneratedTile[]>([]);
  const [gridRows, setGridRows] = useState(DEFAULT_GRID_ROWS);
  const [imageInfo, setImageInfo] = useState<LoadedImageInfo | null>(null);
  const [isPackaging, setIsPackaging] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [filePrefix, setFilePrefix] = useState("insta-grid");
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const compositeSize = getCompositeSize(gridRows);
  const previewHeight = getPreviewHeight(gridRows);
  const totalPosts = GRID_COLUMNS * gridRows;

  const postingQueue = useMemo(
    () => [...generatedTiles].sort((left, right) => left.postOrder - right.postOrder),
    [generatedTiles],
  );

  function revokeGeneratedUrls() {
    if (generatedUrlsRef.current.length > 0) {
      generatedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      generatedUrlsRef.current = [];
    }
  }

  function clearGeneratedTiles() {
    revokeGeneratedUrls();
    setGeneratedTiles((currentTiles) => (currentTiles.length === 0 ? currentTiles : []));
  }

  function nudgePan(deltaX: number, deltaY: number) {
    clearGeneratedTiles();
    setPan((currentPan) =>
      clampPan(
        {
          x: currentPan.x + deltaX,
          y: currentPan.y + deltaY,
        },
        imageInfo,
        compositeSize,
        border,
        zoom,
      ),
    );
  }

  function updateZoom(nextZoom: number) {
    clearGeneratedTiles();
    setZoom(nextZoom);
    setPan((currentPan) => clampPan(currentPan, imageInfo, compositeSize, border, nextZoom));
  }

  function updateGridRows(nextGridRows: number) {
    clearGeneratedTiles();
    setGridRows(nextGridRows);
    setPan((currentPan) =>
      clampPan(currentPan, imageInfo, getCompositeSize(nextGridRows), border, zoom),
    );
  }

  function updateBorder(nextBorder: number) {
    clearGeneratedTiles();
    setBorder(nextBorder);
    setPan((currentPan) => clampPan(currentPan, imageInfo, compositeSize, nextBorder, zoom));
  }

  function resetFraming() {
    clearGeneratedTiles();
    setPan({ x: 0, y: 0 });
    setZoom(MIN_ZOOM);
  }

  useEffect(() => {
    return () => {
      revokeGeneratedUrls();

      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = PREVIEW_WIDTH * dpr;
    canvas.height = previewHeight * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    renderCompositeCanvas({
      backgroundColor,
      canvasHeight: previewHeight,
      canvasWidth: PREVIEW_WIDTH,
      compositeSize,
      ctx: context,
      gridRows,
      image: imageElementRef.current,
      imageInfo,
      outerBorder: border,
      pan,
      showGuides: true,
      zoom,
    });
  }, [backgroundColor, border, compositeSize, gridRows, imageInfo, pan, previewHeight, zoom]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    input.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Pick an image file first.");
      return;
    }

    setError(null);
    clearGeneratedTiles();

    try {
      const asset = await loadImageFile(file);

      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      imageElementRef.current = asset.image;
      imageUrlRef.current = asset.url;
      setImageInfo({
        fileName: asset.fileName,
        height: asset.height,
        url: asset.url,
        width: asset.width,
      });
      setFilePrefix(`${slugify(asset.fileName)}-grid`);
      setPan({ x: 0, y: 0 });
      setZoom(MIN_ZOOM);
    } catch {
      setError("Could not load that image.");
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!imageInfo) {
      return;
    }

    dragStateRef.current = {
      lastX: event.clientX,
      lastY: event.clientY,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!imageInfo || !dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const deltaX = (event.clientX - dragStateRef.current.lastX) * (compositeSize.width / rect.width);
    const deltaY = (event.clientY - dragStateRef.current.lastY) * (compositeSize.height / rect.height);

    dragStateRef.current = {
      lastX: event.clientX,
      lastY: event.clientY,
      pointerId: event.pointerId,
    };

    nudgePan(deltaX, deltaY);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    dragStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  async function prepareTiles() {
    if (!imageInfo || !imageElementRef.current) {
      return;
    }

    setIsPreparing(true);
    setError(null);
    clearGeneratedTiles();

    try {
      const compositeCanvas = document.createElement("canvas");
      const compositeContext = compositeCanvas.getContext("2d");
      const safeFilePrefix = slugify(filePrefix || "insta-grid");

      compositeCanvas.width = compositeSize.width;
      compositeCanvas.height = compositeSize.height;

      if (!compositeContext) {
        throw new Error("Canvas is unavailable.");
      }

      renderCompositeCanvas({
        backgroundColor,
        canvasHeight: compositeSize.height,
        canvasWidth: compositeSize.width,
        compositeSize,
        ctx: compositeContext,
        gridRows,
        image: imageElementRef.current,
        imageInfo,
        outerBorder: border,
        pan,
        zoom,
      });

      const tiles = await Promise.all(
        Array.from({ length: totalPosts }, async (_, index) => {
          const row = Math.floor(index / GRID_COLUMNS);
          const column = index % GRID_COLUMNS;
          const tileCanvas = document.createElement("canvas");
          const tileContext = tileCanvas.getContext("2d");

          tileCanvas.width = POST_TILE_WIDTH;
          tileCanvas.height = POST_TILE_HEIGHT;

          if (!tileContext) {
            throw new Error("Canvas is unavailable.");
          }

          tileContext.fillStyle = backgroundColor;
          tileContext.fillRect(0, 0, POST_TILE_WIDTH, POST_TILE_HEIGHT);
          tileContext.drawImage(
            compositeCanvas,
            column * PROFILE_TILE_WIDTH,
            row * PROFILE_TILE_HEIGHT,
            PROFILE_TILE_WIDTH,
            PROFILE_TILE_HEIGHT,
            PROFILE_SIDE_BLEED,
            0,
            PROFILE_TILE_WIDTH,
            PROFILE_TILE_HEIGHT,
          );

          const blob = await canvasToBlob(tileCanvas);
          const objectUrl = URL.createObjectURL(blob);
          const positionLabel = `${getRowLabel(row, gridRows)} ${COLUMN_LABELS[column]}`;
          const postOrder = totalPosts - index;

          generatedUrlsRef.current.push(objectUrl);

          return {
            blob,
            downloadName: `${safeFilePrefix}-${String(index + 1).padStart(2, "0")}.png`,
            gridLabel: `${row + 1}-${column + 1}`,
            positionLabel,
            postOrder,
            url: objectUrl,
          } satisfies GeneratedTile;
        }),
      );

      setGeneratedTiles(tiles);
    } catch {
      setError("Could not generate the grid tiles.");
    } finally {
      setIsPreparing(false);
    }
  }

  async function downloadAllTiles() {
    if (generatedTiles.length === 0) {
      return;
    }

    setIsPackaging(true);
    setError(null);

    try {
      const safeFilePrefix = slugify(filePrefix || "insta-grid");
      const zip = new JSZip();
      const folder = zip.folder(`${safeFilePrefix}-instagram-grid-${gridRows}rows`);

      postingQueue.forEach((tile) => {
        folder?.file(tile.downloadName, tile.blob);
      });

      folder?.file(
        "posting-order.txt",
        [`Rows: ${gridRows}`, `Posts: ${totalPosts}`, "", ...postingQueue
          .map((tile) => `${tile.postOrder}. ${tile.positionLabel} -> ${tile.downloadName}`)
          ].join("\n"),
      );

      const archiveBlob = await zip.generateAsync({ type: "blob" });
      const archiveUrl = URL.createObjectURL(archiveBlob);
      const anchor = document.createElement("a");

      anchor.href = archiveUrl;
      anchor.download = `${safeFilePrefix}-instagram-grid-${gridRows}rows.zip`;
      anchor.click();
      URL.revokeObjectURL(archiveUrl);
    } catch {
      setError("Could not package the zip archive.");
    } finally {
      setIsPackaging(false);
    }
  }

  const imageDetails = imageInfo
    ? `${imageInfo.width} × ${imageInfo.height}px`
    : "No image loaded";

  return (
    <main className="min-h-[100dvh] bg-[#050505] bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_28%),linear-gradient(180deg,#0f0f0f_0%,#060606_50%,#020202_100%)] text-white antialiased">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col px-6 py-6 sm:px-10 sm:py-10">
        <header className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-neutral-300">
                <LockKeyhole className="h-4 w-4 text-[#f59e0b]" />
                Private EarlyOtter utility
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Instagram Grid Cutter
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-400">
                Upload one image, drag it into place, choose an outer frame color, and export nine portrait posts that line up with Instagram&apos;s current profile grid crop.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-400">
              <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-neutral-200">
                {GRID_COLUMNS} x {gridRows} profile grid
              </div>
              <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-neutral-200">
                4:5 exports
              </div>
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-neutral-300 transition-colors hover:border-[#f59e0b]/40 hover:text-white"
              >
                Back to home
              </Link>
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    <ImagePlus className="h-3.5 w-3.5 text-[#f59e0b]" />
                    Source image
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-400">
                    Everything runs locally in your browser. Nothing gets uploaded anywhere.
                  </p>
                </div>
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#f59e0b]" />
              </div>

              <label className="mt-6 flex cursor-pointer flex-col gap-4 rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-5 transition-colors hover:border-[#f59e0b]/50 hover:bg-black/30">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-white">Choose an image</div>
                    <div className="mt-1 text-sm text-neutral-500">
                      Portrait, landscape, or square all work. The tool keeps the full image visible by default, then fills any leftover space with your chosen frame color.
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black">
                    Browse
                  </span>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  type="file"
                />
              </label>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-400">
                <span>{imageInfo?.fileName ?? "No file selected"}</span>
                <span className="text-neutral-500">{imageDetails}</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                <Move className="h-3.5 w-3.5 text-[#f59e0b]" />
                Layout controls
              </div>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-neutral-300">
                    <span>Zoom</span>
                    <span className="text-neutral-500">{zoom.toFixed(2)}x</span>
                  </div>
                  <input
                    className="w-full accent-[#f59e0b]"
                    disabled={!imageInfo}
                    max={MAX_ZOOM}
                    min={MIN_ZOOM}
                    onChange={(event) => updateZoom(Number(event.currentTarget.value))}
                    step={0.01}
                    type="range"
                    value={zoom}
                  />
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-neutral-300">
                    <span>Rows</span>
                    <span className="text-neutral-500">{gridRows} row{gridRows === 1 ? "" : "s"} / {totalPosts} posts</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((rowOption) => (
                      <button
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${gridRows === rowOption ? "border-[#f59e0b]/50 bg-[#f59e0b]/15 text-white" : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/20 hover:text-white"}`}
                        key={rowOption}
                        onClick={() => updateGridRows(rowOption)}
                        type="button"
                      >
                        {rowOption} row{rowOption === 1 ? "" : "s"}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-neutral-300">
                    <span>Outer border</span>
                    <span className="text-neutral-500">{border}px appended around the image</span>
                  </div>
                  <input
                    className="w-full accent-[#f59e0b]"
                    max={240}
                    min={0}
                    onChange={(event) => updateBorder(Number(event.currentTarget.value))}
                    step={1}
                    type="range"
                    value={border}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <label className="block">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300">
                      <Palette className="h-4 w-4 text-[#f59e0b]" />
                      Frame color
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <input
                        className="h-12 w-12 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        onChange={(event) => {
                          clearGeneratedTiles();
                          setBackgroundColor(event.currentTarget.value);
                        }}
                        type="color"
                        value={backgroundColor}
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">{backgroundColor.toUpperCase()}</div>
                        <div className="text-xs text-neutral-500">Used for the outer frame, letterboxing space, and the side bleed on each exported post</div>
                      </div>
                    </div>
                  </label>

                  <label className="block">
                    <div className="mb-2 text-sm font-semibold text-neutral-300">Filename prefix</div>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#f59e0b]/50"
                      onChange={(event) => {
                        clearGeneratedTiles();
                        setFilePrefix(event.currentTarget.value);
                      }}
                      placeholder="insta-grid"
                      type="text"
                      value={filePrefix}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!imageInfo || isPreparing}
                    onClick={prepareTiles}
                    type="button"
                  >
                    <Download className="h-4 w-4" />
                    {isPreparing ? "Preparing posts..." : `Prepare ${totalPosts} posts`}
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-neutral-200 transition-colors hover:border-[#f59e0b]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!imageInfo}
                    onClick={resetFraming}
                    type="button"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reset framing
                  </button>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-bold text-white">Profile preview</div>
                  <p className="mt-1 text-sm text-neutral-400">
                    Drag directly on the preview to position the image. The frame color now fills leftover space instead of trimming the image down.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  drag to frame
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <canvas
                  className="h-auto w-full touch-none"
                  onPointerCancel={handlePointerUp}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  ref={canvasRef}
                  style={{ aspectRatio: `${compositeSize.width} / ${compositeSize.height}` }}
                />
              </div>

              <div className="mt-4 grid gap-3 text-sm text-neutral-400 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="font-semibold text-white">Current Instagram crop</div>
                  <div className="mt-1 text-neutral-500">Profile thumbnails use a taller crop, so the preview matches the visible center of each portrait post.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="font-semibold text-white">No forced edge crop</div>
                  <div className="mt-1 text-neutral-500">At 1.00x the full image stays visible, and extra frame color fills any space left by the selected layout.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="font-semibold text-white">Secret-ish route</div>
                  <div className="mt-1 text-neutral-500">This page is unlinked and marked noindex, but not password protected.</div>
                </div>
              </div>
            </div>

            {generatedTiles.length > 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">Exported posts</div>
                    <p className="mt-1 text-sm text-neutral-400">
                      Post in reverse order so the finished grid reads correctly on your profile. The zip also includes a text file with the same order.
                    </p>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f59e0b] px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPackaging}
                    onClick={downloadAllTiles}
                    type="button"
                  >
                    <Download className="h-4 w-4" />
                    {isPackaging ? "Building ZIP..." : "Download ZIP"}
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {postingQueue.map((tile) => (
                    <div
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-neutral-300"
                      key={`${tile.postOrder}-${tile.gridLabel}`}
                    >
                      {tile.postOrder}. {tile.positionLabel}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {generatedTiles.map((tile) => (
                    <article
                      className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20"
                      key={tile.gridLabel}
                    >
                      <div className="relative">
                        <img
                          alt={`${tile.positionLabel} preview`}
                          className="aspect-[4/5] w-full object-contain bg-black/20"
                          src={tile.url}
                        />
                        <div
                          className="pointer-events-none absolute inset-y-0 border-x border-white/40"
                          style={{ left: `${(PROFILE_SIDE_BLEED / POST_TILE_WIDTH) * 100}%`, right: `${(PROFILE_SIDE_BLEED / POST_TILE_WIDTH) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 p-4">
                        <div>
                          <div className="text-sm font-semibold text-white">{tile.positionLabel}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
                            Post #{tile.postOrder}
                          </div>
                        </div>
                        <a
                          className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:border-[#f59e0b]/40 hover:text-white"
                          download={tile.downloadName}
                          href={tile.url}
                        >
                          Save
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}