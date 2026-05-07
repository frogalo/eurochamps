"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
import { STAGES } from "@/lib/stages";
import {
  countScoredEntries,
  readVoteState,
  voteStorageKey,
} from "@/lib/votes";

type StageStatus = "ready" | "draft" | "submitted";

const STATUS_LABELS: Record<StageStatus, string> = {
  ready: "Gotowe",
  draft: "Szkic",
  submitted: "Wysłane",
};

export default function Stage() {
  const router = useRouter();
  const { currentUser, logout } = useUser();
  const [mounted, setMounted] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, StageStatus>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!currentUser) {
      router.replace("/");
      return;
    }

    const nextStatusMap = STAGES.reduce<Record<string, StageStatus>>(
      (result, stage) => {
        const stored = localStorage.getItem(voteStorageKey(currentUser, stage.id));
        const voteState = readVoteState(stored, stage.entries);
        const scoredEntries = countScoredEntries(stage.entries, voteState.scores);

        if (voteState.submittedAt) {
          result[stage.id] = "submitted";
        } else if (scoredEntries > 0) {
          result[stage.id] = "draft";
        } else {
          result[stage.id] = "ready";
        }

        return result;
      },
      {}
    );

    setStatusMap(nextStatusMap);
  }, [currentUser, mounted, router]);

  const handleChangeUser = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !currentUser) {
    return null;
  }

  return (
    <main className="app-shell">
      <section className="stage-header">
        <div className="hero-copy">
          <p className="eyebrow">Lobby areny</p>
          <h1 className="display-title">Wybierz dzisiejszy etap.</h1>
          <p className="hero-text">
            Każdy etap ma własny ranking na żywo, listę obecnych widzów i
            zapisane noty dla <strong>{currentUser}</strong>.
          </p>
        </div>
        <div className="lobby-actions">
          <div className="status-ribbon compact">
            <span className="status-ribbon-label">Aktywne konto</span>
            <strong>{currentUser}</strong>
          </div>
          <Button
            text="Zmień użytkownika"
            eyebrow="Drugorzędne"
            variant="secondary"
            onClick={handleChangeUser}
          />
        </div>
      </section>

      <section className="stage-grid">
        {STAGES.map((stage, index) => {
          const status = statusMap[stage.id] ?? "ready";
          const stored = localStorage.getItem(voteStorageKey(currentUser, stage.id));
          const voteState = readVoteState(stored, stage.entries);
          const progress = countScoredEntries(stage.entries, voteState.scores);

          return (
            <button
              key={stage.id}
              type="button"
              className="stage-card"
              style={{
                transform:
                  index === 1
                    ? "translateY(28px)"
                    : index === 2
                      ? "translateY(-18px)"
                      : "translateY(0px)",
              }}
              onClick={() => router.push(`/etap/${stage.id}`)}
            >
              <span className={`status-pill status-pill-${status}`}>
                {STATUS_LABELS[status]}
              </span>
              <p className="stage-card-date">{stage.date}</p>
              <h2 className="stage-card-title">{stage.name}</h2>
              <p className="stage-card-round">{stage.round}</p>
              <p className="stage-card-copy">{stage.description}</p>
              <div className="stage-card-footer">
                <span className="metric-label">Ocenione występy</span>
                <strong>{progress}/{stage.entries.length}</strong>
              </div>
            </button>
          );
        })}
      </section>
    </main>
  );
}
