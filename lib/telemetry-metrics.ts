import type { InstallRecord, PermissionKind } from "@/lib/telemetry";

const DAY_MS = 86_400_000;

export type FunnelStep = { label: string; count: number };
export type Breakdown = { label: string; count: number }[];
export type RetentionCohort = {
  week: string;
  installs: number;
  day1: number | null;
  week2: number | null;
  day30: number | null;
};
export type PermissionStat = { kind: PermissionKind; granted: number; denied: number };
export type FeatureStat = { label: string; installs: number; total: number };

export type TelemetrySummary = {
  installs: number;
  funnel: FunnelStep[];
  activeAlarms7d: number;
  opened7d: number;
  opened30d: number;
  retention: RetentionCohort[];
  permissions: PermissionStat[];
  features: FeatureStat[];
  versions: Breakdown;
  providers: Breakdown;
};

function dayNumber(day: string) {
  return Math.floor(Date.parse(`${day}T00:00:00Z`) / DAY_MS);
}

function weekStart(day: number) {
  // Day 0 (1970-01-01) was a Thursday; shift so weeks start on Monday.
  const monday = day - ((day + 3) % 7);
  return new Date(monday * DAY_MS).toISOString().slice(0, 10);
}

function tally(values: (string | undefined)[]): Breakdown {
  const counts = new Map<string, number>();
  for (const value of values) {
    const label = value ?? "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function summarize(installs: InstallRecord[], now = new Date()): TelemetrySummary {
  const today = Math.floor(now.getTime() / DAY_MS);
  const within = (iso: string | undefined, days: number) =>
    iso !== undefined && now.getTime() - Date.parse(iso) <= days * DAY_MS;
  const activeDayNumbers = (install: InstallRecord) =>
    [...(install.activeDays ?? [])].map(dayNumber).sort((a, b) => a - b);

  const cohorts = new Map<string, { first: number; days: number[] }[]>();
  for (const install of installs) {
    const days = activeDayNumbers(install);
    if (days.length === 0) continue;
    const week = weekStart(days[0]);
    const members = cohorts.get(week) ?? [];
    members.push({ first: days[0], days });
    cohorts.set(week, members);
  }

  const rate = (
    members: { first: number; days: number[] }[],
    from: number,
    to: number,
  ) => {
    const eligible = members.filter((m) => today - m.first >= to);
    if (eligible.length === 0) return null;
    const returned = eligible.filter((m) =>
      m.days.some((d) => d - m.first >= from && d - m.first <= to),
    );
    return returned.length / eligible.length;
  };

  const retention = [...cohorts]
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([week, members]) => ({
      week,
      installs: members.length,
      day1: rate(members, 1, 1),
      week2: rate(members, 7, 13),
      day30: rate(members, 30, 59),
    }));

  const feature = (label: string, field: keyof InstallRecord): FeatureStat => {
    const counts = installs.map((i) => Number(i[field] ?? 0));
    return {
      label,
      installs: counts.filter((c) => c > 0).length,
      total: counts.reduce((sum, c) => sum + c, 0),
    };
  };

  const permission = (kind: PermissionKind): PermissionStat => ({
    kind,
    granted: installs.filter((i) => i[`${kind}GrantedAt`]).length,
    denied: installs.filter((i) => i[`${kind}Denied`]).length,
  });

  return {
    installs: installs.length,
    funnel: [
      { label: "Opened the app", count: installs.length },
      { label: "Finished onboarding", count: installs.filter((i) => i.onboardingCompletedAt).length },
      { label: "Granted calendar", count: installs.filter((i) => i.calendarGrantedAt).length },
      { label: "Granted alarms", count: installs.filter((i) => i.alarmGrantedAt).length },
      { label: "Had an alarm scheduled", count: installs.filter((i) => i.firstAlarmScheduledAt).length },
    ],
    activeAlarms7d: installs.filter((i) => within(i.lastAlarmActiveAt, 7)).length,
    opened7d: installs.filter((i) => activeDayNumbers(i).some((d) => today - d < 7)).length,
    opened30d: installs.filter((i) => activeDayNumbers(i).some((d) => today - d < 30)).length,
    retention,
    permissions: [permission("calendar"), permission("alarm"), permission("notification")],
    features: [
      feature("Saved a rule", "count_ruleSaved"),
      feature("Changed a single day", "count_dayOverride"),
      feature("Tried a test alarm", "count_testAlarm"),
      feature("Sent feedback", "count_feedback"),
      feature("Hit a sync error", "count_syncFailed"),
    ],
    versions: tally(installs.map((i) => i.appVersion)),
    providers: tally(installs.flatMap((i) => [...(i.calendarProviders ?? [])])),
  };
}
