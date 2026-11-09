// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase

import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { Provider } from "@/components/provider";
import "./global.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const bengali = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bengali" });

export const metadata = {
  metadataBase: new URL("https://openbangla.com"),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${bengali.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
