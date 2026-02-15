import type { Metadata } from "next";
import { Barlow, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordGate from "@/components/PasswordGate";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "宮島敬右 | UI/UX Designer Portfolio",
  description: "UI/UXデザイナー宮島敬右のポートフォリオサイト。2004年から2022年にかけてのウェブサービス開発と電気機器業界でのUIデザイン作品を紹介。",
  keywords: ["UI/UX", "デザイナー", "ポートフォリオ", "宮島敬右"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "宮島敬右 | UI/UX Designer Portfolio",
    description: "UI/UXデザイナー宮島敬右のポートフォリオサイト",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${barlow.variable} ${notoSansJP.variable} antialiased bg-neutral-50 text-neutral-900`}
        suppressHydrationWarning
      >
        <PasswordGate>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </PasswordGate>
      </body>
    </html>
  );
}
