const BUILD_TAG = "rb-6129";

import type { Metadata } from "next";
import Header from "@/components/Header";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Thư viện khoa CNTT",
    template: "%s | Thư viện khoa",
  },
  description: "Hệ thống tra cứu và đăng ký mượn sách thư viện khoa CNTT PTIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Providers>
          <Header />
          <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
