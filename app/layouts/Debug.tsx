import { createWithDebugLayout } from "ui";

function DebugView() {
  return <>{}</>;
}

export const withDebugLayout = createWithDebugLayout([], {
  debugView: DebugView,
});
