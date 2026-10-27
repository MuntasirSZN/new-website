import DownloadCard from "../ui/download-card";
import { Linux, MacOS, Windows } from "../ui/icons";

const GET_OBK = [
  {
    id: "linux",
    title: "Linux",
    description: "Full Windows 10/11 compatibility",
    icon: <Linux />,
  },

  {
    id: "mac",
    title: "MacOS",
    description: "Runs smoothly on Apple Silicon & Intel",
    icon: <MacOS />,
  },
  {
    id: "windows",
    title: "Windows",
    description: "Native support for all major distributions",
    icon: <Windows />,
  },
];

export default function GetObk() {
  return (
    <section className="bg-neutral-50 pt-16 pb-24 md:pt-20 md:pb-32 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-350 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <h2 className="font-bold font-bricolage-grotesque text-3xl text-zinc-900 md:text-4xl dark:text-zinc-50">
            Get OpenBangla Keyboard
          </h2>
          <p className="max-w-2xl text-lg text-zinc-600 md:text-xl dark:text-zinc-400">
            Available on all major platforms. Choose your OS to get started.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3 md:pt-16">
          {GET_OBK.map((item) => (
            <DownloadCard
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
