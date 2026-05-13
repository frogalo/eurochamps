"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
import { countryName, flagUrl } from "@/lib/media";

interface StageOption {
  id: string;
  name: string;
  year: string;
  round: string;
  status?: "OPEN" | "LOCKED";
}

interface UserVoteDetail {
  artistId: string;
  predictedPosition: number;
  pointsEarned: number;
}

interface DetailedLeaderboardRow {
  userId: string;
  username: string;
  displayName: string;
  points: number;
  imagePath?: string;
  votes: UserVoteDetail[];
}

interface ScoreboardArtist {
  id: string;
  name: string;
  country: string;
  finalPosition: number;
  imagePath?: string;
  song?: string;
  points?: number;
}

function RankingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { currentUser } = useUser();

  const [mounted, setMounted] = useState(false);
  const [stages, setStages] = useState<StageOption[]>([]);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [artists, setArtists] = useState<ScoreboardArtist[]>([]);
  const [users, setUsers] = useState<DetailedLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) {
      router.replace("/");
      return;
    }
    void loadStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, currentUser, router]);

  useEffect(() => {
    const stageIdFromQuery = params.get("stageId");
    if (stageIdFromQuery) {
      setSelectedStageId(stageIdFromQuery);
    }
  }, [params]);

  useEffect(() => {
    if (!selectedStageId || !currentUser) return;
    void loadLeaderboard(selectedStageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStageId, currentUser]);

  async function loadStages() {
    try {
      const response = await fetch("/api/stages");
      const data = (await response.json()) as { stages?: StageOption[]; error?: string };
      if (!response.ok || !data.stages) {
        setError(data.error ?? "Nie udalo sie pobrac konkursow.");
        return;
      }
      setStages(data.stages);
      if (!selectedStageId && data.stages.length > 0) {
        setSelectedStageId(data.stages[0].id);
      }
    } catch {
      setError("Nie udalo sie pobrac konkursow.");
    }
  }

  async function loadLeaderboard(stageId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ranking?stageId=${encodeURIComponent(stageId)}`, {
        headers: currentUser ? { "x-user-name": currentUser } : undefined,
      });
      const data = (await response.json()) as {
        artists?: ScoreboardArtist[];
        users?: DetailedLeaderboardRow[];
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Nie udalo sie pobrac rankingu.");
        setArtists([]);
        setUsers([]);
        return;
      }
      setArtists(data.artists ?? []);
      setUsers(data.users ?? []);
    } catch {
      setError("Nie udalo sie pobrac rankingu.");
      setArtists([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const selectedStage = useMemo(
    () => stages.find((stage) => stage.id === selectedStageId) ?? null,
    [stages, selectedStageId]
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!mounted || !currentUser) {
    return null;
  }

  return (
    <main className="app-shell">
      <section className="stage-header">
        <div className="hero-copy">
          <p className="eyebrow">Ranking</p>
          <h1 className="display-title">Wyniki konkursów.</h1>
          <p className="hero-text">
            Sprawdź jak Twoje typy wypadły na tle oficjalnych wyników i innych graczy.
          </p>
        </div>
        <div className="header-actions">
          <Button text="Wróć do konkursów" variant="secondary" onClick={() => router.push("/konkurs")} />
        </div>
      </section>

      <section className="section-panel" style={{ marginBottom: "1.5rem" }}>
        <label className="field-shell" htmlFor="stageId">
          <span className="field-label">Wybierz konkurs</span>
          <select
            id="stageId"
            className="field-input admin-select"
            value={selectedStageId}
            onChange={(event) => setSelectedStageId(event.target.value)}
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name} · {stage.year}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading ? (
        <p className="hero-text">Ładowanie rankingu...</p>
      ) : error ? (
        <p className="login-error">{error}</p>
      ) : artists.length === 0 ? (
        <p className="hero-text">
          Wyniki dla konkursu &quot;{selectedStage?.name}&quot; będą dostępne po zakończeniu głosowania.
        </p>
      ) : (
        <>
          <section className="ranking-vertical-line">
            <div className="ranking-line-track"></div>
            <div className="votes-grid static-ranking-grid">
              {artists.map((artist) => {
                const currentUserRow = users.find(u => u.username === currentUser);
                const otherUsers = users.filter(u => u.username !== currentUser);
                const currentUserVote = currentUserRow?.votes.find(v => v.artistId === artist.id);

                return (
                  <div key={artist.id} className="artist-result-card">
                    {/* Position outside */}
                    <div className="ranking-number outside">
                      {artist.finalPosition}
                    </div>

                    {/* Flag outside */}
                    {artist.country.length === 2 && (
                      <img 
                        className="flag-hero outside" 
                        src={flagUrl(artist.country)} 
                        alt={countryName(artist.country)} 
                      />
                    )}

                    <div className="result-card-inner">
                      <div className="result-card-main-info">
                        <div className="artist-card-copy">
                          <h3>{countryName(artist.country)}</h3>
                          <p className="artist-song">{artist.song}</p>
                          <p className="scoreboard-artist">{artist.name}</p>
                        </div>

                        <div className="official-points-badge">
                          <span className="points-label">Suma pkt</span>
                          <strong>{artist.points ?? 0}</strong>
                        </div>
                      </div>

                      <div className="result-card-perspective">
                        <div className="viewer-perspective-box">
                          <div className="viewer-label">Twoja prognoza</div>
                          <div className={`viewer-prediction ${currentUserVote?.predictedPosition === artist.finalPosition ? 'exact' : ''}`}>
                            <span className="viewer-pos">#{currentUserVote?.predictedPosition || '-'}</span>
                            {currentUserVote && currentUserVote.pointsEarned > 0 && (
                              <span className="viewer-pts">+{currentUserVote.pointsEarned} pkt</span>
                            )}
                          </div>
                        </div>

                        <div className="others-perspective-box">
                          <div className="votes-label">Inni gracze</div>
                          <div className="user-votes-wrap">
                            {otherUsers.map((user) => {
                              const vote = user.votes.find((v) => v.artistId === artist.id);
                              const isCorrect = vote?.predictedPosition === artist.finalPosition;
                              
                              return (
                                <div 
                                  key={user.userId} 
                                  className={`user-vote-chip mini ${isCorrect ? "correct" : ""}`}
                                  title={user.displayName}
                                >
                                  <div className="chip-avatar" style={{ overflow: "hidden" }}>
                                    {user.imagePath ? (
                                      <img src={user.imagePath} alt={user.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                      getInitials(user.displayName)
                                    )}
                                  </div>
                                  <span className="chip-pos">#{vote?.predictedPosition || "-"}</span>
                                  {vote && vote.pointsEarned > 0 && (
                                    <span className="chip-pts" style={{ fontSize: "0.65rem", color: "var(--secondary)", fontWeight: "bold" }}>
                                      +{vote.pointsEarned}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="leaderboard-summary">
            <h2 className="section-title">Ranking punktowy</h2>
            <div className="leaderboard-list">
              {users.map((user, index) => (
                <article key={user.userId} className={`leaderboard-row ${user.username === currentUser ? 'current-viewer-row' : ''}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="leaderboard-rank">#{index + 1}</div>
                    <div className="chip-avatar" style={{ width: "40px", height: "40px", fontSize: "0.9rem" }}>
                      {user.imagePath ? (
                        <img src={user.imagePath} alt={user.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        getInitials(user.displayName)
                      )}
                    </div>
                    <div className="leaderboard-copy">
                      <strong>{user.displayName} {user.username === currentUser ? '(Ty)' : ''}</strong>
                      <span>@{user.username}</span>
                    </div>
                  </div>
                  <strong className="leaderboard-score">{user.points} pkt</strong>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <style jsx>{`
        .static-ranking-grid {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          min-width: 0;
          padding-top: 1.5rem;
        }

        .ranking-vertical-line {
          overflow: visible !important;
        }

        .artist-result-card {
          position: relative;
          background: var(--surface-container-high);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
          margin-left: 1.5rem;
          z-index: 1;
          transition: z-index 0s, transform 300ms ease;
        }

        .artist-result-card:hover {
          z-index: 20;
        }

        .ranking-number.outside {
          position: absolute;
          left: -1.2rem;
          top: 10.2rem;
          width: 140px !important;
          text-align: center;
          font-size: 2.5rem !important;
          color: var(--primary) !important;
          z-index: 10;
          text-shadow: 0 0 20px rgba(255, 45, 149, 0.4);
          border: 0 !important;
          padding: 0 !important;
          font-style: italic;
        }

        .flag-hero.outside {
          position: absolute;
          left: -1.2rem;
          top: -1.5rem;
          width: 140px;
          height: 140px;
          object-fit: contain;
          border-radius: 0.75rem;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5));
          z-index: 15;
          transform: rotate(-2deg);
          transition: transform 300ms ease;
        }

        .artist-result-card:hover .flag-hero.outside {
          transform: rotate(0deg) scale(1.05);
        }

        .result-card-inner {
          padding-left: 10.5rem; /* Room for the flag */
          min-height: 8rem;
        }

        .result-card-main-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          padding-right: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .artist-card-copy h3 {
          font-size: 2rem !important;
          color: white;
          margin-bottom: 0.2rem !important;
        }

        .artist-song {
          font-size: 1.2rem !important;
          font-weight: 600;
          color: var(--secondary) !important;
        }

        .official-points-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.8rem 1.2rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .points-label {
          font-family: var(--font-label), sans-serif;
          font-size: 0.6rem;
          text-transform: uppercase;
          color: var(--on-surface-muted);
          margin-bottom: 0.2rem;
        }

        .official-points-badge strong {
          font-size: 2rem;
          color: var(--secondary);
          line-height: 1;
        }

        .result-card-perspective {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: rgba(0, 0, 0, 0.1);
        }

        .viewer-perspective-box {
          display: grid;
          gap: 0.5rem;
        }

        .viewer-label {
          font-family: var(--font-label), sans-serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--secondary);
        }

        .viewer-prediction {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
          padding: 0.6rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: fit-content;
        }

        .viewer-prediction.exact {
          border-color: var(--secondary);
          background: rgba(45, 226, 230, 0.12);
          box-shadow: 0 0 20px rgba(45, 226, 230, 0.1);
        }

        .viewer-pos {
          font-family: var(--font-display), sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .viewer-pts {
          font-family: var(--font-label), sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--secondary);
        }

        .others-perspective-box {
          display: grid;
          gap: 0.5rem;
        }

        .votes-label {
          font-family: var(--font-label), sans-serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--on-surface-muted);
        }

        .user-votes-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .user-vote-chip.mini {
          padding: 0.25rem 0.6rem 0.25rem 0.25rem;
          gap: 0.4rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          display: flex;
          align-items: center;
        }

        .user-vote-chip.mini.correct {
          border-color: var(--secondary);
          background: rgba(45, 226, 230, 0.08);
        }

        .chip-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--surface-container-highest);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          font-weight: 800;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .chip-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 50%;
        }

        .chip-pos {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .current-viewer-row {
          border: 1px solid var(--secondary);
          background: rgba(45, 226, 230, 0.1) !important;
          box-shadow: 0 0 24px rgba(45, 226, 230, 0.1);
        }

        .leaderboard-summary {
          max-width: 600px;
          margin: 4rem auto 0;
        }

        @media (max-width: 900px) {
          .flag-hero.outside {
            width: 120px;
            height: 81px;
          }
          .result-card-inner {
            padding-left: 8.5rem;
          }
          .artist-card-copy h3 {
            font-size: 1.6rem !important;
          }
        }

        @media (max-width: 800px) {
          .static-ranking-grid {
            gap: 1.5rem;
          }
          .artist-result-card {
            margin-left: 0.5rem;
          }
          .result-card-perspective {
            grid-template-columns: 1fr;
            gap: 1.2rem;
            padding-left: 1.2rem;
          }
          .flag-hero.outside {
            width: 84px;
            height: 84px;
            left: 0.8rem;
            top: 1rem;
            transform: none;
            object-fit: contain;
          }
          .artist-result-card:hover .flag-hero.outside {
            transform: scale(1.05);
          }
          .ranking-number.outside {
            left: 0.8rem;
            top: 7.5rem;
            font-size: 2rem !important;
            width: 84px !important;
            text-align: center;
          }
          .result-card-inner {
            padding-left: 7rem;
            padding-top: 0;
            min-height: 10.5rem;
          }
          .leaderboard-rank {
            font-family: var(--font-display), sans-serif;
            font-size: 1.2rem;
            font-weight: 900;
            color: var(--on-surface-muted);
            min-width: 2.5rem;
          }
          .result-card-main-info {
            padding: 1rem;
            padding-right: 1.5rem;
          }
          .artist-card-copy h3 {
            font-size: 1.2rem !important;
          }
          .artist-song {
            font-size: 0.85rem !important;
          }
          .scoreboard-artist {
            font-size: 0.6rem !important;
          }
          .official-points-badge strong {
            font-size: 1.4rem;
          }
          .viewer-pos {
            font-size: 1.2rem;
          }
          .viewer-pts {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 640px) {
          .app-shell {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </main>
  );
}

export default function RankingPage() {
  return (
    <Suspense fallback={<div className="app-shell"><p className="hero-text">Ładowanie...</p></div>}>
      <RankingContent />
    </Suspense>
  );
}
