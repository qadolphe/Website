import { z } from "zod";

export const MAX_TELEMETRY_BODY_BYTES = 32_768;
export const MAX_TELEMETRY_EVENTS = 50;

const version = z.string().trim().min(1).max(32);
const refreshReason = z.enum(["appOpen", "manual", "background", "shortcut"]);

function event<Name extends string, Props extends z.ZodRawShape>(name: Name, props: Props) {
  return z
    .object({
      name: z.literal(name),
      day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      occurredAt: z.string().datetime({ offset: true }),
      props: z.object(props).strict(),
    })
    .strict();
}

// Mirrors `TelemetryEvent` in the iOS app. Every event has a fixed set of
// props, so no free text or calendar content can reach storage.
export const telemetryEventSchema = z.discriminatedUnion("name", [
  event("app_opened", {}),
  event("onboarding_completed", {}),
  event("permission_resolved", {
    kind: z.enum(["calendar", "alarm", "notification"]),
    granted: z.boolean(),
  }),
  event("calendar_account_connected", { provider: z.enum(["apple", "google"]) }),
  event("alarms_synced", {
    activeAlarmCount: z.number().int().min(0).max(100),
    reason: refreshReason,
  }),
  event("sync_failed", { reason: refreshReason }),
  event("rule_saved", { isDefault: z.boolean() }),
  event("day_override_set", { kind: z.enum(["skip", "custom", "cleared"]) }),
  event("test_alarm_scheduled", {}),
  event("feedback_submitted", { category: z.enum(["experience", "suggestion", "issue"]) }),
]);

export const telemetryChannelSchema = z.enum(["debug", "testflight", "internal", "appstore"]);

export const telemetryBatchSchema = z
  .object({
    schemaVersion: z.literal(1),
    installId: z.string().uuid(),
    appVersion: version,
    buildNumber: version,
    iosVersion: version,
    channel: telemetryChannelSchema,
    events: z.array(telemetryEventSchema).min(1).max(MAX_TELEMETRY_EVENTS),
  })
  .strict();

export type TelemetryEvent = z.infer<typeof telemetryEventSchema>;
export type TelemetryBatch = z.infer<typeof telemetryBatchSchema>;
export type TelemetryChannel = z.infer<typeof telemetryChannelSchema>;

export type PermissionKind = "calendar" | "alarm" | "notification";

/** One DynamoDB item per install; see `lib/telemetry-store.ts`. */
export type InstallRecord = {
  installId: string;
  channel: TelemetryChannel;
  appVersion: string;
  iosVersion: string;
  firstSeenAt: string;
  lastSeenAt: string;
  onboardingCompletedAt?: string;
  calendarGrantedAt?: string;
  alarmGrantedAt?: string;
  notificationGrantedAt?: string;
  calendarDenied?: boolean;
  alarmDenied?: boolean;
  notificationDenied?: boolean;
  firstAlarmScheduledAt?: string;
  lastAlarmActiveAt?: string;
  calendarProviders?: Set<string>;
  activeDays?: Set<string>;
  count_ruleSaved?: number;
  count_dayOverride?: number;
  count_testAlarm?: number;
  count_feedback?: number;
  count_syncFailed?: number;
};
