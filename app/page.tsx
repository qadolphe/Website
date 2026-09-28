"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Car, Coffee } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

// Mirrors the app's "Night Swim" palette.
const GOLD = "#f4c66a";
const AQUA = "#6ed3e0";
const SURFACE = "#141f36";

type Morning = { wake?: number; event?: number; time: string };
type Day = Morning & { label: string; isNext: boolean; isPast: boolean };

// Marker positions are fractions of a 5–11 AM window, like the app's week chart.
const at = (hour: number, minute = 0) => (hour + minute / 60 - 5) / 6;
const OFF: Morning = { time: "—" };
// Sample mornings starting tomorrow; tomorrow matches the card above it.
const MORNINGS: Morning[] = [
  { wake: at(7, 55), event: at(9), time: "7:55" },
  { wake: at(7), event: at(8), time: "7:00" },
  { wake: at(8, 30), event: at(9, 30), time: "8:30" },
  { wake: at(7, 55), event: at(9), time: "7:55" },
  { wake: at(9, 30), time: "9:30" },
];
const LABELS = ["S", "M", "T", "W", "Th", "F", "S"];

/** The Sunday-first week containing tomorrow, with tomorrow as the next alarm. */
function weekAround(today: Date): { title: string; days: Day[] } {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const start = new Date(tomorrow);
  start.setDate(tomorrow.getDate() - tomorrow.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (date: Date, withMonth: boolean) =>
    date.toLocaleDateString("en-US", { month: withMonth ? "short" : undefined, day: "numeric" });
  const days = LABELS.map((label, index) => {
    const offset = index - tomorrow.getDay();
    return { label, isNext: offset === 0, isPast: offset < 0, ...(offset >= 0 ? MORNINGS[offset] ?? OFF : OFF) };
  });
  return { title: `${format(start, true)} - ${format(end, start.getMonth() !== end.getMonth())}`, days };
}

export default function HomePage() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-[#070c1a] font-rounded text-[#eef0f4] antialiased selection:bg-[#f4c66a] selection:text-[#0a1020]">
      {/* The onboarding otter's starry water, faded into the night sky. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image src="/images/OtterSwim.png" alt="" fill priority className="object-cover object-right opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070c1a]/60 via-[#070c1a]/80 to-[#070c1a]" />
        <div className="absolute left-1/2 top-[-12rem] h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#f4c66a]/10 blur-[120px]" />
        {today && <Stars />}
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6 sm:px-12 sm:py-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-black tracking-tight text-[#f4c66a]">
          EarlyOtter
        </motion.div>
        <nav className="flex items-center gap-6 text-[15px] font-semibold text-[#a6b2c8]">
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="/support" className="transition-colors hover:text-white">Support</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 px-6 py-6 sm:px-12 lg:flex-row lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:pt-10 lg:text-left"
        >
          <h1 className="mb-6 text-[3.5rem] font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
            Wake up to <br />
            what <span className="text-[#f4c66a]">matters.</span>
          </h1>
          <p className="mb-10 max-w-lg text-[19px] font-semibold leading-relaxed text-[#a6b2c8] sm:text-[22px]">
            A friendly otter to brighten your day.
          </p>
          <Link
            href="https://apps.apple.com/us/app/earlyotter/id6766083287"
            target="_blank"
            className="rounded-2xl bg-[#f4c66a] px-8 py-4 text-[18px] font-extrabold text-[#0a1020] shadow-[0_10px_40px_rgba(244,198,106,0.25)] transition-all hover:scale-[1.02] hover:bg-[#f7d38a] active:scale-95"
          >
            Download on the App Store
          </Link>
        </motion.div>

        <div className="relative mt-16 w-full max-w-[360px] lg:mt-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={today ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            className="pointer-events-none absolute -top-[4.4rem] right-3 z-20 h-28 w-28 drop-shadow-xl"
          >
            <Image src="/images/OtterOverlook.png" alt="Otter peeking over the card" fill className="object-contain object-bottom" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={today ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative z-10"
          >
            <TimetableCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={today ? { opacity: 1, y: 12 } : {}}
            transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            {today && <WeekCard {...weekAround(today)} />}
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl p-6 text-center text-[14px] font-semibold text-[#a6b2c8]/60 sm:p-12">
        © {today?.getFullYear() ?? 2026} EarlyOtter. All rights reserved.
      </footer>
    </main>
  );
}

// A fixed, seeded scatter; drawn after mount so it never affects hydration.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const rand = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: rand(1) * 100, y: rand(2) * 100, size: 1 + rand(3) * 2, warm: rand(4) < 0.3, delay: rand(5) * 6 };
});

/** Small, softly twinkling stars; a few warm ones echo the gold. */
function Stars() {
  return (
    <div className="absolute inset-0">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.warm ? "#f4c66a" : "#dbe6ff",
            boxShadow: `0 0 ${star.size * 3}px ${star.warm ? "#f4c66a" : "#9cc0ff"}`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="block h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 0 5px ${color}2e` }} />;
}

function Row({ value, unit, label, detail, marker, muted }: {
  value: string; unit: string; label: string; detail?: string; marker: ReactNode; muted?: boolean;
}) {
  return (
    <div className="flex items-center py-3">
      <div className="w-[9rem] shrink-0">
        <span className={`text-[22px] font-bold ${muted ? "text-[#a6b2c8]" : "text-white"}`}>{value}</span>
        <span className="ml-1 text-[12px] font-semibold text-white/50">{unit}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-white">{label}</div>
        {detail && <div className="text-[12px] text-[#a6b2c8]">{detail}</div>}
      </div>
      <div className="flex w-5 justify-center">{marker}</div>
    </div>
  );
}

/** The app's Home card: the wake-up first, then how it was worked out. */
function TimetableCard() {
  return (
    <div className="rounded-[2rem] px-6 pb-2 pt-5 shadow-2xl" style={{ background: SURFACE }}>
      <div className="text-[12px] font-semibold text-[#a6b2c8]">Tomorrow</div>
      <div className="flex items-end pb-3">
        <div className="w-[9rem] shrink-0 whitespace-nowrap">
          <span className="text-[3.25rem] font-bold leading-none tracking-tight text-white">7:55</span>
          <span className="ml-1 text-[1.1rem] font-semibold text-white/50">AM</span>
        </div>
        <div className="flex-1 pb-1">
          <div className="text-[17px] font-semibold text-white">Wake up</div>
          <div className="text-[12px] text-[#a6b2c8]">in 11h 40m</div>
        </div>
        <div className="mb-3 flex w-5 justify-center"><Dot color={GOLD} /></div>
      </div>
      <div className="mb-1 h-[2px] rounded-full bg-white/50" />
      <div className="divide-y divide-white/10">
        <Row value="35" unit="min" label="Prep time" muted marker={<Coffee className="h-4 w-4 text-white/50" />} />
        <Row value="30" unit="min" label="Commute" muted marker={<Car className="h-4 w-4 text-white/50" />} />
        <Row value="9:00" unit="AM" label="Biology Class" detail="Science Hall 204" marker={<Dot color={AQUA} />} />
      </div>
    </div>
  );
}

/** The app's week chart: a pill per day, gold for the wake-up, aqua for the event. */
function WeekCard({ title, days }: { title: string; days: Day[] }) {
  const position = (fraction: number) => `${8 + fraction * 84}%`;
  const marker = (fraction: number, color: string) => (
    <div
      className="absolute left-1/2 flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0a1020]"
      style={{ top: position(fraction), boxShadow: `0 0 8px ${color}66` }}
    >
      <div className="h-[9px] w-[9px] rounded-full" style={{ background: color }} />
    </div>
  );

  return (
    <div className="rounded-[2rem] px-6 pb-5 pt-5 shadow-xl" style={{ background: SURFACE }}>
      <div className="mb-4 h-6 text-[17px] font-semibold text-white">{title}</div>
      <div className="flex justify-between">
        {days.map(({ label, wake, event, time, isNext, isPast }, i) => {
          return (
            <div key={i} className={`flex flex-col items-center gap-2.5 ${isPast ? "opacity-40" : ""}`}>
              <span className={`text-[12px] font-bold ${isNext ? "text-white" : "text-[#a6b2c8]"}`}>{label}</span>
              <div
                className="relative h-[180px] w-[30px] rounded-full sm:w-[34px]"
                style={{
                  background: `${GOLD}${isNext ? "22" : "0f"}`,
                  boxShadow: `inset 0 0 0 ${isNext ? 2.2 : 1.5}px ${GOLD}${isNext ? "b3" : "52"}`,
                }}
              >
                {wake !== undefined && event !== undefined && (
                  <div
                    className="absolute left-1/2 w-0 -translate-x-1/2 border-l-2 border-dashed"
                    style={{ borderColor: `${GOLD}cc`, top: position(wake), height: `${(event - wake) * 84}%` }}
                  />
                )}
                {wake !== undefined && marker(wake, GOLD)}
                {event !== undefined && marker(event, AQUA)}
              </div>
              <span className={`text-[12px] font-semibold ${isNext ? "text-white" : "text-[#a6b2c8]"}`}>{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
