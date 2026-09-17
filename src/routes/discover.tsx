import { createFileRoute } from "@tanstack/react-router";
import Discover from "@/pages/Discover";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Every cult, live — CULT FUN" },
      {
        name: "description",
        content: "The pulse: every coin launched on the local chain, with rewards paid and curve progress.",
      },
      { property: "og:title", content: "Every cult, live — CULT FUN" },
      { property: "og:description", content: "Browse every coin on the pulse board." },
    ],
  }),
  component: Discover,
});
