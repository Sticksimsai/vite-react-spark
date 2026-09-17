import { createFileRoute } from "@tanstack/react-router";
import Launch from "@/pages/Launch";

export const Route = createFileRoute("/launch")({
  head: () => ({
    meta: [
      { title: "Start a coin — CULT FUN" },
      {
        name: "description",
        content: "Pick a name, a ticker and a face for it. Your coin gets a live page, a fee vault and a curve.",
      },
      { property: "og:title", content: "Start a coin — CULT FUN" },
      { property: "og:description", content: "Launch a coin that pays the people who hold it." },
    ],
  }),
  component: Launch,
});
