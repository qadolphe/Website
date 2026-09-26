import { z } from "zod";

export const MAX_FEEDBACK_BODY_BYTES = 16_384;
export const MAX_FEEDBACK_MESSAGE_LENGTH = 2_000;

const version = z.string().trim().min(1).max(32);

export const feedbackRequestSchema = z
  .object({
    schemaVersion: z.literal(1),
    category: z.enum(["experience", "suggestion", "issue"]),
    message: z.string().trim().min(1).max(MAX_FEEDBACK_MESSAGE_LENGTH),
    appVersion: version,
    buildNumber: version,
    iosVersion: version,
  })
  .strict();

export const storedFeedbackSchema = feedbackRequestSchema.extend({
  id: z.string().uuid(),
  submittedAt: z.string().datetime(),
  source: z.literal("ios"),
});

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
export type StoredFeedback = z.infer<typeof storedFeedbackSchema>;
