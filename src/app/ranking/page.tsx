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
  song?: number;
  performance?: number;
  stageScore?: number;
  overall?: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'personal' | 'community'>('personal');
  const [selectedArtist, setSelectedArtist] = useState<ScoreboardArtist | null>(null);
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

  const communityStats = useMemo(() => {
    if (!artists.length || !users.length) return null;

    const statsMap = new Map<string, {
      song: number;
      performance: number;
      stage: number;
      overall: number;
      count: number;
    }>();

    artists.forEach(a => statsMap.set(a.id, { song: 0, performance: 0, stage: 0, overall: 0, count: 0 }));

    users.forEach(user => {
      user.votes.forEach(vote => {
        const s = statsMap.get(vote.artistId);
        if (s) {
          s.song += vote.song || 0;
          s.performance += vote.performance || 0;
          s.stage += vote.stageScore || 0;
          s.overall += vote.overall || 0;
          s.count++;
        }
      });
    });

    const artistAverages = new Map<string, any>();
    artists.forEach(artist => {
      const totals = statsMap.get(artist.id)!;
      artistAverages.set(artist.id, {
        artist,
        avgSong: totals.count > 0 ? totals.song / totals.count : 0,
        avgPerformance: totals.count > 0 ? totals.performance / totals.count : 0,
        avgStage: totals.count > 0 ? totals.stage / totals.count : 0,
        avgOverall: totals.count > 0 ? totals.overall / totals.count : 0,
        totalOverall: totals.overall,
        totalSong: totals.song,
        totalPerformance: totals.performance,
        totalStage: totals.stage,
        voterCount: totals.count
      });
    });

    const songStats = Array.from(artistAverages.values()).sort((a, b) => b.avgSong - a.avgSong);
    const performanceStats = Array.from(artistAverages.values()).sort((a, b) => b.avgPerformance - a.avgPerformance);
    const stageStats = Array.from(artistAverages.values()).sort((a, b) => b.avgStage - a.avgStage);
    const overallStats = Array.from(artistAverages.values()).sort((a, b) => b.avgOverall - a.avgOverall);
    const worstStats = Array.from(artistAverages.values()).sort((a, b) => a.avgOverall - b.avgOverall);

    const communityRanked = [...overallStats];

    return {
      bestSong: songStats[0],
      bestPerformance: performanceStats[0],
      bestStage: stageStats[0],
      bestOverall: overallStats[0],
      worstSong: worstStats[0],
      getCommunityRank: (artistId: string) => communityRanked.findIndex(a => a.artist.id === artistId) + 1,
      artistAverages
    };
  }, [artists, users]);

  const communitySortedArtists = useMemo(() => {
    if (!communityStats || !communityStats.artistAverages) return [];
    return Array.from(communityStats.artistAverages.values()).sort((a: any, b: any) => b.totalOverall - a.totalOverall);
  }, [communityStats]);

  const sortedArtists = useMemo(() => {
    const currentUserRow = users.find(u => u.username === currentUser);
    const isFinal = artists.some(a => a.finalPosition > 0);
    if (isFinal || !currentUserRow) return artists;
    return [...artists].sort((a, b) => {
      const voteA = currentUserRow.votes.find(v => v.artistId === a.id)?.predictedPosition || 999;
      const voteB = currentUserRow.votes.find(v => v.artistId === b.id)?.predictedPosition || 999;
      return voteA - voteB;
    });
  }, [artists, users, currentUser]);

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

      {loading ? (
        <p className="hero-text">Ładowanie rankingu...</p>
      ) : error ? (
        <p className="login-error">{error}</p>
      ) : (
        <>
          <section className="leaderboard-summary">
            <div className="leaderboard-header-row-alt">
              <h2 className="section-title">Ranking</h2>
            </div>
            <div className="leaderboard-list">
              {users.map((user, index) => (
                <article 
                  key={user.userId} 
                  className={`leaderboard-row ${user.username === currentUser ? 'current-viewer-row' : ''} ${index < 3 ? `top-rank-${index + 1}` : ''}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div className="leaderboard-rank">#{index + 1}</div>
                    <div className="chip-avatar leaderboard-avatar">
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

          <section className="ranking-vertical-line" style={{ marginTop: "1.5rem" }}>
            <h2 className="section-title" style={{ marginLeft: "0", marginBottom: "1.5rem" }}>Twoje głosy</h2>
            <div className="ranking-line-track"></div>
            <div className="votes-grid static-ranking-grid">
              {sortedArtists.map((artist) => {
                const currentUserRow = users.find(u => u.username === currentUser);
                const otherUsers = users.filter(u => u.username !== currentUser);
                const currentUserVote = currentUserRow?.votes.find(v => v.artistId === artist.id);
                const isFinal = artist.finalPosition > 0;

                return (
                  <div key={artist.id} className="artist-result-card">
                    <div className="ranking-number outside">
                      {isFinal ? `#${artist.finalPosition}` : "-"}
                    </div>

                    {artist.country.length === 2 && (
                      <img 
                        className="flag-hero outside" 
                        src={flagUrl(artist.country)} 
                        alt={countryName(artist.country)} 
                      />
                    )}

                    <div className="result-card-inner" onClick={() => { setSelectedArtist(artist); setModalMode('personal'); setIsModalOpen(true); }} style={{ cursor: "pointer" }}>
                      <div className="result-card-main-info">
                        <div className="artist-card-copy">
                          <h3>{countryName(artist.country)}</h3>
                          <p className="artist-song">{artist.song}</p>
                          <p className="scoreboard-artist">{artist.name}</p>
                        </div>

                         <div className="user-score-breakdown">
                          {isFinal ? (
                             <div className="score-item total">
                               <span>Głosy</span>
                               <strong>{artist.points ?? 0}</strong>
                             </div>
                          ) : (
                            <>
                              <div className="score-item">
                                <span>Piosenka</span>
                                <strong>{currentUserVote?.song ?? 0}</strong>
                              </div>
                              <div className="score-item">
                                <span>Występ</span>
                                <strong>{currentUserVote?.performance ?? 0}</strong>
                              </div>
                              <div className="score-item">
                                <span>Scena</span>
                                <strong>{currentUserVote?.stageScore ?? 0}</strong>
                              </div>
                              <div className="score-item total">
                                <span>Suma</span>
                                <strong>{currentUserVote?.overall ?? 0}</strong>
                              </div>
                            </>
                          )}
                        </div>
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
                            const isCorrect = isFinal && vote?.predictedPosition === artist.finalPosition;
                            
                            return (
                              <div key={user.userId} className="other-voter-item">
                                <div className={`voter-circle ${isCorrect ? "correct" : ""}`} title={user.displayName}>
                                  {user.imagePath ? (
                                    <img src={user.imagePath} alt={user.displayName} />
                                  ) : (
                                    getInitials(user.displayName)
                                  )}
                                  <div className="voter-mini-rank">#{vote?.predictedPosition || "-"}</div>
                                </div>
                                <div className="voter-label-name">
                                  {user.displayName.slice(0, 5)}{user.displayName.length > 5 ? '...' : ''}
                                </div>
                                {vote && vote.pointsEarned > 0 && (
                                  <div className="voter-gain-badge">+{vote.pointsEarned}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="section-divider"></div>

          <section className="community-highlights" style={{ marginBottom: "4rem" }}>
            <h2 className="section-title" style={{ marginLeft: "0", marginBottom: "2rem" }}>Wasze Najlepsze</h2>
            
            {communityStats && (
              <div className="hero-winner-wrap" style={{ marginBottom: "3rem" }}>
                <HighlightCard 
                  title="Wasz Faworyt" 
                  data={communityStats.bestOverall} 
                  score={communityStats.bestOverall.avgOverall}
                  rank={communityStats.getCommunityRank(communityStats.bestOverall.artist.id)}
                  isGold
                  isHero
                  onClick={() => { setSelectedArtist(communityStats.bestOverall.artist); setModalMode('community'); setIsModalOpen(true); }}
                />
              </div>
            )}

            <div className="highlights-grid">
              {communityStats && (
                <>
                  <HighlightCard 
                    title="Najlepsza Piosenka" 
                    data={communityStats.bestSong} 
                    score={communityStats.bestSong.avgSong}
                    rank={communityStats.getCommunityRank(communityStats.bestSong.artist.id)}
                    onClick={() => { setSelectedArtist(communityStats.bestSong.artist); setModalMode('community'); setIsModalOpen(true); }}
                  />
                  <HighlightCard 
                    title="Najlepszy Występ" 
                    data={communityStats.bestPerformance} 
                    score={communityStats.bestPerformance.avgPerformance}
                    rank={communityStats.getCommunityRank(communityStats.bestPerformance.artist.id)}
                    onClick={() => { setSelectedArtist(communityStats.bestPerformance.artist); setModalMode('community'); setIsModalOpen(true); }}
                  />
                  <HighlightCard 
                    title="Najlepsza Scena" 
                    data={communityStats.bestStage} 
                    score={communityStats.bestStage.avgStage}
                    rank={communityStats.getCommunityRank(communityStats.bestStage.artist.id)}
                    onClick={() => { setSelectedArtist(communityStats.bestStage.artist); setModalMode('community'); setIsModalOpen(true); }}
                  />
                  <HighlightCard 
                    title="Najsłabsza Piosenka" 
                    data={communityStats.worstSong} 
                    score={communityStats.worstSong.avgOverall}
                    rank={communityStats.getCommunityRank(communityStats.worstSong.artist.id)}
                    isWorst
                    onClick={() => { setSelectedArtist(communityStats.worstSong.artist); setModalMode('community'); setIsModalOpen(true); }}
                  />
                </>
              )}
            </div>
          </section>

          <div className="section-divider"></div>

          <section className="community-ranking-full" style={{ marginBottom: "6rem" }}>
            <h2 className="section-title" style={{ marginLeft: "0", marginBottom: "2rem" }}>Wasz Ranking</h2>
            <div className="static-ranking-grid">
              {communitySortedArtists.map((data: any, index: number) => {
                const artist = data.artist;
                const communityRank = index + 1;
                const isFinal = artist.finalPosition > 0;
                const diff = isFinal ? artist.finalPosition - communityRank : null;
                
                return (
                  <div key={artist.id} className="artist-result-card community-card">
                    <div className="ranking-number outside">
                      #{index + 1}
                    </div>

                    {artist.country.length === 2 && (
                      <img 
                        className="flag-hero outside" 
                        src={flagUrl(artist.country)} 
                        alt={countryName(artist.country)} 
                      />
                    )}

                    <div className="result-card-inner" onClick={() => { setSelectedArtist(artist); setModalMode('community'); setIsModalOpen(true); }} style={{ cursor: "pointer" }}>
                      <div className="result-card-main-info">
                        <div className="artist-card-copy">
                          <h3>{countryName(artist.country)}</h3>
                          <p className="artist-song">{artist.song}</p>
                          <p className="scoreboard-artist">{artist.name}</p>
                        </div>

                         <div className="user-score-breakdown">
                           <div className="score-item total">
                             <span>Suma pkt</span>
                             <strong>{data.totalOverall}</strong>
                           </div>
                           {isFinal && (
                             <div className="score-item official-diff">
                               <span>Finał: #{artist.finalPosition}</span>
                               <div className={`diff-pill-hero ${diff! > 0 ? 'neg' : diff! < 0 ? 'pos' : ''}`}>
                                 {diff === 0 ? '=' : `${diff! > 0 ? '↓' : '↑'}${Math.abs(diff!)}`}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>

                    <div className="result-card-perspective">
                      <div className="others-perspective-box" style={{ width: '100%' }}>
                        <div className="votes-label">Oceny graczy</div>
                        <div className="user-votes-wrap">
                          {users.map((user) => {
                            const vote = user.votes.find((v) => v.artistId === artist.id);
                            
                            return (
                              <div key={user.userId} className="other-voter-item">
                                <div className="voter-circle" title={user.displayName}>
                                  {user.imagePath ? (
                                    <img src={user.imagePath} alt={user.displayName} />
                                  ) : (
                                    getInitials(user.displayName)
                                  )}
                                </div>
                                <div className="voter-label-name">
                                  {user.displayName.slice(0, 5)}{user.displayName.length > 5 ? '...' : ''}
                                </div>
                                <div className="voter-gain-badge">+{vote?.overall || 0}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {isModalOpen && selectedArtist && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content score-modal" onClick={(event) => event.stopPropagation()}>
            <div className="score-modal-hero">
              {selectedArtist.imagePath ? (
                <img src={selectedArtist.imagePath} alt={selectedArtist.name} className="score-modal-image" />
              ) : (
                <div className="score-modal-image score-modal-fallback">{selectedArtist.name.slice(0, 2).toUpperCase()}</div>
              )}
              <div className="score-modal-hero-fade"></div>
              <button className="modal-close-btn score-modal-close" type="button" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
              <div className="score-modal-hero-copy">
                <p className="score-modal-country">{countryName(selectedArtist.country)}</p>
                <h2 className="section-title">{selectedArtist.name}</h2>
                <p className="artist-song">{selectedArtist.song}</p>
              </div>
              {selectedArtist.country.length === 2 && (
                <img
                  src={flagUrl(selectedArtist.country)}
                  alt={countryName(selectedArtist.country)}
                  className="score-modal-corner-flag"
                />
              )}
            </div>
            <div className="score-modal-fields-wrap">
              <div className="score-modal-overall">
                <span>{modalMode === 'personal' ? 'Twoja Suma' : 'Wasza Suma'}</span>
                <strong>
                  {modalMode === 'personal' 
                    ? (users.find(u => u.username === currentUser)?.votes.find(v => v.artistId === selectedArtist.id)?.overall ?? 0)
                    : (communityStats?.artistAverages.get(selectedArtist.id)?.totalOverall ?? 0)
                  }
                </strong>
              </div>
              
              <div className="score-modal-fields" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                <div className="score-modal-stat-box" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Piosenka</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem' }}>
                    {modalMode === 'personal'
                      ? (users.find(u => u.username === currentUser)?.votes.find(v => v.artistId === selectedArtist.id)?.song ?? 0)
                      : (communityStats?.artistAverages.get(selectedArtist.id)?.totalSong ?? 0)
                    }
                  </strong>
                </div>
                <div className="score-modal-stat-box" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Występ</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem' }}>
                    {modalMode === 'personal'
                      ? (users.find(u => u.username === currentUser)?.votes.find(v => v.artistId === selectedArtist.id)?.performance ?? 0)
                      : (communityStats?.artistAverages.get(selectedArtist.id)?.totalPerformance ?? 0)
                    }
                  </strong>
                </div>
                <div className="score-modal-stat-box" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Scena</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem' }}>
                    {modalMode === 'personal'
                      ? (users.find(u => u.username === currentUser)?.votes.find(v => v.artistId === selectedArtist.id)?.stageScore ?? 0)
                      : (communityStats?.artistAverages.get(selectedArtist.id)?.totalStage ?? 0)
                    }
                  </strong>
                </div>
              </div>

              <div className="score-modal-footer-info" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', textAlign: 'center' }}>
                <p style={{ margin: 0, opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  {modalMode === 'personal' ? 'Twoja prognoza na ten kraj' : 'Miejsce w waszym rankingu'}
                </p>
                <strong style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>
                  {modalMode === 'personal'
                    ? `#${users.find(u => u.username === currentUser)?.votes.find(v => v.artistId === selectedArtist.id)?.predictedPosition || '-'}`
                    : `#${communityStats?.getCommunityRank(selectedArtist.id)}`
                  }
                </strong>
              </div>
            </div>
          </div>
        </div>
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
          margin-left: 0;
        }

        .ranking-line-track {
          left: 0.35rem !important;
        }

        .artist-result-card {
          position: relative;
          background: var(--surface-container-high);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
          margin-left: 0;
          z-index: 1;
          transition: z-index 0s, transform 300ms ease;
        }

        .artist-result-card:hover {
          z-index: 20;
        }

        .ranking-number.outside {
          position: absolute;
          left: -1rem;
          top: 14.5rem;
          width: 160px !important;
          text-align: center;
          font-size: 3.5rem !important;
          color: var(--primary) !important;
          z-index: 10;
          text-shadow: 0 0 30px rgba(255, 45, 149, 0.5);
          border: 0 !important;
          padding: 0 !important;
          font-style: italic;
          font-weight: 900;
        }

        .flag-hero.outside {
          position: absolute;
          left: -1rem;
          top: -2.5rem;
          width: 160px;
          height: 160px;
          object-fit: contain;
          border-radius: 1rem;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6));
          z-index: 15;
          transform: rotate(-3deg);
          transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .artist-result-card:hover .flag-hero.outside {
          transform: rotate(0deg) scale(1.1);
        }

        .result-card-inner {
          padding-left: 11rem; /* Room for the flag */
          min-height: 10rem;
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

        .user-score-breakdown {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.8rem 1.2rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .score-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 3.5rem;
        }

        .score-item span {
          font-family: var(--font-label), sans-serif;
          font-size: 0.55rem;
          text-transform: uppercase;
          color: var(--on-surface-muted);
          margin-bottom: 0.2rem;
        }

        .score-item strong {
          font-size: 1.2rem;
          color: white;
          line-height: 1;
        }

        .score-item.total strong {
          color: var(--secondary);
          font-size: 1.4rem;
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
          gap: 1.2rem;
        }

        .other-voter-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 44px;
        }

        .voter-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--surface-container-highest);
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-weight: 800;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .voter-circle.correct {
          border-color: var(--secondary);
          box-shadow: 0 0 15px rgba(45, 226, 230, 0.3);
        }

        .voter-circle img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .voter-mini-rank {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: var(--surface-container-high);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 1px 4px;
          font-size: 0.65rem;
          font-weight: 800;
          color: white;
          z-index: 5;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .voter-label-name {
          font-size: 0.65rem;
          opacity: 0.7;
          color: white;
          text-align: center;
          white-space: nowrap;
          font-weight: 600;
        }

        .voter-gain-badge {
          margin-top: -2px;
          font-family: var(--font-label), sans-serif;
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--secondary);
          background: rgba(45, 226, 230, 0.1);
          padding: 1px 4px;
          border-radius: 4px;
          border: 1px solid rgba(45, 226, 230, 0.2);
        }

        .current-viewer-row {
          border: 1px solid var(--secondary);
          background: rgba(45, 226, 230, 0.1) !important;
          box-shadow: 0 0 30px rgba(45, 226, 230, 0.15);
        }

        .leaderboard-summary {
          width: 100%;
          margin: 1rem 0 2rem 0;
        }

        .leaderboard-header-row-alt {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
          padding-right: 0.5rem;
        }

        .leaderboard-avatar {
          width: 72px !important;
          height: 72px !important;
          font-size: 1.4rem !important;
          border: 2px solid rgba(255, 255, 255, 0.15);
        }

        .top-rank-1 {
          background: linear-gradient(90deg, rgba(255, 215, 0, 0.12), transparent) !important;
          border-left: 6px solid #ffd700 !important;
        }

        .top-rank-1 .leaderboard-rank {
          color: #ffd700 !important;
          font-size: 1.8rem;
        }

        .top-rank-2 {
          background: linear-gradient(90deg, rgba(192, 192, 192, 0.12), transparent) !important;
          border-left: 6px solid #c0c0c0 !important;
        }

        .top-rank-2 .leaderboard-rank {
          color: #c0c0c0 !important;
          font-size: 1.6rem;
        }

        .top-rank-3 {
          background: linear-gradient(90deg, rgba(205, 127, 50, 0.12), transparent) !important;
          border-left: 6px solid #cd7f32 !important;
        }

        .top-rank-3 .leaderboard-rank {
          color: #cd7f32 !important;
          font-size: 1.4rem;
        }

        .leaderboard-rank {
          font-family: var(--font-display), sans-serif;
          font-weight: 900;
          font-size: 1.2rem;
          min-width: 3rem;
          text-align: center;
          color: var(--on-surface-muted);
        }

        @media (max-width: 900px) {
          .flag-hero.outside {
            width: 140px;
            height: 140px;
            top: -1.5rem;
          }
          .ranking-number.outside {
            width: 140px !important;
            top: 11rem;
            font-size: 2.5rem !important;
          }
          .result-card-inner {
            padding-left: 10.5rem;
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
            margin-left: 0;
          }
          .result-card-perspective {
            grid-template-columns: 1fr;
            gap: 1.2rem;
            padding: 1rem;
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
            top: 7.8rem;
            font-size: 2.2rem !important;
            width: 84px !important;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .result-card-inner {
            padding-left: 6.5rem;
            padding-top: 0;
            min-height: 10.5rem;
          }
          .result-card-main-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
          }
          .user-score-breakdown {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.8rem;
          }
          .score-item {
            min-width: 0;
            flex: 1;
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
            padding-bottom: 4rem;
          }
        }

        .diff-pill-hero {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 800;
          font-family: var(--font-label), sans-serif;
          line-height: 1;
        }

        .diff-pill-hero.pos {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }

        .diff-pill-hero.neg {
          background: rgba(248, 113, 113, 0.2);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
        }

        .diff-pill-hero.mini {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
        }

        .official-diff {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.8rem 1.2rem !important;
          border-radius: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .official-diff span {
          font-size: 0.65rem;
          text-transform: uppercase;
          opacity: 0.7;
          letter-spacing: 0.05em;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 5rem 0;
          width: 100%;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          padding-top: 2rem;
        }

        @media (max-width: 600px) {
          .highlights-grid {
            gap: 2.5rem;
            grid-template-columns: 1fr;
          }
          .highlight-card {
            aspect-ratio: auto;
            min-height: 20rem;
          }
        }
      `}</style>
    </main>
  );
}

function HighlightCard({ title, data, score, rank, isGold, isWorst, isHero, onClick }: { 
  title: string, 
  data: any, 
  score: number, 
  rank: number,
  isGold?: boolean, 
  isWorst?: boolean,
  isHero?: boolean,
  onClick?: () => void
}) {
  const { artist, totalOverall } = data;
  const isFinal = artist.finalPosition > 0;
  const diff = isFinal ? artist.finalPosition - rank : null;
  
  return (
    <div className={`highlight-card ${isGold ? 'gold' : ''} ${isWorst ? 'worst' : ''} ${isHero ? 'hero-card' : ''}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <img src={flagUrl(artist.country)} alt={artist.country} className="highlight-flag-outside" />
      
      <div className="highlight-category-title">{title}</div>
      
      <div className="highlight-content-wrap">
        <h3>{countryName(artist.country)}</h3>
        <p>{artist.name}</p>
      </div>

      <div className="highlight-stats-footer">
        <div className="score-container-hero">
           <div className="score-main">
              <span className="score-val">{isHero ? totalOverall : score.toFixed(1)}</span>
              <span className="score-label">{isHero ? "Suma punktów" : "Średnia punktów"}</span>
           </div>
           {isHero && (
             <div className="hero-sub-stat">
               <span>Średnia: {score.toFixed(1)}</span>
             </div>
           )}
        </div>

        {isFinal && (
          <div className="official-container-hero">
            <div className="official-info">
              <span className="official-label">Finał</span>
              <strong className="official-rank">Miejsce #{artist.finalPosition}</strong>
            </div>
            <div className={`diff-pill-hero ${diff! > 0 ? 'neg' : diff! < 0 ? 'pos' : ''}`}>
               {diff === 0 ? '=' : `${diff! > 0 ? '↓' : '↑'}${Math.abs(diff!)}`}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .highlight-card {
          position: relative;
          background: var(--surface-container-high);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2rem;
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: visible;
        }

        .hero-card {
          aspect-ratio: auto;
          min-height: 25rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .highlight-card:hover {
          transform: translateY(-10px) scale(1.02);
          z-index: 10;
        }

        .highlight-card.gold {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), var(--surface-container-high));
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 20px 50px rgba(255, 215, 0, 0.15);
        }

        .highlight-category-title {
          font-family: var(--font-label), sans-serif;
          font-size: 0.7rem !important;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--secondary);
          margin-bottom: 1.5rem !important;
        }

        .highlight-flag-outside {
          position: absolute;
          top: -1.5rem;
          right: -0.5rem;
          width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 1rem;
          filter: drop-shadow(0 15px 30px rgba(0,0,0,0.6));
          transform: rotate(8deg);
          transition: transform 400ms ease;
        }

        .highlight-card:hover .highlight-flag-outside {
          transform: rotate(0deg) scale(1.1);
        }

        .highlight-content-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .highlight-content-wrap h3 {
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          margin: 0;
          line-height: 1.1;
          color: white;
        }

        .hero-card .highlight-content-wrap h3 {
          font-size: 2.5rem;
        }

        .highlight-content-wrap p {
          font-size: 1rem;
          opacity: 0.7;
          margin: 0;
          color: var(--secondary);
          font-weight: 600;
        }

        .highlight-stats-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 10;
        }

        .score-container-hero {
          background: linear-gradient(135deg, rgba(45, 226, 230, 0.15), rgba(45, 226, 230, 0.05));
          border: 1px solid rgba(45, 226, 230, 0.3);
          border-radius: 1.5rem;
          padding: 1.2rem;
          text-align: center;
          box-shadow: 0 8px 32px rgba(45, 226, 230, 0.1);
        }

        .highlight-card.worst .score-container-hero {
          background: linear-gradient(135deg, rgba(255, 45, 149, 0.15), rgba(255, 45, 149, 0.05));
          border-color: rgba(255, 45, 149, 0.3);
          box-shadow: 0 8px 32px rgba(255, 45, 149, 0.1);
        }

        .score-main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .score-val {
          font-family: var(--font-display), sans-serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--secondary);
          line-height: 1;
          text-shadow: 0 0 20px rgba(45, 226, 230, 0.4);
        }

        .hero-card .score-val {
          font-size: 3.5rem;
        }

        .highlight-card.worst .score-val {
          color: var(--primary);
          text-shadow: 0 0 20px rgba(255, 45, 149, 0.4);
        }

        .score-label {
          font-family: var(--font-label), sans-serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 0.4rem;
          opacity: 0.8;
          color: white;
        }

        .hero-sub-stat {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--secondary);
          opacity: 0.9;
        }

        .official-container-hero {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.2rem;
          padding: 0.8rem 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .official-info {
          display: flex;
          flex-direction: column;
        }

        .official-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          opacity: 0.6;
          color: white;
        }

        .official-rank {
          font-size: 1.2rem;
          color: white;
          font-weight: 700;
        }

        .diff-pill-hero {
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 800;
          font-family: var(--font-label), sans-serif;
        }

        .diff-pill-hero.pos {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }

        .diff-pill-hero.neg {
          background: rgba(248, 113, 113, 0.2);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
        }
      `}</style>
    </div>
  );
}

export default function RankingPage() {
  return (
    <Suspense fallback={<div className="app-shell"><p className="hero-text">Ładowanie...</p></div>}>
      <RankingContent />
    </Suspense>
  );
}
