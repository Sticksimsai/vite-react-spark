import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import instrument400 from "@fontsource/instrument-sans/400.css?url";
import instrument500 from "@fontsource/instrument-sans/500.css?url";
import instrument600 from "@fontsource/instrument-sans/600.css?url";
import instrument700 from "@fontsource/instrument-sans/700.css?url";
import plexMono400 from "@fontsource/ibm-plex-mono/400.css?url";
import plexMono500 from "@fontsource/ibm-plex-mono/500.css?url";
import fredoka500 from "@fontsource/fredoka/500.css?url";
import fredoka600 from "@fontsource/fredoka/600.css?url";
import fredoka700 from "@fontsource/fredoka/700.css?url";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { PrivyProvider } from "@privy-io/react-auth";

import { Shell } from "@/components/Shell";
import { PRIVY_APP_ID, privyEnabled } from "@/lib/auth";
import NotFound from "@/pages/NotFound";

function NotFoundComponent() {
  return (
    <Shell>
      <NotFound />
    </Shell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="empty-state">
      <h2>This page didn't load</h2>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
        <button
          className="button primary"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          try again
        </button>
        <a className="button" href="/">
          go home
        </a>
      </div>
    </div>
  );
}

const fontStylesheets = [
  instrument400,
  instrument500,
  instrument600,
  instrument700,
  plexMono400,
  plexMono500,
  fredoka500,
  fredoka600,
  fredoka700,
].map((href) => ({ rel: "stylesheet", href }));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CULT FUN — start a coin, pay the people who hold it" },
      {
        name: "description",
        content:
          "A launchpad where holding is the point. Half of every coin's fees flow back to holders, on a public ledger.",
      },
      { property: "og:title", content: "CULT FUN" },
      { property: "og:description", content: "Start a coin. Pay the people who hold it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      ...fontStylesheets,
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Identity({ children }: { children: ReactNode }) {
  if (!privyEnabled) return <>{children}</>;
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "twitter", "passkey"],
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Identity>
        <Shell>
          {/* Required: nested routes render here. */}
          <Outlet />
        </Shell>
      </Identity>
    </QueryClientProvider>
  );
}
