import { createFileRoute } from "@tanstack/react-router";
import SafePlace from "@/components/safe-place/SafePlace";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <SafePlace />;
}
