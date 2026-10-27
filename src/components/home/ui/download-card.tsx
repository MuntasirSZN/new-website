interface DownloadCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function DownloadCard({ title, description, icon }: DownloadCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-zinc-200 bg-white py-8 shadow-sm transition-colors hover:border-emerald-500/30 md:py-12 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/20">
      <div className="text-zinc-900 dark:text-zinc-50">{icon}</div>
      <h3 className="font-bold text-xl text-zinc-900 md:text-2xl dark:text-zinc-50">{title}</h3>
      <p className="max-w-64 text-center text-base text-zinc-500 md:text-lg dark:text-zinc-400">
        {description}
      </p>
      <button className="px-7 py-4 font-semibold items-center justify-center rounded-2xl duration-200 ease-in-out hover:bg-emerald-800/90 hover:text-zinc-100 dark:hover:bg-emerald-600/90 border border-[#5D5D5D] bg-transparent text-[#5D5D5D] hover:border-transparent  dark:text-gray-100 dark:hover:text-white">
        Download
      </button>
    </div>
  );
}
