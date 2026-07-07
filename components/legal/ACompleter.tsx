// Marque visuellement une information que je ne connais pas (adresse,
// email de contact, délais...) pour qu'elle soit impossible à manquer
// avant de publier la page en ligne.
export function ACompleter({ children }: { children: string }) {
  return (
    <mark className="rounded bg-amber-200 px-1 py-0.5 text-stone-900">
      [À compléter : {children}]
    </mark>
  );
}
