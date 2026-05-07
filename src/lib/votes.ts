import type { StageEntry } from "@/lib/stages";

export interface VoteState {
  scores: Record<string, number | null>;
  updatedAt: string | null;
  submittedAt: string | null;
}

export function createEmptyVoteState(entries: StageEntry[]): VoteState {
  return {
    scores: Object.fromEntries(entries.map((entry) => [entry.id, null])),
    updatedAt: null,
    submittedAt: null,
  };
}

export function voteStorageKey(userName: string, stageId: string) {
  return `votes:${userName}:${stageId}`;
}

export function readVoteState(
  rawValue: string | null,
  entries: StageEntry[]
): VoteState {
  const fallback = createEmptyVoteState(entries);

  if (!rawValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<VoteState>;
    const parsedScores = parsed.scores ?? {};

    return {
      scores: entries.reduce<Record<string, number | null>>((result, entry) => {
        const value = parsedScores[entry.id];
        result[entry.id] =
          typeof value === "number" && Number.isFinite(value)
            ? Math.max(0, Math.min(12, value))
            : null;
        return result;
      }, {}),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      submittedAt:
        typeof parsed.submittedAt === "string" ? parsed.submittedAt : null,
    };
  } catch {
    return fallback;
  }
}

export function countScoredEntries(
  entries: StageEntry[],
  scores: Record<string, number | null>
) {
  return entries.filter((entry) => typeof scores[entry.id] === "number").length;
}

export function buildLeaderboard(
  entries: StageEntry[],
  scores: Record<string, number | null>
) {
  return [...entries]
    .map((entry) => ({
      ...entry,
      score: scores[entry.id] ?? 0,
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.country.localeCompare(right.country);
    });
}
