"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/experiences", label: "Expériences", icon: <IconBriefcase /> },
    { href: "/projects", label: "Projets", icon: <IconGrid /> },
    { href: "/contact", label: "Contact", icon: <IconMail /> },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-[rgba(11,11,11,0.8)] backdrop-blur sm:border-b sm:border-black/40">
      {/* Desktop navbar */}
      <div className="hidden sm:flex mx-auto max-w-6xl px-4 py-3 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg text-accent">
          Mon Portfolio
        </Link>
        <nav className="flex gap-6 text-sm items-center">
          {links.map(({ href, label, icon }) => (
            <NavItem key={href} href={href} label={label} active={pathname === href}>
              {icon}
            </NavItem>
          ))}
        </nav>
      </div>

      {/* Mobile bottom app bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-black/40 bg-[rgba(11,11,11,0.9)] backdrop-blur pb-[max(env(safe-area-inset-bottom),0px)]">
        <ul className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-4 gap-2 text-[11px]">
          {links.map(({ href, label, icon }) => (
            <li key={href}>
              <NavItem href={href} label={label} active={pathname === href} mobile>
                {icon}
              </NavItem>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function NavItem({
  href,
  label,
  active,
  children,
  mobile = false,
}: {
  href: string;
  label: string;
  active?: boolean;
  children: ReactNode;
  mobile?: boolean;
}) {
  const base = `flex items-center justify-center rounded-md transition-colors ${
    active ? "text-accent" : "text-foreground/80 hover:text-accent"
  }`;
  return (
    <Link
      href={href}
      className={`${base} ${mobile ? "flex-col gap-1 py-1" : "inline-flex gap-2 px-2 py-1"}`}
    >
      <span className={mobile ? "h-6 w-6" : "h-4 w-4"}>{children}</span>
      <span>{label}</span>
    </Link>
  );
}

/* --- Icons --- */
function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
