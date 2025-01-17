import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Deaf Star",
  description: "This is a description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout(props: LayoutProps): ReactNode {
  return (
    <html lang="pt-BR" className={GeistSans.variable} suppressHydrationWarning>
      <body className="h-screen w-screen">
        <SessionProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {props.children}
            </ThemeProvider>
          </TRPCReactProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
