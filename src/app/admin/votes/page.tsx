"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import CustomSelect from "@/components/CustomSelect";
import { useUser } from "@/context/UserContext";
import { getAdminHeaders } from "@/lib/admin-client";
import { flagUrl } from "@/lib/media";

interface StageOption {
  id: string;
  name: string;
  year: string;
  place: string;
  disabledArtists?: string[];
  status?: "OPEN" | "LOCKED";
}

interface ArtistEntry {
  id: string;
  name: string;
  country: string;
  songPath: string;
  imagePath: string;
  year?: string;
}

export default function AdminVotesPage() {
  const router = useRouter();
  const { currentUser, currentUsername, isAdmin } = useUser();
  const [mounted, setMounted] = useState(false);
  const [stages, setStages] = useState<StageOption[]>([]);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [entries, setEntries] = useState<ArtistEntry[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSavingVotes, setIsSavingVotes] = useState(false);
  const [isSavingFinal, setIsSavingFinal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) {
      router.replace("/");
      return;
    }
    if (!isAdmin) {
      router.replace("/konkurs");
      return;
    }
    void loadStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, currentUser, isAdmin, router]);

  useEffect(() => {
    if (!selectedStageId || !(currentUsername ?? currentUser)) return;
    void loadArtistsForStage(selectedStageId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStageId, currentUser, currentUsername]);

  async function loadStages() {
    try {
      setError(null);
      const response = await fetch("/api/admin/stages", {
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { error?: string; stages?: StageOption[] };
      if (!response.ok || !data.stages) {
        setError(data.error ?? "Nie udalo sie pobrac konkursow.");
        return;
      }
      setStages(data.stages);
    } catch {
      setError("Nie udalo sie pobrac konkursow.");
    }
  }

  async function loadArtistsForStage(stageId: string) {
    try {
      setError(null);
      const stage = stages.find((s) => s.id === stageId);
      if (!stage) return;

      const response = await fetch("/api/admin/artists", {
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { error?: string; artists?: ArtistEntry[] };
      if (!response.ok || !data.artists) {
        setError(data.error ?? "Nie udalo sie pobrac artystow.");
        return;
      }

      const disabledSet = new Set(stage.disabledArtists || []);
      const filtered = data.artists.filter((artist) => {
        if (artist.year !== stage.year) return false;
        if (disabledSet.has(artist.id)) return false;
        return true;
      });
      setEntries(filtered);
      setScores({});
    } catch {
      setError("Nie udalo sie pobrac artystow.");
    }
  }



  async function handleSubmitVotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedStageId) {
      setError("Wybierz konkurs.");
      return;
    }

    setIsSavingVotes(true);
    setError(null);
    setNotice(null);

    try {
      const votes = Object.entries(scores)
        .filter(([, value]) => value !== "")
        .map(([artistId, value]) => ({
          artistId,
          rank: Number(value),
        }));

      const response = await fetch("/api/admin/votes", {
        method: "POST",
        headers: getAdminHeaders(currentUsername ?? currentUser, true),
        body: JSON.stringify({
          stageId: selectedStageId,
          voterName: "ADMIN",
          voteType: "JURY",
          votes,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Nie udalo sie zapisac glosow.");
        return;
      }
      setNotice(`Zapisano ${votes.length} glosow.`);
    } catch {
      setError("Nie udalo sie zapisac glosow.");
    } finally {
      setIsSavingVotes(false);
    }
  }

  async function handleSaveFinalRanking() {
    if (!selectedStageId) {
      setError("Wybierz konkurs.");
      return;
    }

    const sortedEntries = [...entries].sort((a, b) => {
      const scoreA = Number(scores[a.id]) || 0;
      const scoreB = Number(scores[b.id]) || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return a.country.localeCompare(b.country);
    });

    const rankings = sortedEntries.map((entry, index) => ({
      artistId: entry.id,
      position: index + 1,
      points: Number(scores[entry.id]) || 0,
    }));

    setIsSavingFinal(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/final-ranking", {
        method: "POST",
        headers: getAdminHeaders(currentUsername ?? currentUser, true),
        body: JSON.stringify({
          stageId: selectedStageId,
          rankings,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Nie udalo sie zapisac rankingu finalnego.");
        return;
      }
      setNotice("Ranking finalny zapisany.");
    } catch {
      setError("Nie udalo sie zapisac rankingu finalnego.");
    } finally {
      setIsSavingFinal(false);
    }
  }

  if (!mounted || !currentUser || !isAdmin) return null;

  const selectedStage = stages.find((stage) => stage.id === selectedStageId);
  const stageOptions = stages.map((stage) => ({
    value: stage.id,
    label: `${stage.name} · ${stage.year} · ${stage.place}`,
  }));

  return (
    <main className="app-shell">
      <section className="stage-header">
        <div className="hero-copy">
          <p className="eyebrow">Admin / Wyniki</p>
          <h1 className="display-title">Final rankingi konkursow.</h1>
        </div>
        <div className="header-actions">
          <Button text="Powrot do panelu" variant="secondary" onClick={() => router.push("/konkurs")} />
        </div>
      </section>

      <section className="section-panel admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="section-heading">
          <p className="section-kicker">Wybor konkursu</p>
          <h2 className="section-title">Wybierz konkurs</h2>
        </div>
        <div className="admin-form-grid" style={{ marginTop: "1rem", maxWidth: "480px" }}>
          <CustomSelect
            label="Konkurs"
            options={stageOptions}
            value={selectedStageId}
            onChange={setSelectedStageId}
            placeholder="Wybierz konkurs..."
          />
        </div>
      </section>

      {selectedStageId && (
        <form onSubmit={handleSubmitVotes}>
          <section className="admin-layout">
            <article className="section-panel admin-panel">
              <div className="admin-inline-actions">
                <Button
                  text={isSavingVotes ? "Zapisywanie glosow..." : "Zapisz glosy admina"}
                  type="submit"
                  disabled={isSavingVotes}
                />
                <Button
                  text={isSavingFinal ? "Zapisywanie finalu..." : "Zapisz ranking finalny"}
                  onClick={handleSaveFinalRanking}
                  disabled={isSavingFinal}
                />
              </div>
              {error ? <p className="login-error">{error}</p> : null}
              {notice ? <p className="admin-notice">{notice}</p> : null}
            </article>
          </section>

          <section className="admin-votes-list">
            {entries.map((entry) => (
              <article key={entry.id} className="section-panel admin-vote-row">
                <div className="admin-vote-copy">
                  <div className="entry-card-header">
                    {entry.imagePath ? (
                      <img
                        className="entry-flag entry-flag-sm"
                        src={entry.imagePath}
                        alt={entry.name}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : entry.country.length === 2 ? (
                      <img className="entry-flag entry-flag-sm" src={flagUrl(entry.country)} alt={entry.country} />
                    ) : null}
                    <div>
                      <p className="stage-card-date">{entry.country}</p>
                      <h2 className="section-title">{entry.name}</h2>
                    </div>
                  </div>
                  <p className="hero-text">{entry.songPath}</p>
                </div>

                <label className="score-shell admin-score-shell">
                  <span className="score-label">Punkty</span>
                  <input
                    className="score-input"
                    type="number"
                    min="0"
                    value={scores[entry.id] ?? ""}
                    onChange={(event) =>
                      setScores((current) => ({ ...current, [entry.id]: event.target.value }))
                    }
                  />
                </label>

              </article>
            ))}
          </section>
        </form>
      )}
    </main>
  );
}
