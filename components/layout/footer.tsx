import Link from "next/link";

const { SITE_NAME } = process.env;

export default async function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center px-4 py-20 sm:px-6 lg:px-12 text-center">
        {/* Brand */}
        <Link href="/" className="mb-10 flex flex-col items-center transition-opacity hover:opacity-80">
          <span className="text-xl font-bold tracking-[0.3em] text-neutral-900 uppercase">
            {SITE_NAME || "DJAYA LEVY"}
          </span>
        </Link>

        {/* Links */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-500">
          <a href="https://instagram.com/djayalevy" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">
            Instagram
          </a>
        </div>

        {/* Company Info / Copyright */}
        <div className="flex flex-col items-center gap-2 text-[10px] tracking-widest text-neutral-400 uppercase">
          <p>&copy; 2026 DJAYA LEVY &middot; DJAYA E LEVY LTDA</p>
          <div className="flex flex-col items-center gap-1 mt-2">
            <p>53.737.969/0001-06 &middot; S&atilde;o Paulo - SP</p>
            <p>
              Contato &mdash; <a href="mailto:atelier@djayalevy.com" className="hover:text-neutral-900 transition-colors lowercase">atelier@djayalevy.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
