// Automatically shown by Next.js while a page (or its data) is
// loading — same visual language as the rest of the site (serif
// wordmark, stone palette) so the transition feels seamless.
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6">
      <span className="font-serif text-xl tracking-[0.2em] text-stone-900">
        DEO CREATION
      </span>
      <div className="mt-6 h-px w-24 overflow-hidden bg-stone-200">
        <div className="h-full w-8 bg-stone-900 [animation:loading-line_1.4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
