"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import CustomSelect from "@/components/CustomSelect";
import { useUser } from "@/context/UserContext";
import { getAdminHeaders } from "@/lib/admin-client";

const flagUrl = (code: string) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

interface StageRecord {
  id: string;
  name: string;
  year: string;
  place: string;
  logoUrl: string;
  round: string;
  date: string;
  tagline: string;
  description: string;
  status: "OPEN" | "LOCKED";
  disabledArtists?: string[];
  _count: { votes: number };
}

interface ArtistRecord {
  id: string;
  name: string;
  year: string;
  country: string;
}

const EMPTY_FORM = {
  name: "",
  year: "",
  place: "",
  logoUrl: "",
  round: "",
  date: "",
  tagline: "",
  description: "",
  status: "OPEN" as "OPEN" | "LOCKED",
  disabledArtists: [] as string[],
};

export default function AdminStagesPage() {
  const router = useRouter();
  const { currentUser, currentUsername, isAdmin } = useUser();
  const [mounted, setMounted] = useState(false);
  const [stages, setStages] = useState<StageRecord[]>([]);
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) { router.replace("/"); return; }
    if (!isAdmin) { router.replace("/konkurs"); return; }
    void loadStages();
    void loadArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdmin, mounted, router]);

  async function loadArtists() {
    try {
      const response = await fetch("/api/admin/artists", {
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { artists?: ArtistRecord[] };
      if (data.artists) {
        setArtists(data.artists);
      }
    } catch {
      console.error("Failed to load artists");
    }
  }

  async function loadStages() {
    try {
      setError(null);
      const response = await fetch("/api/admin/stages", {
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { error?: string; stages?: StageRecord[] };
      if (!response.ok || !data.stages) {
        setError(data.error ?? "Nie udało się pobrać konkursów.");
        return;
      }
      setStages(data.stages);
    } catch {
      setError("Nie udało się pobrać konkursów.");
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      const url = editingId ? `/api/admin/stages/${editingId}` : "/api/admin/stages";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(currentUsername ?? currentUser, true),
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Nie udało się zapisać konkursu.");
        return;
      }

      setNotice(editingId ? "Zaktualizowano konkurs." : "Dodano konkurs.");
      resetForm();
      await loadStages();
    } catch {
      setError("Nie udało się zapisać konkursu.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(stageId: string) {
    if (!window.confirm("Czy na pewno chcesz usunąć ten konkurs? Wszystkie przypisane do niego głosy, wyniki i rankingi zostaną bezpowrotnie usunięte.")) {
      return;
    }
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/stages/${stageId}`, {
        method: "DELETE",
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Nie udało się usunąć konkursu.");
        return;
      }
      setNotice("Usunięto konkurs.");
      if (editingId === stageId) resetForm();
      await loadStages();
    } catch {
      setError("Nie udało się usunąć konkursu.");
    }
  }

  async function toggleStatus(stage: StageRecord) {
    const newStatus = (stage.status ?? "OPEN") === "OPEN" ? "LOCKED" : "OPEN";
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/stages/${stage.id}`, {
        method: "PUT",
        headers: getAdminHeaders(currentUsername ?? currentUser, true),
        body: JSON.stringify({
          name: stage.name,
          year: stage.year,
          place: stage.place,
          logoUrl: stage.logoUrl,
          round: stage.round,
          date: stage.date,
          tagline: stage.tagline,
          description: stage.description,
          status: newStatus,
          disabledArtists: stage.disabledArtists || [],
        }),
      });
      if (!response.ok) {
        setError("Nie udało się zmienić statusu.");
        return;
      }
      setNotice(`Konkurs ${stage.name} jest teraz ${newStatus === "OPEN" ? "otwarty" : "zablokowany"}.`);
      await loadStages();
    } catch {
      setError("Nie udało się zmienić statusu.");
    }
  }

  if (!mounted || !currentUser || !isAdmin) return null;

  return (
    <main className="app-shell">
      <section className="stage-header">
        <div className="hero-copy">
          <p className="eyebrow">Admin / Konkursy</p>
          <h1 className="display-title">Zarządzaj konkursami.</h1>
          <p className="hero-text">
            Twórz, edytuj i usuwaj konkursy — każdy to osobny konkurs z rokiem, miastem i logo.
          </p>
        </div>
        <div className="header-actions">
          <Button
            text="Powrót do panelu"
            variant="secondary"
            onClick={() => router.push("/konkurs")}
          />
        </div>
      </section>

      <section className="section-panel admin-panel" style={{ marginBottom: "1.5rem" }}>
        <div className="section-heading">
          <p className="section-kicker">
            {editingId ? "Edycja konkursu" : "Nowy konkurs"}
          </p>
          <h2 className="section-title">Formularz konkursu</h2>
        </div>

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <label className="field-shell">
            <span className="field-label">Nazwa konkursu</span>
            <input
              className="field-input"
              value={form.name}
              onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
              placeholder="np. Półfinał 1"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Rok</span>
            <input
              className="field-input"
              value={form.year}
              onChange={(e) => {
                const newYear = e.target.value;
                setForm((c) => {
                  // If we are creating a new stage and changing year, 
                  // we should probably exclude all artists by default as requested
                  const updatedForm = { ...c, year: newYear };
                  if (!editingId && newYear) {
                    const yearArtists = artists.filter(a => a.year === newYear);
                    updatedForm.disabledArtists = yearArtists.map(a => a.id);
                  }
                  return updatedForm;
                });
              }}
              placeholder="np. 2026"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Miasto</span>
            <input
              className="field-input"
              value={form.place}
              onChange={(e) => setForm((c) => ({ ...c, place: e.target.value }))}
              placeholder="np. Wiedeń"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Logo (URL)</span>
            <input
              className="field-input"
              value={form.logoUrl}
              onChange={(e) => setForm((c) => ({ ...c, logoUrl: e.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Runda</span>
            <input
              className="field-input"
              value={form.round}
              onChange={(e) => setForm((c) => ({ ...c, round: e.target.value }))}
              placeholder="np. Noc otwarcia"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Data</span>
            <input
              className="field-input"
              value={form.date}
              onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))}
              placeholder="np. 19 maja"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Tagline</span>
            <input
              className="field-input"
              value={form.tagline}
              onChange={(e) => setForm((c) => ({ ...c, tagline: e.target.value }))}
              placeholder="Krótkie hasło"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Opis</span>
            <input
              className="field-input"
              value={form.description}
              onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
              placeholder="Krótki opis konkursu"
            />
          </label>

          <CustomSelect
            label="Status konkursu"
            options={[
              { value: "OPEN", label: "Otwarty (Głosowanie)" },
              { value: "LOCKED", label: "Zablokowany" },
            ]}
            value={form.status}
            onChange={(val) => setForm((c) => ({ ...c, status: val as any }))}
          />

          {form.year && (
            <div className="field-shell" style={{ gridColumn: "1 / -1" }}>
              <span className="field-label">Artyści ({form.year})</span>
              <p className="support-copy" style={{ fontSize: "0.85rem", marginTop: "-0.3rem" }}>
                Zaznacz artystów, którzy biorą udział w tym konkursie.
              </p>
              <div className="artists-selection-grid">
                {artists
                  .filter((a) => a.year === form.year)
                  .map((artist) => {
                    const isSelected = !form.disabledArtists.includes(artist.id);
                    return (
                      <label 
                        key={artist.id} 
                        className={`custom-checkbox-label ${isSelected ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="hidden-checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Include: remove from disabled
                              setForm((c) => ({ 
                                ...c, 
                                disabledArtists: c.disabledArtists.filter((id) => id !== artist.id) 
                              }));
                            } else {
                              // Exclude: add to disabled
                              setForm((c) => ({ 
                                ...c, 
                                disabledArtists: [...c.disabledArtists, artist.id] 
                              }));
                            }
                          }}
                        />
                        <div className="checkbox-visual">
                          {isSelected && <span className="check-mark">✓</span>}
                        </div>
                        <div className="checkbox-content">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={flagUrl(artist.country)} alt={artist.country} className="artist-flag-mini" />
                            <span className="artist-country-code">{artist.country}</span>
                          </div>
                          <span className="artist-display-name">{artist.name}</span>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="admin-inline-actions" style={{ gridColumn: "1 / -1" }}>
            <Button
              text={isSaving ? "Zapisywanie..." : editingId ? "Zapisz zmiany" : "Dodaj konkurs"}
              type="submit"
              disabled={isSaving}
            />
            {editingId && (
              <Button text="Anuluj edycję" variant="secondary" onClick={resetForm} />
            )}
          </div>
        </form>

        {error ? <p className="login-error">{error}</p> : null}
        {notice ? <p className="admin-notice">{notice}</p> : null}
      </section>

      <section className="admin-entries-grid">
        {stages.map((stage) => (
          <article key={stage.id} className="section-panel admin-entry-card">
            <div className="entry-card-header">
              {stage.logoUrl && (
                <img
                  className="entry-flag"
                  src={stage.logoUrl}
                  alt=""
                />
              )}
              <div>
                <p className="stage-card-date">{stage.year} · {stage.place}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <h2 className="section-title">{stage.name}</h2>
                  <span className={`status-pill status-pill-${(stage.status ?? "OPEN") === "OPEN" ? "ready" : "submitted"}`}>
                    {(stage.status ?? "OPEN") === "OPEN" ? "Otwarty" : "Zablokowany"}
                  </span>
                </div>
              </div>
            </div>
            {stage.round && <p className="hero-text">{stage.round}</p>}
            {stage.tagline && <p className="support-copy">{stage.tagline}</p>}
            <div className="stage-card-footer">
              <span className="metric-label">Głosy</span>
              <strong>{stage._count.votes}</strong>
            </div>
            <div className="admin-inline-actions">
              <Button
                text={(stage.status ?? "OPEN") === "OPEN" ? "Zablokuj" : "Otwórz"}
                onClick={() => void toggleStatus(stage)}
              />
              <Button
                text="Edytuj"
                variant="secondary"
                onClick={() => {
                  setEditingId(stage.id);
                  setForm({
                    name: stage.name,
                    year: stage.year,
                    place: stage.place,
                    logoUrl: stage.logoUrl,
                    round: stage.round,
                    date: stage.date,
                    tagline: stage.tagline,
                    description: stage.description,
                    status: stage.status ?? "OPEN",
                    disabledArtists: stage.disabledArtists || [],
                  });
                }}
              />
              <Button
                text="Usuń"
                variant="tertiary"
                onClick={() => void handleDelete(stage.id)}
              />
            </div>
          </article>
        ))}
      </section>
      <style jsx>{`
        .artists-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.8rem;
          margin-top: 1rem;
        }

        .custom-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .custom-checkbox-label:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .custom-checkbox-label.checked {
          background: rgba(45, 226, 230, 0.1);
          border-color: rgba(45, 226, 230, 0.4);
          box-shadow: 0 4px 12px rgba(45, 226, 230, 0.1);
        }

        .hidden-checkbox {
          display: none;
        }

        .checkbox-visual {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .checked .checkbox-visual {
          background: var(--secondary);
          border-color: var(--secondary);
        }

        .check-mark {
          color: black;
          font-size: 0.8rem;
          font-weight: 900;
        }

        .checkbox-content {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .artist-country-code {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
          opacity: 0.6;
          color: white;
        }

        .artist-flag-mini {
          width: 18px;
          height: 12px;
          object-fit: cover;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .artist-display-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
        }

        .checked .artist-display-name {
          color: white;
        }
      `}</style>
    </main>
  );
}
