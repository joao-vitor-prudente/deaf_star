import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { TRPCReactProvider } from "~/trpc/react";
import { ModeToggle } from "~/components/ui/mode-toggle";

export const metadata: Metadata = {
  title: "Deaf Star",
  description: "This is a description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout(props: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="pt-BR" className={GeistSans.variable} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <aside className="absolute right-4 top-4">
              <ModeToggle />
            </aside>
            {props.children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
