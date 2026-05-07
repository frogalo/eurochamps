"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";

export default function RegisterPage() {
  const router = useRouter();
  const { currentUser, login } = useUser();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !currentUser) {
      return;
    }

    router.replace("/etap");
  }, [currentUser, mounted, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedUsername = username.trim();
    const normalizedDisplayName = displayName.trim();
    if (!normalizedUsername || !password) {
      setError("Wpisz nazwę użytkownika i hasło.");
      return;
    }
 
    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
 
    if (password !== confirmPassword) {
      setError("Hasła muszą być takie same.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: normalizedUsername,
          displayName: normalizedDisplayName || undefined,
          password,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        user?: { displayName: string };
      };

      if (!response.ok || !data.user) {
        setError(data.error ?? "Nie udało się utworzyć konta.");
        return;
      }
 
      login(data.user.displayName);
      router.push("/etap");
    } catch {
      setError("Rejestracja jest teraz niedostępna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="login-shell">
      <div className="login-aurora login-aurora-primary" />
      <div className="login-aurora login-aurora-secondary" />
      <div className="login-aurora login-aurora-tertiary" />

      <section className="login-brand">
        <p className="login-kicker">Dołącz do euro champs</p>
        <h1 className="login-title">
          euro
          <span>champs</span>
        </h1>
      </section>

      <section className="login-card">
        <div className="login-card-glass" />
        <div className="login-card-content">
          <div className="login-heading">
            <p className="section-kicker">Rejestracja</p>
            <h2 className="section-title">Utwórz nowe konto</h2>
            <p className="hero-text">
              Podaj dane konta, aby od razu wejść do panelu ocen.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-shell" htmlFor="username">
              <span className="field-label">Nazwa użytkownika</span>
              <div className="login-input-wrap">
                <input
                  id="username"
                  className="field-input login-input"
                  placeholder="nazwa użytkownika"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
            </label>

            <label className="field-shell" htmlFor="displayName">
              <span className="field-label">Nazwa wyświetlana</span>
              <div className="login-input-wrap">
                <span className="login-input-icon">*</span>
                <input
                  id="displayName"
                  className="field-input login-input"
                  placeholder="np. Janek"
                  autoComplete="nickname"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </div>
            </label>

            <label className="field-shell" htmlFor="password">
              <span className="field-label">Hasło</span>
              <div className="login-input-wrap">
                <span className="login-input-icon">#</span>
                <input
                  id="password"
                  className="field-input login-input"
                  type="password"
                  placeholder="minimum 6 znaków"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </label>

            <label className="field-shell" htmlFor="confirmPassword">
              <span className="field-label">Powtórz hasło</span>
              <div className="login-input-wrap">
                <span className="login-input-icon">#</span>
                <input
                  id="confirmPassword"
                  className="field-input login-input"
                  type="password"
                  placeholder="powtórz hasło"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            </label>

            {error && <p className="login-error">{error}</p>}

            <Button
              text={isSubmitting ? "Tworzenie konta..." : "Utwórz konto"}
              type="submit"
              disabled={isSubmitting}
              className="login-submit"
            />
          </form>

          <div className="login-divider">
            <span>Masz już konto?</span>
          </div>

          <footer className="login-footer">
            <Button
              text="Wróć do logowania"
              variant="secondary"
              onClick={() => router.push("/")}
            />
          </footer>
        </div>
      </section>
    </main>
  );
}
