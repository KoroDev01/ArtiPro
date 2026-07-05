export default function PageBanner({ title, subtitle, action, children }) {
  return (
    <section className="relative mt-16 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6 sm:py-10 md:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          )}
        </div>
        {action}
        {children}
      </div>
    </section>
  );
}
