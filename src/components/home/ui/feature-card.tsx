interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-zinc-200 bg-white py-8 shadow-sm transition-colors hover:border-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/20">
      <div>{icon}</div>
      <div className="max-w-63.75 flex flex-col items-center justify-center gap-4 text-center text-lg md:gap-5">
        <h3 className="font-bold text-zinc-900 leading-8 dark:text-zinc-100">{title}</h3>
        <p className="text-base text-zinc-500 leading-6 md:text-lg dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}
