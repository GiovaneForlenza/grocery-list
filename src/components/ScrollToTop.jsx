import { ArrowBigUpDashIcon } from "lucide-react";

function ScrollToTop() {
  return (
    <div
      className="border-sage-dark bg-paper fixed right-5 bottom-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 sm:right-10 sm:bottom-10"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowBigUpDashIcon />
    </div>
  );
}

export default ScrollToTop;
