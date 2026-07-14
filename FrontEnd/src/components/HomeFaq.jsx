import { FAQ_ITEMS } from "../config/seo";

export default function HomeFaq() {
  return (
    <section
      id="faq"
      className="relative border-t border-white/10 py-16 sm:py-24"
      aria-labelledby="faq-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-eyebrow mb-4">FAQ</span>
          <h2 id="faq-heading" className="section-title mb-4">
            Trouver un artisan en Algérie
          </h2>
          <p className="section-subtitle">
            Réponses aux questions les plus fréquentes sur ArtiPro.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="dark-card group rounded-2xl p-5 open:bg-white/[0.09]">
              <summary className="cursor-pointer list-none text-base font-semibold text-white marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span
                    className="text-blue-400 transition group-open:rotate-45"
                    aria-hidden>
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
