import { ACompleter } from "@/components/shared/ACompleter";

// Placeholder contact address: replace with the real address before
// going live (see the yellow marker below).
const EMAIL_CONTACT = "ouedraogodunya@gmail.com";

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <h2 className="font-serif text-3xl text-stone-900">Contact</h2>
        <p className="mt-6 text-stone-600 leading-relaxed">
          Un tirage, une commande ou un projet sur mesure ? Écrivez-nous
          directement — nous répondons personnellement à chaque demande.
        </p>
        <a
          href={`mailto:${EMAIL_CONTACT}`}
          className="mt-8 inline-flex items-center gap-2 border border-stone-900 px-6 py-3 text-sm tracking-wide text-stone-900 transition hover:bg-stone-900 hover:text-stone-50 active:scale-[0.97]"
        >
          {EMAIL_CONTACT}
        </a>
      </div>
    </section>
  );
}
