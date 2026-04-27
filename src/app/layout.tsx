import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "King Project Portal — Daily Vibe-Coded Apps",
  description:
    "TNT Labs / TNT Games가 매일 하나씩 만들어 올리는 vibe-coded 앱 모음. 웹 데모는 한 탭으로, 데스크탑·모바일 앱은 레포로.",
  openGraph: {
    title: "King Project Portal",
    description: "매일 새로 만들어지는 vibe-coded 앱 모음",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 selection:bg-zinc-100/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
