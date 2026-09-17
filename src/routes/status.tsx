import { createFileRoute } from "@tanstack/react-router";
import Status from "@/pages/Status";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Build status — CULT FUN" },
      { name: "description", content: "What you can use today, and what we're connecting next. Built in the open." },
      { property: "og:title", content: "Build status — CULT FUN" },
      { property: "og:description", content: "What works today and what comes next." },
    ],
  }),
  component: Status,
});
