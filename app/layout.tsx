import React from "react";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";

import Header from "../components/layout/Header";
import Footer from '../components/layout/Footer';

import "@/styles.css";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Las Recetas de Magda",
  description: "Descubre mis recetas más dulces y los secretos mejor guardados para hornear con amor.",
  verification: {
    google: "yIrcYGpwP9xDWpgKFJSXqokzNMWRc813GxtfbfZXhHE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(fontSans.variable, nunito.variable, lato.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}