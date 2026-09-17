import { createFileRoute } from "@tanstack/react-router";
import Terms from "@/pages/Terms";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "About this preview — CULT FUN" },
      { name: "description", content: "Terms for the CULT FUN prototype: illustrative data and local test transactions." },
      { property: "og:title", content: "About this preview — CULT FUN" },
      { property: "og:description", content: "Terms for the CULT FUN prototype." },
    ],
  }),
  component: Terms,
});
