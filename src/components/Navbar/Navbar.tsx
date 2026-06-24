type NavbarProps = {
  started: boolean;
};

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ started }: NavbarProps) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-opacity duration-700 md:px-12"
      style={{ opacity: started ? 1 : 0 }}
    >
      <a
        href="#top"
        className="font-display text-lg uppercase tracking-tight"
        data-cursor="hover"
      >
        Lyba<span className="text-accent">.</span>
      </a>

      <nav className="hidden gap-8 font-sans text-xs uppercase tracking-[0.2em] md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-cursor="hover"
            className="group relative py-1 text-ink/70 transition-colors hover:text-ink"
          >
            {link.label}
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 ease-expo group-hover:scale-x-100" />
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        data-cursor="hover"
        className="rounded-full border border-ink/30 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper md:hidden"
      >
        Contact
      </a>
    </header>
  );
}
