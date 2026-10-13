import type { Metadata } from "next";
import { Sora, Instrument_Sans } from "next/font/google";
import Shell from "../components/Shell";
import "./globals.css";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "SignEye — AI Sign Language Intelligence & Translation Studio",
  description: "High-precision AI-powered sign language recognition, live MediaPipe 3D landmark vision, interactive learning streaks, and neural speech synthesis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-theme="dark">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
