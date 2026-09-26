import "server-only";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import type { InstallRecord, TelemetryBatch } from "@/lib/telemetry";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const DAY_MS = 86_400_000;
const MAX_EVENT_AGE_MS = 30 * DAY_MS;
const MAX_CLOCK_SKEW_MS = 5 * 60_000;
const RETENTION_DAYS = 400;

const counterFields = {
  rule_saved: "count_ruleSaved",
  day_override_set: "count_dayOverride",
  test_alarm_scheduled: "count_testAlarm",
  feedback_submitted: "count_feedback",
  sync_failed: "count_syncFailed",
} as const;

function tableName() {
  const name = process.env.TELEMETRY_TABLE_NAME;
  if (!name) throw new Error("Telemetry table is not configured");
  return name;
}

/**
 * Folds a batch into the install's single item. Milestones use
 * `if_not_exists`, so a retried batch never moves a funnel step.
 */
export async function recordTelemetryBatch(
  batch: TelemetryBatch,
  country: string | undefined,
  now = new Date(),
) {
  const nowMs = now.getTime();
  const clamp = (iso: string) =>
    new Date(
      Math.min(Math.max(Date.parse(iso), nowMs - MAX_EVENT_AGE_MS), nowMs + MAX_CLOCK_SKEW_MS),
    ).toISOString();
  const isPlausibleDay = (day: string) =>
    Math.abs(Date.parse(`${day}T12:00:00Z`) - nowMs) <= MAX_EVENT_AGE_MS + DAY_MS;

  const milestones = new Map<string, string>();
  const setEarliest = (field: string, at: string) => {
    const current = milestones.get(field);
    if (!current || at < current) milestones.set(field, at);
  };
  const flags = new Set<string>();
  const counters = new Map<string, number>();
  const activeDays = new Set<string>();
  const providers = new Set<string>();
  let lastAlarmActiveAt: string | undefined;

  for (const event of batch.events) {
    const at = clamp(event.occurredAt);
    if (isPlausibleDay(event.day)) activeDays.add(event.day);

    switch (event.name) {
      case "onboarding_completed":
        setEarliest("onboardingCompletedAt", at);
        break;
      case "permission_resolved":
        if (event.props.granted) setEarliest(`${event.props.kind}GrantedAt`, at);
        else flags.add(`${event.props.kind}Denied`);
        break;
      case "calendar_account_connected":
        providers.add(event.props.provider);
        break;
      case "alarms_synced":
        if (event.props.activeAlarmCount > 0) {
          setEarliest("firstAlarmScheduledAt", at);
          if (!lastAlarmActiveAt || at > lastAlarmActiveAt) lastAlarmActiveAt = at;
        }
        break;
      case "rule_saved":
      case "day_override_set":
      case "test_alarm_scheduled":
      case "feedback_submitted":
      case "sync_failed": {
        const field = counterFields[event.name];
        counters.set(field, (counters.get(field) ?? 0) + 1);
        break;
      }
      case "app_opened":
        break;
    }
  }

  // Field names are fixed identifiers, so each one doubles as its own placeholder.
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};
  const sets: string[] = [];
  const adds: string[] = [];
  const bind = (field: string, value: unknown) => {
    names[`#${field}`] = field;
    values[`:${field}`] = value;
    return [`#${field}`, `:${field}`] as const;
  };
  const set = (field: string, value: unknown) => {
    const [name, placeholder] = bind(field, value);
    sets.push(`${name} = ${placeholder}`);
  };
  const setOnce = (field: string, value: unknown) => {
    const [name, placeholder] = bind(field, value);
    sets.push(`${name} = if_not_exists(${name}, ${placeholder})`);
  };
  const add = (field: string, value: unknown) => {
    const [name, placeholder] = bind(field, value);
    adds.push(`${name} ${placeholder}`);
  };

  const nowIso = now.toISOString();
  setOnce("firstSeenAt", nowIso);
  set("lastSeenAt", nowIso);
  set("channel", batch.channel);
  set("appVersion", batch.appVersion);
  set("buildNumber", batch.buildNumber);
  set("iosVersion", batch.iosVersion);
  set("expireAt", Math.floor(nowMs / 1_000) + RETENTION_DAYS * 86_400);
  if (country) set("country", country);
  for (const [field, at] of milestones) setOnce(field, at);
  for (const flag of flags) set(flag, true);
  if (lastAlarmActiveAt) set("lastAlarmActiveAt", lastAlarmActiveAt);
  for (const [field, count] of counters) add(field, count);
  if (activeDays.size > 0) add("activeDays", activeDays);
  if (providers.size > 0) add("calendarProviders", providers);

  await dynamo.send(
    new UpdateCommand({
      TableName: tableName(),
      Key: { installId: batch.installId },
      UpdateExpression:
        `SET ${sets.join(", ")}` + (adds.length ? ` ADD ${adds.join(", ")}` : ""),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
}

export async function listInstalls(): Promise<InstallRecord[]> {
  const installs: InstallRecord[] = [];
  let startKey: Record<string, unknown> | undefined;

  do {
    const page = await dynamo.send(
      new ScanCommand({ TableName: tableName(), ExclusiveStartKey: startKey }),
    );
    installs.push(...((page.Items ?? []) as InstallRecord[]));
    startKey = page.LastEvaluatedKey;
  } while (startKey);

  return installs;
}
