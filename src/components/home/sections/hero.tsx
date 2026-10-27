import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-neutral-50 py-12 md:py-20 lg:py-28 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-350 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-0">
          <div className="flex justify-center flex-col items-baseline">
            <h4 className="rounded-full bg-emerald-500/20 px-5 py-2.5 font-medium text-emerald-900 text-sm dark:bg-emerald-500/10 dark:text-emerald-400">
              Open Source • Cross Platform
            </h4>

            <h1 className="max-w-2xl pt-4 pb-5 font-bricolage-grotesque font-extrabold text-3xl text-zinc-900 leading-tight tracking-tight md:text-5xl dark:text-zinc-50">
              The Last{" "}
              <span className="bg-linear-to-r from-emerald-900 to-emerald-800/80 bg-clip-text text-transparent dark:bg-linear-to-r dark:from-emerald-600 dark:to-emerald-600/80">
                Bangla writing solution
              </span>{" "}
              you'll ever need!
            </h1>

            <p className="max-w-xl pb-8 font-medium text-lg text-zinc-600 leading-relaxed md:pb-12 md:text-xl dark:text-zinc-400">
              Fast, smart Bangla typing with phonetic and fixed layouts Available on
              <span className="font-bold"> Linux, Windows, and macOS.</span>
            </p>

            <div className="w-full flex flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
              <button className="px-7 py-4 font-semibold items-center justify-center rounded-2xl duration-200 ease-in-out border border-transparent bg-emerald-700 text-white hover:bg-emerald-800/90 dark:bg-emerald-700 dark:hover:bg-emerald-600/90">
                Install OpenBangla Keyboard
              </button>
              <button className="px-7 py-4 font-semibolditems-center justify-center rounded-2xl duration-200 ease-in-out border border-[#5D5D5D] bg-transparent text-[#5D5D5D] hover:border-transparent hover:bg-gray-300 dark:text-gray-100 dark:hover:bg-gray-300/30 dark:hover:text-white">
                View Demo
              </button>
            </div>
          </div>
          <div className="flex w-full justify-center lg:w-auto">
            <Image
              src="https://placehold.co/500x300/e2e8f0/475569"
              alt="placeholder"
              height={300}
              width={500}
              className="h-auto max-w-full rounded-2xl dark:opacity-90"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
