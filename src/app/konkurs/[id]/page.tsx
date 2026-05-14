"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button";
import SortableVoteCard from "@/components/SortableVoteCard";
import { useUser } from "@/context/UserContext";
import type { VoteState } from "@/lib/votes";

interface StageEntryView {
  id: string;
  country: string;
  artist: string;
  song: string;
  note: string;
  accentFrom: string;
  accentTo: string;
  imagePath?: string | null;
}

interface StageView {
  id: string;
  name: string;
  round: string;
  tagline: string;
  status?: "OPEN" | "LOCKED";
  entries: StageEntryView[];
}

interface CriteriaScore {
  song: number;
  performance: number;
  stage: number;
}

function overallScore(criteria: CriteriaScore) {
  return criteria.song + criteria.performance + criteria.stage;
}

function buildVoteScoresFromCriteria(
  entries: StageEntryView[],
  criteriaScores: Record<string, CriteriaScore>
) {
  return entries.reduce<Record<string, number | null>>((result, entry) => {
    result[entry.id] = overallScore(
      criteriaScores[entry.id] ?? { song: 0, performance: 0, stage: 0 }
    );
    return result;
  }, {});
}

function sortEntriesByScores(
  entries: StageEntryView[],
  scores: Record<string, number | null>
) {
  return [...entries].sort((left, right) => {
    const leftScore = scores[left.id] ?? -1;
    const rightScore = scores[right.id] ?? -1;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return left.country.localeCompare(right.country);
  });
}



