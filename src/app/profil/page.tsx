"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, currentUsername, imagePath, login, role } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) {
      router.replace("/");
    }
  }, [mounted, currentUser, router]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Zdjęcie jest za duże (max 5MB).");
      return;
    }

    setIsUploading(true);
    setError(null);
    setNotice(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/profile/image", {
        method: "POST",
        headers: {
          "x-user-name": currentUsername || currentUser || "",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Wystąpił błąd podczas wgrywania zdjęcia.");
        return;
      }

      // Update context
      if (currentUsername && currentUser && role) {
        login({
          username: currentUsername,
          displayName: currentUser,
          role: role,
          imagePath: data.imagePath,
        });
      }

      setNotice("Zdjęcie profilowe zostało zaktualizowane.");
      
    } catch {
      setError("Wystąpił błąd podczas wgrywania zdjęcia.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!mounted || !currentUser) return null;

  return (
    <main className="app-shell">
      <section className="stage-header">
        <div className="hero-copy">
          <p className="eyebrow">Profil</p>
          <h1 className="display-title">Twój Profil.</h1>
          <p className="hero-text">
            Zarządzaj swoimi danymi i zdjęciem profilowym.
          </p>
        </div>
        <div className="header-actions">
          <Button
            text="Wróć do konkursów"
            variant="secondary"
            onClick={() => router.push("/konkurs")}
          />
        </div>
      </section>

      <section className="section-panel" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2 className="section-title" style={{ marginBottom: "2rem" }}>Zdjęcie Profilowe</h2>
        
        <div className="profile-image-container">
          {imagePath ? (
            <img src={imagePath} alt="Profil" className="profile-image" />
          ) : (
            <div className="profile-initials">
              {getInitials(currentUser)}
            </div>
          )}
        </div>

        <div className="profile-actions" style={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <Button 
            text={isUploading ? "Wgrywanie..." : "Zmień zdjęcie"} 
            onClick={triggerFileInput} 
            disabled={isUploading}
          />
          
          {error && <p className="login-error">{error}</p>}
          {notice && <p className="admin-notice">{notice}</p>}
        </div>
      </section>

      <style jsx>{`
        .profile-image-container {
          width: 150px;
          height: 150px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, var(--surface-container-highest), var(--surface-container-high));
          border: 4px solid var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-initials {
          font-size: 3rem;
          font-weight: 800;
          color: var(--secondary);
        }
      `}</style>
    </main>
  );
}
