import { createFileRoute } from "@tanstack/react-router";
import Rounds from "@/pages/Rounds";

export const Route = createFileRoute("/rounds")({
  head: () => ({
    meta: [
      { title: "The ledger — CULT FUN" },
      { name: "description", content: "Every reward round published to the public ledger, with budgets and payouts." },
      { property: "og:title", content: "The ledger — CULT FUN" },
      { property: "og:description", content: "Every reward round, published in the open." },
    ],
  }),
  component: Rounds,
});
