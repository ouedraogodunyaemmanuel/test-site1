// Automatically shown by Next.js while a page (or its data) is
// loading — same visual language as the rest of the site (serif
// wordmark, stone palette) so the transition feels seamless.
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fond px-6">
      <span className="font-serif text-xl tracking-[0.2em] text-encre">
        DEO CREATION
      </span>
      <div className="mt-6 h-px w-24 overflow-hidden bg-filet">
        <div className="h-full w-8 bg-accent [animation:loading-line_1.4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
