"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
import { getStageById } from "@/lib/stages";
import {
  buildLeaderboard,
  countScoredEntries,
  createEmptyVoteState,
  readVoteState,
  voteStorageKey,
  type VoteState,
} from "@/lib/votes";
import { socket } from "@/socket";

function getAudienceTone(name: string) {
  let hash = 0;

  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash);
  }

  return `audience-tone-${(Math.abs(hash) % 4) + 1}`;
}

export default function StageDetail() {
  const { currentUser } = useUser();
  const router = useRouter();
  const params = useParams();
  const stageId = Array.isArray(params.id) ? params.id[0] : params.id;
  const stage = typeof stageId === "string" ? getStageById(stageId) : null;

  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [voteState, setVoteState] = useState<VoteState>(
    stage
      ? createEmptyVoteState(stage.entries)
      : { scores: {}, updatedAt: null, submittedAt: null }
  );

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

    if (!stage) {
      return;
    }

    const storedState = localStorage.getItem(voteStorageKey(currentUser, stage.id));
    setVoteState(readVoteState(storedState, stage.entries));
  }, [currentUser, mounted, router, stage]);

  useEffect(() => {
    if (!mounted || !currentUser || !stage) {
      return;
    }

    localStorage.setItem(
      voteStorageKey(currentUser, stage.id),
      JSON.stringify(voteState)
    );
  }, [currentUser, mounted, stage, voteState]);

  useEffect(() => {
    if (!currentUser || !stage) {
      return;
    }

    const joinRoom = () => {
      setIsConnected(true);
      socket.emit("join", { stage: stage.id, name: currentUser });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleCurrentUsers = (users: string[]) => {
      setConnectedUsers(users);
    };

    const handleUserJoined = (data: { name: string; stage?: string }) => {
      if (data.stage !== stage.id) {
        return;
      }

      setConnectedUsers((previous) =>
        previous.includes(data.name) ? previous : [...previous, data.name]
      );
    };

    const handleUserLeft = (data: { name: string; stage?: string }) => {
      if (data.stage !== stage.id) {
        return;
      }

      setConnectedUsers((previous) => previous.filter((name) => name !== data.name));
    };

    socket.on("connect", joinRoom);
    socket.on("disconnect", handleDisconnect);
    socket.on("currentUsers", handleCurrentUsers);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.emit("leaveStage", { stage: stage.id, name: currentUser });
      socket.off("connect", joinRoom);
      socket.off("disconnect", handleDisconnect);
      socket.off("currentUsers", handleCurrentUsers);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
    };
  }, [currentUser, stage]);

  if (!mounted || !currentUser) {
    return null;
  }

  if (!stage) {
    return (
      <main className="app-shell">
        <section className="section-panel empty-panel">
          <p className="eyebrow">Brak etapu</p>
          <h1 className="display-title">Taki etap nie istnieje.</h1>
          <Button text="Wroc do lobby" onClick={() => router.push("/etap")} />
        </section>
      </main>
    );
  }

  const scoredEntries = countScoredEntries(stage.entries, voteState.scores);
  const leaderboard = buildLeaderboard(stage.entries, voteState.scores);
  const podium = leaderboard.slice(0, 3);
  const restOfBoard = leaderboard.slice(3);
  const canSubmit = scoredEntries === stage.entries.length;

  const handleScoreChange = (entryId: string, event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const parsedValue = rawValue === "" ? null : Number(rawValue);
    const nextScore =
      parsedValue === null || Number.isNaN(parsedValue)
        ? null
        : Math.max(0, Math.min(12, parsedValue));

    setVoteState((previous) => ({
      scores: {
        ...previous.scores,
        [entryId]: nextScore,
      },
      updatedAt: new Date().toISOString(),
      submittedAt:
        previous.submittedAt && previous.scores[entryId] !== nextScore
          ? null
          : previous.submittedAt,
    }));
  };

  const handleSubmitVotes = () => {
    if (!canSubmit) {
      return;
    }

    setVoteState((previous) => ({
      ...previous,
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    }));
  };

  return (
    <main className="app-shell">
      <section className="stage-detail-header">
        <div className="hero-copy">
          <p className="eyebrow">{stage.round}</p>
          <h1 className="display-title">{stage.name}</h1>
          <p className="hero-text">{stage.tagline}</p>
        </div>
        <div className="header-actions">
          <Button
            text="Wroc do lobby"
            eyebrow="Drugorzedne"
            variant="secondary"
            onClick={() => router.push("/etap")}
          />
          <div className="live-chip">
            <span className={`live-dot ${isConnected ? "live-dot-active" : ""}`} />
            {isConnected ? "Polaczono" : "Ponowne laczenie"}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="section-panel presence-panel">
          <div className="section-heading">
            <p className="section-kicker">Publicznosc na zywo</p>
            <h2 className="section-title">Obecnosc w etapie</h2>
          </div>
          <div className="audience-row">
            {connectedUsers.map((name) => (
              <div key={name} className={`audience-pill ${getAudienceTone(name)}`}>
                <span>{name.slice(0, 1).toUpperCase()}</span>
              </div>
            ))}
          </div>
          <p className="support-copy">
            Polaczono: {connectedUsers.length}{" "}
            {connectedUsers.length === 1 ? "widza" : "widzow"} obserwujacych ten
            etap.
          </p>
        </div>

        <div className="section-panel summary-panel">
          <div className="section-heading">
            <p className="section-kicker">Status ocen</p>
            <h2 className="section-title">Twoj ranking</h2>
          </div>
          <div className="summary-metrics">
            <div className="metric-card">
              <span className="metric-label">Ukonczono</span>
              <strong>{scoredEntries}/{stage.entries.length}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Najwyzsza nota</span>
              <strong>{leaderboard[0]?.score ?? 0} pkt</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Status</span>
              <strong>{voteState.submittedAt ? "Wyslane" : "W trakcie"}</strong>
            </div>
          </div>
          <Button
            text={voteState.submittedAt ? "Aktualizuj zgloszenie" : "Zatwierdz oceny"}
            onClick={handleSubmitVotes}
            disabled={!canSubmit}
          />
        </div>
      </section>

      <section className="leaderboard-shell">
        {podium.map((entry, index) => (
          <article
            key={entry.id}
            className={`podium-card podium-rank-${index + 1}`}
          >
            <span className="podium-rank">#{index + 1}</span>
            <strong>{entry.country}</strong>
            <span>{entry.artist}</span>
            <em>{entry.score} pkt</em>
          </article>
        ))}
      </section>

      <section className="section-panel board-panel">
        <div className="section-heading">
          <p className="section-kicker">Ranking</p>
          <h2 className="section-title">Aktualna kolejnosc</h2>
        </div>
        <div className="leaderboard-list">
          {restOfBoard.map((entry, index) => (
            <div key={entry.id} className="leaderboard-row">
              <span className="leaderboard-rank">{index + 4}</span>
              <div className="leaderboard-copy">
                <strong>{entry.country}</strong>
                <span>{entry.artist}</span>
              </div>
              <span className="leaderboard-score">{entry.score} pkt</span>
            </div>
          ))}
        </div>
      </section>

      <section className="votes-grid">
        {stage.entries.map((entry) => (
          <article
            key={entry.id}
            className="artist-card"
            style={{
              background: `linear-gradient(160deg, ${entry.accentFrom}22, ${entry.accentTo}10), var(--surface-container-high)`,
            }}
          >
            <span
              className="country-chip"
              style={{
                background: `linear-gradient(135deg, ${entry.accentFrom}, ${entry.accentTo})`,
              }}
            >
              {entry.country}
            </span>
            <div className="artist-card-stage" />
            <div className="artist-card-copy">
              <p className="artist-song">{entry.song}</p>
              <h3>{entry.artist}</h3>
              <p className="support-copy">{entry.note}</p>
            </div>
            <label className="score-shell" htmlFor={entry.id}>
              <span className="score-label">Punkty</span>
              <input
                id={entry.id}
                className="score-input"
                type="number"
                min={0}
                max={12}
                value={voteState.scores[entry.id] ?? ""}
                onChange={(event) => handleScoreChange(entry.id, event)}
                placeholder="0-12"
              />
            </label>
          </article>
        ))}
      </section>
    </main>
  );
}
