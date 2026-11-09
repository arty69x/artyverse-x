import { useId } from "react";

/** Original decorative orbital sculpture. No UI or editable content in the artwork. */
export function OrbitalArtwork() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="studio-orbital" aria-hidden="true">
      <span className="studio-orbital-coordinate">
        AV—01 / LIMITLESS BY DESIGN
      </span>
      <svg viewBox="0 0 600 620" focusable="false">
        <defs>
          <linearGradient id={id + "metal"} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbfff4" />
            <stop offset=".22" stopColor="#95aba3" />
            <stop offset=".43" stopColor="#172b24" />
            <stop offset=".6" stopColor="#d6ff79" />
            <stop offset=".78" stopColor="#33483c" />
            <stop offset="1" stopColor="#e4ffe5" />
          </linearGradient>
          <radialGradient id={id + "core"} cx=".35" cy=".25" r=".8">
            <stop offset="0" stopColor="#eaffbf" />
            <stop offset=".32" stopColor="#b8ff36" />
            <stop offset=".7" stopColor="#4c8623" />
            <stop offset="1" stopColor="#102318" />
          </radialGradient>
          <radialGradient id={id + "halo"}>
            <stop stopColor="#b8ff36" stopOpacity=".16" />
            <stop offset="1" stopColor="#b8ff36" stopOpacity="0" />
          </radialGradient>
          <filter
            id={id + "shadow"}
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <circle cx="300" cy="300" r="290" fill={"url(#" + id + "halo)"} />
        <g fill="none" stroke="#91ad98" strokeOpacity=".18" strokeWidth=".7">
          <circle cx="300" cy="300" r="244" />
          <circle cx="300" cy="300" r="199" strokeDasharray="2 9" />
          <path d="M20 300H580M300 20V580" />
          <path d="M127 127L473 473M127 473L473 127" strokeDasharray="3 14" />
        </g>
        <ellipse
          cx="300"
          cy="533"
          rx="158"
          ry="12"
          fill="#b8ff36"
          opacity=".13"
          filter={"url(#" + id + "shadow)"}
        />
        <g
          className="studio-sculpture"
          transform="translate(300 300) rotate(-32)"
        >
          <ellipse
            rx="195"
            ry="128"
            fill="none"
            stroke="#0a1510"
            strokeWidth="54"
            transform="rotate(65)"
          />
          <ellipse
            rx="195"
            ry="128"
            fill="none"
            stroke={"url(#" + id + "metal)"}
            strokeWidth="32"
            transform="rotate(65)"
          />
          <ellipse
            rx="195"
            ry="128"
            fill="none"
            stroke="#edffdb"
            strokeOpacity=".52"
            strokeWidth="1.2"
            transform="rotate(65)"
          />
          <circle r="82" fill={"url(#" + id + "core)"} />
          <ellipse
            rx="210"
            ry="86"
            fill="none"
            stroke={"url(#" + id + "metal)"}
            strokeWidth="38"
          />
          <ellipse
            rx="210"
            ry="86"
            fill="none"
            stroke="#e5ffda"
            strokeOpacity=".6"
            strokeWidth="1"
          />
          <path
            d="M-207 -10C-185 88 154 122 210 4"
            fill="none"
            stroke="#101e17"
            strokeWidth="7"
            opacity=".8"
          />
        </g>
        <g fill="#d8ff8f">
          <circle cx="117" cy="157" r="4" />
          <circle cx="499" cy="386" r="3" />
          <path d="M464 115v16m-8-8h16" stroke="#d8ff8f" />
        </g>
      </svg>
      <div className="studio-orbital-label">
        <span>∞</span>
        <div>
          ONE IDEA.
          <br />
          <strong>INFINITE POSSIBILITIES.</strong>
        </div>
      </div>
    </div>
  );
}
