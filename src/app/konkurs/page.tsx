"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
interface StageView {
  id: string;
  name: string;
  year: string;
  place: string;
  round: string;
  description: string;
  status: "OPEN" | "LOCKED";
  entryCount: number;
  userVoteCount: number;
}

type StageStatus = "ready" | "draft" | "submitted";

const STATUS_LABELS: Record<StageStatus, string> = {
  ready: "Gotowe",
  draft: "Szkic",
  submitted: "Wyslane",
};

export default function Stage() {
  const router = useRouter();
  const { currentUser, isAdmin, logout } = useUser();
  const [mounted, setMounted] = useState(false);
  const [stages, setStages] = useState<StageView[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, StageStatus>>({});
  const [loading, setLoading] = useState(true);

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
    if (!mounted) return;
    
    async function loadStages() {
      try {
        const res = await fetch("/api/stages", {
          headers: currentUser ? { "x-user-name": currentUser } : {}
        });
        const data = await res.json();
        if (data.stages) {
          setStages(data.stages);
        }
      } catch (err) {
        console.error("Failed to load stages", err);
      } finally {
        setLoading(false);
      }
    }

    void loadStages();
  }, [mounted, currentUser]);

  useEffect(() => {
    if (!mounted || loading || !currentUser || isAdmin) {
      return;
    }

    const nextStatusMap = stages.reduce<Record<string, StageStatus>>(
      (result, stage) => {
        // Use userVoteCount from API
        const progress = stage.userVoteCount || 0;

        if (progress === stage.entryCount && stage.entryCount > 0) {
          result[stage.id] = "submitted";
        } else if (progress > 0) {
          result[stage.id] = "draft";
        } else {
          result[stage.id] = "ready";
        }

        return result;
      },
      {}
    );

    setStatusMap(nextStatusMap);
  }, [currentUser, isAdmin, mounted, loading, stages]);

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
          <p className="eyebrow">{isAdmin ? "Administracja" : "Konkursy"}</p>
          <h1 className="display-title">
            {isAdmin ? "Panel organizatora." : "Wybierz konkurs."}
          </h1>
          {isAdmin ? (
            <p className="hero-text">
              Zarzadzaj uczestnikami, konkursami i glosami z jednego miejsca.
            </p>
          ) : null}
        </div>
        <div className="lobby-actions">
          <div className="status-ribbon compact">
            <span className="status-ribbon-label">Aktywne konto</span>
            <strong>{currentUser}</strong>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              text="Mój profil"
              variant="secondary"
              onClick={() => router.push("/profil")}
            />
            <Button
              text="Zmien konto"
              variant="secondary"
              onClick={handleChangeUser}
            />
          </div>
        </div>
      </section>

      {isAdmin ? (
        <section className="admin-actions-grid">
          <button
            type="button"
            className="stage-card admin-action-card"
            onClick={() => router.push("/admin/participants")}
          >
            <span className="status-pill status-pill-draft">Artyści</span>
            <p className="stage-card-date">Rok i skład</p>
            <h2 className="stage-card-title">Zarządzaj artystami</h2>
            <p className="stage-card-copy">
              Dodawaj i zarządzaj artystami przypisanymi do roku konkursu.
            </p>
            <div className="stage-card-footer">
              <span className="metric-label">Zakres</span>
              <strong>Artyści / Kraje</strong>
            </div>
          </button>

          <button
            type="button"
            className="stage-card admin-action-card"
            onClick={() => router.push("/admin/stages")}
          >
            <span className="status-pill status-pill-ready">Konkursy</span>
            <p className="stage-card-date">Konkursy i lata</p>
            <h2 className="stage-card-title">Zarządzaj konkursami</h2>
            <p className="stage-card-copy">
              Twórz konkursy z rokiem, miastem i logo. Każdy wpis to osobny konkurs.
            </p>
            <div className="stage-card-footer">
              <span className="metric-label">Zakres</span>
              <strong>Konkursy</strong>
            </div>
          </button>

          <button
            type="button"
            className="stage-card admin-action-card"
            onClick={() => router.push("/admin/votes")}
          >
            <span className="status-pill status-pill-submitted">Glosy</span>
            <p className="stage-card-date">Oceny i pakiety</p>
            <h2 className="stage-card-title">Dodaj glosy</h2>
            <p className="stage-card-copy">
              Wprowadzaj pakiety glosow dla konkursow.
            </p>
            <div className="stage-card-footer">
              <span className="metric-label">Zakres</span>
              <strong>Reczne wprowadzanie</strong>
            </div>
          </button>
        </section>
      ) : (
        <section className="stage-grid">
          {loading ? (
            <p className="hero-text">Ładowanie konkursów...</p>
          ) : stages.length === 0 ? (
            <p className="hero-text">Brak aktywnych konkursów w bazie.</p>
          ) : (
            stages.map((stage, index) => {
              const status = statusMap[stage.id] ?? "ready";
              const progress = stage.userVoteCount || 0;

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
                  onClick={() =>
                    (stage.status ?? "OPEN") === "LOCKED"
                      ? router.push(`/ranking?stageId=${stage.id}`)
                      : router.push(`/konkurs/${stage.id}`)
                  }
                >
                  <span className={`status-pill status-pill-${status}`}>
                    {STATUS_LABELS[status]}
                  </span>
                  <p className="stage-card-date">{stage.year} · {stage.place}</p>
                  <h2 className="stage-card-title">{stage.name}</h2>
                  <p className="stage-card-round">{stage.round}</p>
                  <p className="stage-card-copy">{stage.description}</p>
                  <div className="stage-card-footer">
                    <span className="metric-label">Status</span>
                    <span className={`status-pill status-pill-${(stage.status ?? "OPEN") === "OPEN" ? "ready" : "submitted"}`}>
                      {(stage.status ?? "OPEN") === "OPEN" ? "Otwarty" : "Zablokowany"}
                    </span>
                  </div>
                  <div className="stage-card-footer">
                    <span className="metric-label">Ocenione wystepy</span>
                    <strong>{progress}/{stage.entryCount}</strong>
                  </div>
                </button>
              );
            })
          )}
        </section>
      )}
    </main>
  );
}
