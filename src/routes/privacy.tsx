import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/pages/Privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Your preview data — CULT FUN" },
      { name: "description", content: "What the CULT FUN preview stores, what it reads from your wallet, and what it never asks for." },
      { property: "og:title", content: "Your preview data — CULT FUN" },
      { property: "og:description", content: "How the CULT FUN preview handles your data." },
    ],
  }),
  component: Privacy,
});
