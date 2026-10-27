import FeatureCard from "../ui/feature-card";
import {
  AutoCorrect,
  Dictionary,
  FullyCustomizable,
  LayoutViewer,
  Performance,
  PreferenceMemory,
} from "../ui/icons";

const FEATURES = [
  {
    id: "high-performance",
    title: "High Performance",
    description: "Built with speed and responsiveness in mind for a lag-free typing experience.",
    icon: <Performance />,
  },
  {
    id: "dictionary-based-suggestion",
    title: "Dictionary based suggestion",
    description: "Real-time phonetic prediction with correct Bangla spelling suggestions.",
    icon: <Dictionary />,
  },
  {
    id: "auto-correct",
    title: "Auto Correct",
    description: "Built with speed and responsiveness in mind for a lag-free typing experience.",
    icon: <AutoCorrect />,
  },
  {
    id: "preference-memory",
    title: "Preference Memory",
    description: "Remembers previously selected words and prioritizes them for faster typing.",
    icon: <PreferenceMemory />,
  },
  {
    id: "layout-viewer",
    title: "Layout Viewer",
    description:
      "Built-in image viewer for keyboard layouts so you never lose track of key positions.",
    icon: <LayoutViewer />,
  },
  {
    id: "fully-customizable",
    title: "Fully Customizable",
    description: "Configurable settings that stay out of your way while you type.",
    icon: <FullyCustomizable />,
  },
];

export default function Features() {
  return (
    <section className="bg-neutral-50 pt-16 pb-24 md:pt-20 md:pb-32 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-350 px-4 md:px-6">
        <h2 className="mx-auto max-w-md text-center font-bold font-bricolage-grotesque text-3xl text-zinc-900 md:text-4xl dark:text-zinc-50">
          Everything You Need to Type Bangla
        </h2>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 md:pt-16 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
