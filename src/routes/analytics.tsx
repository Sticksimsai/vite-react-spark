import { createFileRoute } from "@tanstack/react-router";
import Numbers from "@/pages/Numbers";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "The numbers — CULT FUN" },
      { name: "description", content: "Fees received, funded and paid across every coin, refreshed from the chain." },
      { property: "og:title", content: "The numbers — CULT FUN" },
      { property: "og:description", content: "Fees received, funded and paid across every coin." },
    ],
  }),
  component: Numbers,
});
