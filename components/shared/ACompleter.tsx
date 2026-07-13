// Visually flags a piece of information I don't know yet (address,
// contact email, timelines...) so it's impossible to miss before
// publishing the page online.
export function ACompleter({ children }: { children: string }) {
  return (
    <mark className="rounded bg-amber-200 px-1 py-0.5 text-stone-900">
      [À compléter : {children}]
    </mark>
  );
}
