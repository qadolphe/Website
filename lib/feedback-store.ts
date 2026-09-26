import "server-only";

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { storedFeedbackSchema, type StoredFeedback } from "@/lib/feedback";

const s3 = new S3Client({});
const keyTimeCeiling = 9_999_999_999_999;

function objectKey(feedback: StoredFeedback) {
  const reverseTimestamp = String(
    keyTimeCeiling - Date.parse(feedback.submittedAt),
  ).padStart(13, "0");

  return `feedback/${reverseTimestamp}-${feedback.id}.json`;
}

function bucketName() {
  const name = process.env.FEEDBACK_BUCKET_NAME;
  if (!name) throw new Error("Feedback bucket is not configured");
  return name;
}

export async function storeFeedback(feedback: StoredFeedback) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: objectKey(feedback),
      Body: JSON.stringify(feedback),
      ContentType: "application/json",
      CacheControl: "no-store",
      ServerSideEncryption: "AES256",
    }),
  );
}

export async function listFeedback(limit = 100): Promise<StoredFeedback[]> {
  const response = await s3.send(
    new ListObjectsV2Command({
      Bucket: bucketName(),
      Prefix: "feedback/",
      MaxKeys: Math.min(Math.max(limit, 1), 100),
    }),
  );

  const entries = await Promise.all(
    (response.Contents ?? []).map(async ({ Key }) => {
      if (!Key) return null;

      try {
        const object = await s3.send(
          new GetObjectCommand({
            Bucket: bucketName(),
            Key,
          }),
        );
        const parsed = storedFeedbackSchema.safeParse(
          JSON.parse((await object.Body?.transformToString()) ?? ""),
        );
        return parsed.success ? parsed.data : null;
      } catch {
        return null;
      }
    }),
  );

  return entries
    .filter((entry): entry is StoredFeedback => entry !== null)
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
}
