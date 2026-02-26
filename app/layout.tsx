import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vedant Sharma — Developer",
  description: "Portfolio of Vedant Sharma, a developer building at the edge of what's possible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
