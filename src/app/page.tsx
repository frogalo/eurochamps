"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useUser();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!normalizedUsername || !password) {
      setError("Wpisz nazwe uzytkownika i haslo.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: normalizedUsername,
          password,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        user?: { displayName: string };
      };

      if (!response.ok || !data.user) {
        setError(data.error ?? "Nie można się zalogować.");
        return;
      }

      login(data.user.displayName);
      router.push("/etap");
    } catch {
      setError("W tej chwili nie można się zalogować.");
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
        <p className="login-kicker">Elektryczna scena czeka</p>
        <h1 className="login-title">
          euro
          <span>champs</span>
        </h1>
      </section>

      <section className="login-card">
        <div className="login-card-glass" />
        <div className="login-card-content">
          <div className="login-heading">
            <p className="section-kicker">Zaloguj się</p>
            <h2 className="section-title">Wejdź do swojego panelu ocen</h2>
            <p className="hero-text">
              Zaloguj się na swoje konto Eurochamps, aby oceniać artystów i
              synchronizować swoją tablicę.
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

            <label className="field-shell" htmlFor="password">
              <span className="field-label">Hasło</span>
              <div className="login-input-wrap">
                <span className="login-input-icon">#</span>
                <input
                  id="password"
                  className="field-input login-input login-input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="login-visibility-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {showPassword ? "Ukryj" : "Pokaż"}
                </button>
              </div>
            </label>

            {error && <p className="login-error">{error}</p>}

            <Button
              text={isSubmitting ? "Logowanie..." : "Zaloguj się"}
              eyebrow="Główny"
              type="submit"
              disabled={isSubmitting}
              className="login-submit"
            />
          </form>

          <div className="login-divider">
            <span>Konto Eurochamps</span>
          </div>

          <footer className="login-footer">
            <p>
              Potrzebujesz konta? Dodaj lub utwórz użytkownika w Prisma, a następnie zaloguj się tutaj.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
