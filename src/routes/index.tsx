import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CULT FUN — start a coin, pay the people who hold it" },
      {
        name: "description",
        content:
          "Half of every coin's trading fees flow back to the wallets holding it, every round, on a public ledger.",
      },
      { property: "og:title", content: "CULT FUN — start a coin, pay the people who hold it" },
      {
        property: "og:description",
        content: "A launchpad where holding is the point. Half of every coin's fees go to holders.",
      },
    ],
  }),
  component: Home,
});
