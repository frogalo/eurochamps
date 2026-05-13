import "./globals.css";
import { Be_Vietnam_Pro, Epilogue, Space_Grotesk } from "next/font/google";

import { UserProvider } from "@/context/UserContext";

const displayFont = Epilogue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const labelFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-label",
  weight: ["500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      className={`${displayFont.variable} ${bodyFont.variable} ${labelFont.variable}`}
    >
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
