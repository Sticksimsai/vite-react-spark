import { createFileRoute } from "@tanstack/react-router";
import CoinPage from "@/pages/Coin";

export const Route = createFileRoute("/coin/$id")({
  head: () => ({
    meta: [
      { title: "Coin — CULT FUN" },
      {
        name: "description",
        content: "Market, rewards and holder payouts for a coin launched on CULT FUN.",
      },
      { property: "og:title", content: "Coin — CULT FUN" },
      { property: "og:description", content: "Market, rewards and holder payouts for this coin." },
    ],
  }),
  component: CoinPage,
});
