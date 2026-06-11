import { createFileRoute } from "@tanstack/react-router";
import { LoginPageContent } from "@/components/auth/LoginPageContent";

export const Route = createFileRoute("/auth/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Consistency Tracker" },
      {
        name: "description",
        content: "Sign in to your Consistency Tracker account.",
      },
    ],
  }),
  component: () => <LoginPageContent />,
});
