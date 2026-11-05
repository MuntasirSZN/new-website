import Link from "next/link";
import { Card, Cards } from "fumadocs-ui/components/card";

export const metadata = {
  title: "OpenBangla Keyboard",
  description: "A free and open-source Bangla keyboard for Linux, macOS, and Windows.",
};

const features = [
  {
    title: "Layouts for every typist",
    description:
      "Type with Avro, Probhat, Munir Optima, Jatiya & more. Avro users will feel at home.",
  },
  {
    title: "Add your own layout",
    description: "Create a custom keyboard layout if none of the built-in ones suit you.",
  },
  {
    title: "Word suggestions",
    description: "As you type, suggested words appear so you can finish a word faster.",
  },
  {
    title: "Autocorrect",
    description: "Common spellings are corrected for you, and you can edit or add entries.",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-(--fd-layout-width) space-y-20 px-4 py-12">
      <section className="flex flex-col items-start gap-6">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">OpenBangla Keyboard</h1>
        <p className="text-xl sm:text-2xl">Write Bangla on Linux, macOS, and Windows.</p>
        <p className="max-w-xl text-fd-muted-foreground">
          A free and open-source Bangla keyboard. Type phonetically or with a layout you already
          know, and pick from word suggestions as you write.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/installation"
            className={`rounded-lg bg-[#d72c28] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c12824] ${focusRing}`}
          >
            Get started
          </Link>
          <a
            href="https://github.com/OpenBangla/OpenBangla-Keyboard"
            className={`rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent ${focusRing}`}
          >
            View on GitHub
          </a>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
        <Cards>
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </Cards>
      </section>

      <footer className="border-t border-fd-border pt-8 text-sm text-fd-muted-foreground">
        Free software under the GPL-3.0 license.{" "}
        <Link href="/docs/contributing" className="underline underline-offset-4">
          Contributions are welcome.
        </Link>
      </footer>
    </div>
  );
}
