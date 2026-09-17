import { createFileRoute } from "@tanstack/react-router";
import Rewards from "@/pages/Rewards";

export const Route = createFileRoute("/wallet/")({
  head: () => ({
    meta: [
      { title: "My rewards — CULT FUN" },
      { name: "description", content: "Look up any EVM wallet to see its holdings and ETH reward credit." },
      { property: "og:title", content: "My rewards — CULT FUN" },
      { property: "og:description", content: "Holdings and ETH rewards for any wallet address." },
    ],
  }),
  component: Rewards,
});
