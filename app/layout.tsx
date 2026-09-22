import type { Metadata } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import Nav from "./components/Nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Portfolio — Taste",
  description: "Style exploration for the new portfolio design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${playfair.variable}`}
    >
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
