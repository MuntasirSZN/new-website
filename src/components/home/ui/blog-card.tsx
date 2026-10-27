import { ArrowRight, Calendar, User } from "lucide-react";

interface BlogCardProps {
  author: string;
  title: string;
  date: string;
  description: string;
}

export default function BlogCard({ author, title, date, description }: BlogCardProps) {
  return (
    <div className="group flex flex-col items-stretch justify-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-base text-zinc-900 leading-tight md:text-lg dark:text-zinc-50">
            {title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center justify-start gap-x-4 gap-y-1 text-zinc-400 dark:text-zinc-500">
            <div className="flex items-center justify-center gap-1.5">
              <Calendar size={14} />
              <p className="font-medium text-xs uppercase tracking-wider">{date}</p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <User size={14} />
              <p className="font-medium text-xs uppercase tracking-wider">{author}</p>
            </div>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="mt-1 shrink-0 text-zinc-300 transition-colors group-hover:text-emerald-500 dark:text-zinc-600"
        />
      </div>
      <p className="line-clamp-2 text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
