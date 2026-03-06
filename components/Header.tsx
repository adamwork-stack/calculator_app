import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-primary-700 transition-colors"
        >
          Retirement Calculator
        </Link>
        <nav className="text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Calculator
          </Link>
        </nav>
      </div>
    </header>
  );
}
