import { createFileRoute } from "@tanstack/react-router";
import Docs from "@/pages/Docs";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "How it works — CULT FUN" },
      { name: "description", content: "The mechanics, the fee split, the boundaries, and what comes next." },
      { property: "og:title", content: "How it works — CULT FUN" },
      { property: "og:description", content: "The field guide to the fee split and holder rewards." },
    ],
  }),
  component: Docs,
});
