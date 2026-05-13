"use client";

import { useState } from "react";
import { FaYoutube } from "react-icons/fa";

import { countryName, flagUrl, getYouTubeId, getYouTubeThumbnail } from "@/lib/media";

interface SortableVoteEntry {
  id: string;
  country: string;
  artist: string;
  song: string;
  note: string;
  accentFrom: string;
  accentTo: string;
  imagePath?: string | null;
}

interface CriteriaScore {
  song: number;
  performance: number;
  stage: number;
}

interface SortableVoteCardProps {
  entry: SortableVoteEntry;
  index: number;
  isLocked: boolean;
  criteria: CriteriaScore;
  overall: number;
  onCriteriaChange: (entryId: string, field: keyof CriteriaScore, value: number) => void;
  onClearEntry: (entryId: string) => void;
  onReshuffle: () => void;
}

export default function SortableVoteCard({
  entry,
  index,
  isLocked,
  criteria,
  overall,
  onCriteriaChange,
  onClearEntry,
  onReshuffle,
}: SortableVoteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scoreFields: Array<{
    key: keyof CriteriaScore;
    label: string;
    value: number;
  }> = [
    { key: "song", label: "Piosenka", value: criteria.song },
    { key: "performance", label: "Występ", value: criteria.performance },
    { key: "stage", label: "Scena", value: criteria.stage },
  ];

  const bump = (field: keyof CriteriaScore, delta: number) => {
    const current = criteria[field] ?? 0;
    onCriteriaChange(entry.id, field, Math.max(0, Math.min(12, current + delta)));
  };

  const handleClear = () => {
    onClearEntry(entry.id);
  };

  const handleSaveAndReshuffle = () => {
    onReshuffle();
    setIsModalOpen(false);
  };
  const youtubeId = getYouTubeId(entry.note);
  const youtubeUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null;
  const thumbnailUrl = getYouTubeThumbnail(entry.note);
  const openMobileModal = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <article
        className={`artist-card draggable-artist-card scoreboard-row ${isLocked ? "drag-disabled" : ""}`}
        style={{
          background: `linear-gradient(90deg, ${entry.accentFrom}1f, ${entry.accentTo}10), var(--surface-container-high)`,
        }}
      >
        <div className="ranking-number">{String(index + 1).padStart(2, "0")}</div>
        <div
          className="scoreboard-entry scoreboard-entry-button"
          onClick={openMobileModal}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openMobileModal();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {entry.country.length === 2 && (
            <img className="scoreboard-flag" src={flagUrl(entry.country)} alt={countryName(entry.country)} />
          )}
          <div className="artist-card-copy">
            <h3>{countryName(entry.country)}</h3>
            <p className="artist-song">
              {entry.song}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="song-youtube-link"
                  aria-label={`Otworz utwor ${entry.song} na YouTube`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <FaYoutube />
                </a>
              )}
            </p>
            <p className="scoreboard-artist">{entry.artist}</p>
          </div>
        </div>
        <div className="vote-fields scoreboard-fields">
          {scoreFields.map((field) => (
            <div key={field.key} className="vote-field vote-cell vote-cell-detail">
              <button type="button" disabled={isLocked} onClick={() => bump(field.key, -1)} aria-label={`${field.label} minus`}>
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={field.value}
                disabled={isLocked}
                onChange={(event) => onCriteriaChange(entry.id, field.key, Number(event.target.value) || 0)}
                aria-label={field.label}
              />
              <button type="button" disabled={isLocked} onClick={() => bump(field.key, 1)} aria-label={`${field.label} plus`}>
                +
              </button>
            </div>
          ))}
          <div className="vote-field vote-cell vote-field-overall">
            <input type="text" value={overall} disabled readOnly aria-label="Overall" />
          </div>
        </div>
      </article>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content score-modal" onClick={(event) => event.stopPropagation()}>
            <div className="score-modal-hero">
              {entry.imagePath ? (
                <img src={entry.imagePath} alt={entry.artist} className="score-modal-image" />
              ) : thumbnailUrl ? (
                <img src={thumbnailUrl} alt={entry.song} className="score-modal-image" />
              ) : entry.country.length === 2 ? (
                <img src={flagUrl(entry.country)} alt={countryName(entry.country)} className="score-modal-image" />
              ) : (
                <div className="score-modal-image score-modal-fallback">{entry.artist.slice(0, 2).toUpperCase()}</div>
              )}
              <div className="score-modal-hero-fade"></div>
              <button className="modal-close-btn score-modal-close" type="button" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
              <div className="score-modal-hero-copy">
                <p className="score-modal-country">{countryName(entry.country)}</p>
                <h2 className="section-title">{entry.artist}</h2>
                <p className="artist-song">{entry.song}</p>
              </div>
              {entry.country.length === 2 && (
                <img
                  src={flagUrl(entry.country)}
                  alt={countryName(entry.country)}
                  className="score-modal-corner-flag"
                />
              )}
            </div>
            <div className="score-modal-fields-wrap">
              <div className="score-modal-overall">
                <span>Suma</span>
                <strong>{overall}</strong>
              </div>
              <div className="score-modal-fields">
              {scoreFields.map((field) => (
                <div key={field.key} className="vote-field vote-cell">
                  <button type="button" disabled={isLocked} onClick={() => bump(field.key, -1)} aria-label={`${field.label} minus`}>
                    -
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={field.value}
                    disabled={isLocked}
                    onChange={(event) => onCriteriaChange(entry.id, field.key, Number(event.target.value) || 0)}
                    aria-label={field.label}
                  />
                  <button type="button" disabled={isLocked} onClick={() => bump(field.key, 1)} aria-label={`${field.label} plus`}>
                    +
                  </button>
                  <span>{field.label}</span>
                </div>
              ))}
              </div>
              <div className="score-modal-actions">
                <button 
                  className="score-modal-btn score-modal-btn-clear" 
                  onClick={handleClear}
                  disabled={isLocked}
                >
                  Wyczyść
                </button>
                <button 
                  className="score-modal-btn score-modal-btn-save" 
                  onClick={handleSaveAndReshuffle}
                  disabled={isLocked}
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
