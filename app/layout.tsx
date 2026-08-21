import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vedansh.info"),
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
  openGraph: {
    title: "Vedansh Sharma — Full Stack Developer",
    description:
      "Building scalable web and mobile products — Java, Spring Boot, React, Next.js, React Native and AI-integrated features.",
    url: "https://vedansh.info",
    siteName: "Vedansh Sharma",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vedansh Sharma" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedansh Sharma — Full Stack Developer",
    description:
      "Building scalable web and mobile products — Java, Spring Boot, React, Next.js, React Native and AI-integrated features.",
    images: ["/og-image.png"],
  },
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
