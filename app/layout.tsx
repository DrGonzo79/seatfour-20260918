import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeatFour — local board-game matchmaking",
  description: "A runnable demo that matches solo players into compatible tables at local game stores.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
