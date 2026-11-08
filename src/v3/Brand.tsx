import { useId } from "react";
/** Reconstructed vector interpretation of R1's sculpted A, not the original master. */
export function PrismMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 80 72" aria-hidden="true">
      <defs>
        <linearGradient id={id + "a"} x1="0" y1="1" x2=".8" y2="0">
          <stop stopColor="#00C7E8" />
          <stop offset=".38" stopColor="#12E4F7" />
          <stop offset=".65" stopColor="#CCFF00" />
          <stop offset="1" stopColor="#FF2078" />
        </linearGradient>
        <linearGradient id={id + "b"} x1=".2" y1="0" x2=".9" y2="1">
          <stop stopColor="#26F3F5" />
          <stop offset=".42" stopColor="#704FFF" />
          <stop offset=".76" stopColor="#B44FFF" />
          <stop offset="1" stopColor="#FF2078" />
        </linearGradient>
        <linearGradient id={id + "c"}>
          <stop stopColor="#001E3C" />
          <stop offset=".5" stopColor="#6736D4" />
          <stop offset="1" stopColor="#FFC2EC" />
        </linearGradient>
      </defs>
      <path
        d="M6 54 27 15Q39-4 50 14L74 53Q83 71 65 64L43 37 22 62Q4 73 6 54"
        fill={"url(#" + id + "a)"}
      />
      <path
        d="M28 22Q40 4 50 18L74 53Q83 71 65 64L44 42Q36 33 23 45Z"
        fill={"url(#" + id + "b)"}
      />
      <path
        d="M23 45Q36 30 46 42L61 59Q44 50 35 50L20 63Z"
        fill={"url(#" + id + "c)"}
      />
    </svg>
  );
}
