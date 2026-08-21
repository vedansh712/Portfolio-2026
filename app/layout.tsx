import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vedansh Sharma — Full Stack Developer",
  description:
    "Portfolio of Vedansh Sharma — Full Stack Developer building scalable web and mobile products. Java, Spring Boot, React, Next.js, Node.js, Python, React Native, and AI-integrated features.",
  keywords: [
    "Vedansh Sharma",
    "Full Stack Developer",
    "Software Developer",
    "Java",
    "Spring Boot",
    "React",
    "Next.js",
    "React Native",
    "Python",
    "FastAPI",
    "Portfolio",
    "Web Developer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#080400" />
      </head>
      <body className="antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
