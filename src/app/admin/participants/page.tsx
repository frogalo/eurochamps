"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import CustomSelect from "@/components/CustomSelect";
import { useUser } from "@/context/UserContext";
import { getAdminHeaders } from "@/lib/admin-client";
import { countryName, flagUrl, getYouTubeId, getYouTubeThumbnail } from "@/lib/media";

interface ArtistRecord {
  id: string;
  name: string;
  country: string;
  songPath: string;
  description: string;
  imagePath: string;
  year: string;
}

const EMPTY_FORM = {
  name: "",
  country: "",
  songPath: "",
  description: "",
  imagePath: "",
  year: "",
};

export default function AdminArtistsPage() {
  const router = useRouter();
  const { currentUser, currentUsername, isAdmin } = useUser();
  const [mounted, setMounted] = useState(false);
  const [artists, setArtists] = useState<ArtistRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) { router.replace("/"); return; }
    if (!isAdmin) { router.replace("/konkurs"); return; }
    void loadArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdmin, mounted, router]);

  const availableYears = useMemo(() => {
    const years = [...new Set(artists.map((a) => a.year))].sort().reverse();
    return years;
  }, [artists]);

  const filteredArtists = useMemo(() => {
    if (!filterYear) return artists;
    return artists.filter((a) => a.year === filterYear);
  }, [artists, filterYear]);

  const yearOptions = useMemo(
    () => [
      { value: "", label: "Wszystkie lata" },
      ...availableYears.map((y) => ({ value: y, label: y })),
    ],
    [availableYears]
  );

  async function loadArtists() {
    try {
      setError(null);
      const response = await fetch("/api/admin/artists", {
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { error?: string; artists?: ArtistRecord[] };
      if (!response.ok || !data.artists) {
        setError(data.error ?? "Nie udało się pobrać artystów.");
        return;
      }
      setArtists(data.artists);
    } catch {
      setError("Nie udało się pobrać artystów.");
    }
  }

  function openAddModal() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setNotice(null);
    setIsModalOpen(true);
  }

  function openEditModal(artist: ArtistRecord) {
    setEditingId(artist.id);
    setForm({
      name: artist.name,
      country: artist.country,
      songPath: artist.songPath,
      description: artist.description,
      imagePath: artist.imagePath,
      year: artist.year,
    });
    setError(null);
    setNotice(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setNotice(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      const url = editingId ? `/api/admin/artists/${editingId}` : "/api/admin/artists";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(currentUsername ?? currentUser, true),
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Nie udało się zapisać artysty.");
        return;
      }

      setNotice(editingId ? "Zaktualizowano artystę." : "Dodano artystę.");
      closeModal();
      await loadArtists();
    } catch {
      setError("Nie udało się zapisać artysty.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(artistId: string) {
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/artists/${artistId}`, {
        method: "DELETE",
        headers: getAdminHeaders(currentUsername ?? currentUser),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Nie udało się usunąć artysty.");
        return;
      }
      setNotice("Usunięto artystę.");
      if (editingId === artistId) closeModal();
      await loadArtists();
    } catch {
      setError("Nie udało się usunąć artysty.");
    }
  }

  if (!mounted || !currentUser || !isAdmin) return null;

  return (
    <main className="app-shell">
      <section className="stage-header">
        <div className="hero-copy">
          <p className="eyebrow">Admin / Artyści</p>
          <h1 className="display-title">Zarządzaj artystami.</h1>
          <p className="hero-text">
            Artysta przypisany do roku pojawi się automatycznie na wszystkich konkursach w danym roku.
          </p>
        </div>
        <div className="header-actions">
          <Button
            text="Dodaj artystę"
            onClick={openAddModal}
          />
          <Button
            text="Powrót do panelu"
            variant="secondary"
            onClick={() => router.push("/konkurs")}
          />
        </div>
      </section>

      {notice && <p className="admin-notice" style={{ margin: "0 auto 1rem", maxWidth: "800px" }}>{notice}</p>}
      {error && !isModalOpen && <p className="login-error" style={{ margin: "0 auto 1rem", maxWidth: "800px" }}>{error}</p>}

      <section className="section-panel admin-panel" style={{ marginBottom: "1.5rem" }}>
        <div className="section-heading">
          <p className="section-kicker">Filtr</p>
          <h2 className="section-title">Lista artystów</h2>
        </div>
        <div className="admin-form-grid" style={{ maxWidth: "320px" }}>
          <CustomSelect
            label="Rok"
            options={yearOptions}
            value={filterYear}
            onChange={setFilterYear}
          />
        </div>
        <div className="admin-summary-list" style={{ marginTop: "1rem" }}>
          <div className="metric-card">
            <span className="metric-label">Artyści</span>
            <strong>{filteredArtists.length}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Łączna baza</span>
            <strong>{artists.length}</strong>
          </div>
        </div>
      </section>

      <section className="admin-entries-grid">
        {filteredArtists.map((artist) => (
          <article key={artist.id} className="section-panel admin-entry-card">
            <div className="entry-card-header">
              {artist.imagePath ? (
                <img
                  className="entry-flag"
                  src={artist.imagePath}
                  alt={artist.name}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              ) : artist.country.length === 2 ? (
                <img
                  className="entry-flag"
                  src={flagUrl(artist.country)}
                  alt={artist.country}
                />
              ) : null}
              <div>
                <p className="stage-card-date">{countryName(artist.country)} · {artist.year}</p>
                <h2 className="section-title">{artist.name}</h2>
              </div>
            </div>
            {artist.songPath && <p className="hero-text">{artist.songPath}</p>}
            {artist.description && getYouTubeId(artist.description) && (
              <div className="entry-video-preview">
                <a
                  href={artist.description}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-thumbnail-link"
                >
                  <img
                    src={getYouTubeThumbnail(artist.description)!}
                    alt="YouTube thumbnail"
                    className="video-thumbnail"
                  />
                  <div className="video-play-overlay">
                    <span className="play-icon">▶</span>
                  </div>
                </a>
              </div>
            )}
            <div className="admin-inline-actions">
              <Button
                text="Edytuj"
                variant="secondary"
                onClick={() => openEditModal(artist)}
              />
              <Button
                text="Usuń"
                variant="tertiary"
                onClick={() => void handleDelete(artist.id)}
              />
            </div>
          </article>
        ))}
      </section>

      {/* ─── Edit / Add Modal ─── */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="section-title">
                {editingId ? "Edycja artysty" : "Nowy artysta"}
              </h2>
              <button className="modal-close-btn" onClick={closeModal} aria-label="Zamknij">
                ✕
              </button>
            </div>

            <form className="admin-form-grid" onSubmit={handleSubmit}>
              <label className="field-shell">
                <span className="field-label">Artysta</span>
                <input
                  className="field-input"
                  value={form.name}
                  onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                  placeholder="np. Neon Bloom"
                />
              </label>
              <label className="field-shell">
                <span className="field-label">Kraj (kod ISO)</span>
                <div className="country-input-row">
                  {form.country.length === 2 && (
                    <img
                      className="country-flag-preview"
                      src={flagUrl(form.country)}
                      alt={countryName(form.country)}
                    />
                  )}
                  <input
                    className="field-input"
                    value={form.country}
                    maxLength={2}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, country: e.target.value.toUpperCase() }))
                    }
                    placeholder="np. PL"
                  />
                </div>
              </label>
              <label className="field-shell">
                <span className="field-label">Rok</span>
                <input
                  className="field-input"
                  value={form.year}
                  onChange={(e) => setForm((c) => ({ ...c, year: e.target.value }))}
                  placeholder="np. 2026"
                />
              </label>
              <label className="field-shell">
                <span className="field-label">Piosenka (tytuł)</span>
                <input
                  className="field-input"
                  value={form.songPath}
                  onChange={(e) => setForm((c) => ({ ...c, songPath: e.target.value }))}
                  placeholder="Tytuł piosenki"
                />
              </label>
              <label className="field-shell">
                <span className="field-label">Zdjęcie artysty (URL)</span>
                <div className="youtube-input-row">
                  {form.imagePath && (
                    <img
                      className="youtube-thumbnail-preview"
                      src={form.imagePath}
                      alt="Zdjęcie artysty"
                      style={{ maxWidth: "200px", aspectRatio: "1", borderRadius: "1rem" }}
                    />
                  )}
                  <input
                    className="field-input"
                    value={form.imagePath}
                    onChange={(e) => setForm((c) => ({ ...c, imagePath: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </label>
              <label className="field-shell">
                <span className="field-label">URL do YouTube</span>
                <div className="youtube-input-row">
                  {getYouTubeThumbnail(form.description) && (
                    <img
                      className="youtube-thumbnail-preview"
                      src={getYouTubeThumbnail(form.description)!}
                      alt="YouTube thumbnail"
                    />
                  )}
                  <input
                    className="field-input"
                    value={form.description}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, description: e.target.value }))
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </label>

              {error && <p className="login-error" style={{ gridColumn: "1 / -1" }}>{error}</p>}

              <div className="admin-inline-actions" style={{ gridColumn: "1 / -1" }}>
                <Button
                  text={isSaving ? "Zapisywanie..." : editingId ? "Zapisz zmiany" : "Dodaj artystę"}
                  type="submit"
                  disabled={isSaving}
                />
                <Button text="Anuluj" variant="secondary" onClick={closeModal} />
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
