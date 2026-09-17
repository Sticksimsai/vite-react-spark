import { createFileRoute } from "@tanstack/react-router";
import Rewards from "@/pages/Rewards";

export const Route = createFileRoute("/wallet/$address")({
  head: () => ({
    meta: [
      { title: "Wallet rewards — CULT FUN" },
      { name: "description", content: "Live holdings and ETH reward credit for this wallet address." },
      { property: "og:title", content: "Wallet rewards — CULT FUN" },
      { property: "og:description", content: "Live holdings and ETH reward credit for this wallet." },
    ],
  }),
  component: Rewards,
});
