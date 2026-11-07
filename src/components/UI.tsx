import { useEffect, useRef, useId } from "react";
import type { ReactNode } from "react";
import { ArrowUpRight, X, Orbit, Search } from "lucide-react";
import { useT } from "../core/store";
export function Button({
  children,
  onClick,
  variant = "",
  disabled = false,
  type = "button",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  return (
    <button
      type={type}
      className={"button " + variant}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}
export function PageHead({
  index,
  title,
  description,
  action,
}: {
  index: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <span className="eyebrow">// {index}</span>
        <h1>
          {title}
          <span className="accent">.</span>
        </h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
export function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <Orbit size={36} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId(),
    t = useT();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={"modal " + (wide ? "wide" : "")}
      aria-labelledby={id}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header>
        <h2 id={id}>{title}</h2>
        <button
          className="icon-button"
          aria-label={t("Close", "ปิด")}
          onClick={onClose}
        >
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
export function Mascot({ calm = false }: { calm?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={"mascot " + (calm ? "calm" : "")}
      viewBox="0 0 100 112"
      aria-label="Arty companion"
      role="img"
    >
      <defs>
        <linearGradient id={id} x2="1" y2="1">
          <stop stopColor="#E5FF9E" />
          <stop offset=".5" stopColor="#CCFF00" />
          <stop offset="1" stopColor="#6E9D0A" />
        </linearGradient>
      </defs>
      <path
        d="M18 65V43a32 32 0 0 1 64 0v46c0 8-10 12-16 5l-5-6-11 10-12-10-8 8c-7 5-12 0-12-8Z"
        fill={`url(#${id})`}
      />
      <ellipse cx="38" cy="47" rx="5" ry="8" fill="#10160B" />
      <ellipse cx="63" cy="47" rx="5" ry="8" fill="#10160B" />
      <path
        d="M44 66q8 7 15-1"
        stroke="#23320B"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="106" rx="27" ry="3" fill="#CCFF00" opacity=".1" />
    </svg>
  );
}
export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search-box">
      <Search size={17} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        placeholder={placeholder}
      />
    </label>
  );
}
export function Arrow() {
  return <ArrowUpRight size={18} />;
}
