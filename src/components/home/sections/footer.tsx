import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const FOOTER_DATA = [
    {
      title: "Projects",
      links: [
        { label: "Packhub", href: "https://github.com/mominul/packhub" },
        {
          label: "Rupantor-rs",
          href: "https://github.com/openbangla/rupantor-rs",
        },
        { label: "Riti", href: "https://github.com/openbangla/riti" },
        {
          label: "Poriborton",
          href: "https://github.com/openbangla/poriborton",
        },
        {
          label: "Layout Editor",
          href: "https://github.com/openbangla/layout-editor",
        },
      ],
    },
    {
      title: "Pages",
      links: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Docs", href: "/docs" },
        { label: "Smth", href: "#" },
      ],
    },
    {
      title: "Socials",
      links: [
        {
          label: "Facebook",
          href: "https://www.facebook.com/openbanglakeyboard/",
        },
        { label: "Twitter/X", href: "https://x.com/openbanglateam" },
        { label: "GitHub", href: "https://github.com/openbangla" },
      ],
    },
  ];

  return (
    <footer className="border-zinc-200 border-t bg-neutral-50 py-12 md:py-16 dark:border-zinc-800 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-350 px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col items-stretch justify-between gap-12 lg:flex-row lg:items-start">
          {/* Brand & Description */}
          <div className="flex max-w-sm flex-col items-start gap-4">
            <div className="flex items-center justify-center gap-3">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <Image src="https://placehold.co/48x48" alt="placeholder" width={48} height={48} />
              </div>

              {/* Replace with actual logo Image */}
              <h3 className="font-bold font-bricolage-grotesque text-2xl text-zinc-950 dark:text-zinc-50">
                OpenBangla
              </h3>
            </div>
            <p className="text-zinc-600 leading-relaxed dark:text-zinc-400">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque velit consectetur a,
              placeat laudantium tempore molestiae ipsam.
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-20 sm:grid-cols-3">
            {FOOTER_DATA.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h4 className="font-semibold text-emerald-800 text-xl dark:text-emerald-600">
                  {column.title}
                </h4>
                <ul className="flex flex-col gap-2 text-zinc-700 dark:text-zinc-300">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-emerald-800/90 dark:hover:text-emerald-600/90"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-zinc-100 border-t pt-8 font-medium text-zinc-500 md:flex-row dark:border-zinc-900 dark:text-zinc-400">
          <p>© 2015–{currentYear} OpenBangla Team</p>
          <p className="text-center">
            Made with ❤️ by{" "}
            <Link
              href="https://github.com/mominul"
              className="mx-1 text-emerald-700 hover:text-emerald-800 dark:hover:text-emerald-600"
            >
              Muhammad Mominul Huque
            </Link>{" "}
            and ✨
            <Link
              href="#"
              className="mx-1 text-emerald-700 hover:text-emerald-800 dark:hover:text-emerald-600"
            >
              contributors
            </Link>{" "}
            ✨!
          </p>
        </div>
      </div>
    </footer>
  );
}
