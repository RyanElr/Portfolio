// A bitten cookie whose chips are glowing pixels, matching the site's ember / matrix look.
export default function CookieIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 12.4A9 9 0 1 1 11.6 3a3.2 3.2 0 0 0 3.6 3.6 3.2 3.2 0 0 0 3.6 3.6 2.6 2.6 0 0 0 2.2 2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Bite crumbs */}
      <path d="M17.6 3.6h1.2v1.2h-1.2zM20.2 6.6h1v1h-1z" fill="currentColor" opacity="0.55" />
      {/* Pixel chips */}
      <g fill="#ff5140" style={{ filter: "drop-shadow(0 0 2px #fa2516aa)" }}>
        <path d="M8.5 7.4 10 8.9 8.5 10.4 7 8.9Z" />
        <path d="M14.6 12.4 16 13.8l-1.4 1.4-1.4-1.4Z" />
        <path d="M9.2 14.6 10.4 15.8 9.2 17 8 15.8Z" />
        <path d="M11.6 11.1h1.4v1.4h-1.4z" />
        <path d="M6.2 12.2h1.2v1.2H6.2zM12.8 17.4h1.2v1.2h-1.2z" opacity="0.7" />
      </g>
    </svg>
  );
}
