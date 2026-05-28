import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://king.gojaehyun.com"),
  title: {
    default: "킹 프로젝트 포털 — 하루에 한 개씩 킹받는 프로그램 만들기",
    template: "%s",
  },
  description:
    "고재현(Gojaehyun)이 매일 한 개씩 킹받는 프로그램을 만드는 메이커 프로젝트. 웹 데모와 데스크탑·모바일 앱을 한 곳에서.",
  openGraph: {
    title: "킹 프로젝트 포털",
    description: "하루에 한 개씩, 킹받는 프로그램 만들기.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {ADSENSE_CLIENT_ID && (
          <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        )}
      </head>
      <body className="min-h-full bg-zinc-950 text-zinc-100 selection:bg-zinc-100/30 selection:text-white">
        {children}
        {ADSENSE_CLIENT_ID && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
