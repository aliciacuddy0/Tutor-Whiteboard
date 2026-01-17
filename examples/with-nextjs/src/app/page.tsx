import { Suspense } from "react";
import Phase1Whiteboard from "../Phase1Whiteboard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Phase1Whiteboard />
    </Suspense>
  );
}
