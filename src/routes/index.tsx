import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "AutoFix.sh — AI-powered self-healing deployment agent" },
      { name: "description", content: "Detect failed GitHub Actions, generate AI fixes, validate in sandboxes, commit working patches automatically." },
    ],
  }),
});