export default function StageDetail() {
  const { currentUser } = useUser();
  const router = useRouter();
  const params = useParams();
  const stageId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<StageView | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderedEntries, setOrderedEntries] = useState<StageEntryView[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, CriteriaScore>>({});
  const [voteState, setVoteState] = useState<VoteState>({
    scores: {},
    updatedAt: null,
    submittedAt: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!currentUser) {
      router.replace("/");
    }
  }, [mounted, currentUser, router]);

  useEffect(() => {
    if (!mounted || !stageId) {
      return;
    }

    async function loadStage() {
      try {
        const response = await fetch(`/api/stages/${stageId}`);
        const data = await response.json();

        if (!data.stage) {
          return;
        }

        const loadedStage = data.stage as StageView;
        setStage(loadedStage);

        let initialCriteria: Record<string, CriteriaScore> = {};

        if (currentUser) {
          try {
            const votesResponse = await fetch(`/api/votes?stageId=${stageId}`, {
              headers: { "x-user-name": currentUser },
            });
            const votesData = await votesResponse.json();
            if (votesData.votes) {
              votesData.votes.forEach((v: any) => {
                initialCriteria[v.artistId] = {
                  song: v.song || 0,
                  performance: v.performance || 0,
                  stage: v.stageScore || 0,
                };
              });
            }
          } catch (err) {
            console.error("Failed to load votes", err);
          }
        }

        // Fill missing artists with 0
        loadedStage.entries.forEach((entry) => {
          if (!initialCriteria[entry.id]) {
            initialCriteria[entry.id] = { song: 0, performance: 0, stage: 0 };
          }
        });
        const initialScores = buildVoteScoresFromCriteria(loadedStage.entries, initialCriteria);

        setCriteriaScores(initialCriteria);
        setVoteState({ scores: initialScores, updatedAt: null, submittedAt: null });
        setOrderedEntries(sortEntriesByScores(loadedStage.entries, initialScores));
      } catch (loadError) {
        console.error("Failed to load stage", loadError);
      } finally {
        setLoading(false);
      }
    }

    void loadStage();
  }, [mounted, stageId, currentUser]);



  const handleCriteriaChange = (
    entryId: string,
    field: keyof CriteriaScore,
    value: number
  ) => {
    if (!stage || (stage.status ?? "OPEN") !== "OPEN") {
      return;
    }

    const safeValue = Math.max(0, Math.min(12, Number.isFinite(value) ? value : 0));
    const updatedAt = new Date().toISOString();
    const nextCriteriaScores = {
      ...criteriaScores,
      [entryId]: {
        ...(criteriaScores[entryId] ?? { song: 0, performance: 0, stage: 0 }),
        [field]: safeValue,
      },
    };
    const nextScores = buildVoteScoresFromCriteria(stage.entries, nextCriteriaScores);

    setCriteriaScores(nextCriteriaScores);
    setVoteState((previous) => ({
      ...previous,
      scores: nextScores,
      updatedAt,
    }));
    setIsDirty(true);
  };

  const handleClearEntryCriteria = (entryId: string) => {
    if (!stage || (stage.status ?? "OPEN") !== "OPEN") {
      return;
    }

    const nextCriteriaScores = {
      ...criteriaScores,
      [entryId]: { song: 0, performance: 0, stage: 0 },
    };
    const nextScores = buildVoteScoresFromCriteria(stage.entries, nextCriteriaScores);

    setCriteriaScores(nextCriteriaScores);
    setVoteState((previous) => ({
      ...previous,
      scores: nextScores,
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  };

  const reshuffleRanking = async () => {
    if (!stage || (stage.status ?? "OPEN") !== "OPEN") {
      return;
    }

    const nextOrderedEntries = sortEntriesByScores(stage.entries, voteState.scores);
    setOrderedEntries(nextOrderedEntries);
    setIsDirty(false);

    const votesPayload = nextOrderedEntries.map((entry, index) => {
      const criteria = criteriaScores[entry.id] ?? { song: 0, performance: 0, stage: 0 };
      const overall = voteState.scores[entry.id] ?? 0;
      return {
        artistId: entry.id,
        song: criteria.song,
        performance: criteria.performance,
        stageScore: criteria.stage,
        overall: overall,
      };
    });

    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(currentUser ? { 'x-user-name': currentUser } : {})
        },
        body: JSON.stringify({
          stageId: stage.id,
          votes: votesPayload,
        }),
      });
    } catch (e) {
      console.error("Failed to save votes", e);
    }
  };

  if (!mounted || !currentUser) {
    return null;
  }

  if (loading) {
    return (
      <main className="app-shell">
        <section className="stage-detail-header">
          <div className="hero-copy">
            <p className="eyebrow">Ladowanie</p>
            <h1 className="display-title">Przygotowanie tablicy</h1>
          </div>
        </section>
        <section className="ranking-vertical-line scoreboard-skeleton-shell">
          <div className="ranking-line-track"></div>
          <div className="scoreboard-header-row scoreboard-skeleton-header">
            <span>#</span>
            <span>Kraj / Utwor</span>
            <span>Piosenka</span>
            <span>Wystep</span>
            <span>Scena</span>
            <span>Suma</span>
          </div>
          <div className="votes-grid draggable-ranking-list">
            {Array.from({ length: 8 }).map((_, index) => (
              <article key={index} className="artist-card draggable-artist-card scoreboard-skeleton-row">
                <div className="ranking-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="scoreboard-entry">
                  <div className="score-skeleton-block score-skeleton-flag" />
                  <div className="score-skeleton-copy">
                    <div className="score-skeleton-line score-skeleton-line-title" />
                    <div className="score-skeleton-line score-skeleton-line-sub" />
                  </div>
                </div>
                <div className="vote-cell score-skeleton-cell"><div className="score-skeleton-block" /></div>
                <div className="vote-cell score-skeleton-cell"><div className="score-skeleton-block" /></div>
                <div className="vote-cell score-skeleton-cell"><div className="score-skeleton-block" /></div>
                <div className="vote-cell vote-field-overall score-skeleton-cell"><div className="score-skeleton-block score-skeleton-overall" /></div>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!stage) {
    return (
      <main className="app-shell">
        <section className="section-panel empty-panel">
          <p className="eyebrow">Brak konkursu</p>
          <h1 className="display-title">Taki konkurs nie istnieje.</h1>
          <Button text="Wroc do lobby" onClick={() => router.push("/konkurs")} />
        </section>
      </main>
    );
  }

  const isOpen = (stage.status ?? "OPEN") === "OPEN";
  const isVotingLocked = !isOpen;

  return (
    <main className="app-shell">
      <section className="stage-detail-header">
        <div className="hero-copy">
          <p className="eyebrow">{stage.round}</p>
          <h1 className="display-title">{stage.name}</h1>
        </div>
        <div className="header-actions">
          {!isVotingLocked && (
            <Button
              text="Zapisz"
              onClick={reshuffleRanking}
              disabled={!isDirty}
              className="hidden-mobile"
            />
          )}
          <Button
            text="Wróć"
            variant="secondary"
            onClick={() => router.push("/konkurs")}
          />
        </div>
      </section>

      <section className="ranking-vertical-line">
        <div className="ranking-line-track"></div>
        <div className="scoreboard-header-row">
          <span>#</span>
          <span>Kraj / Utwor</span>
          <span>Piosenka</span>
          <span>Wystep</span>
          <span>Scena</span>
          <span>Suma</span>
        </div>
        <div className="votes-grid draggable-ranking-list">
          {orderedEntries.map((entry, index) => (
            <SortableVoteCard
              key={entry.id}
              entry={entry}
              index={index}
              isLocked={isVotingLocked}
              criteria={criteriaScores[entry.id] ?? { song: 0, performance: 0, stage: 0 }}
              overall={voteState.scores[entry.id] ?? 0}
              onCriteriaChange={handleCriteriaChange}
              onClearEntry={handleClearEntryCriteria}
              onReshuffle={reshuffleRanking}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
