import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZenFinance — Track income, expenses & balance",
  description: "Simple personal finance app. Log expenses and income, manage categories, see your balance and charts. Clean, fast, no clutter.",
};

// Inline script: apply saved theme before React hydrates to avoid flash
const themeScript = `
(function() {
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  try {
    var raw = localStorage.getItem('zen-finance-storage');
    if (raw) {
      var data = JSON.parse(raw);
      if (data.state && (data.state.theme === 'dark' || data.state.theme === 'light')) {
        applyTheme(data.state.theme);
        return;
      }
    }
    // Если тема не сохранена, используем системные настройки
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  } catch (e) {
    // При ошибке используем системные настройки
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
