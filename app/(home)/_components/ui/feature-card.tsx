import Flex from "@/app/(home)/_components/common/flex";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Flex className="flex-col gap-6 rounded-3xl border border-zinc-200 bg-white py-8 shadow-sm transition-colors hover:border-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/20">
      <div className="text-emerald-600 dark:text-emerald-500">{icon}</div>
      <Flex className="max-w-63.75 flex-col items-center gap-4 text-center text-lg md:gap-5">
        <h3 className="font-bold text-zinc-900 leading-8 dark:text-zinc-100">{title}</h3>
        <p className="text-base text-zinc-500 leading-6 md:text-lg dark:text-zinc-400">
          {description}
        </p>
      </Flex>
    </Flex>
  );
}
