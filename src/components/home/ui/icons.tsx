import Image from "next/image";

import performance from "@/assets/icons/performance.svg";
import dictionary from "@/assets/icons/dictionary.svg";
import autoCorrect from "@/assets/icons/auto-correct.svg";
import preferenceMemory from "@/assets/icons/preference-memory.svg";
import layoutViewer from "@/assets/icons/layout-viewer.svg";
import fullyCustomizable from "@/assets/icons/fully-customizable.svg";
import linux from "@/assets/icons/linux.svg";
import macos from "@/assets/icons/macos.svg";
import windows from "@/assets/icons/windows.svg";

export function Performance() {
  return (
    <Image
      src={performance}
      alt="Performance"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function Dictionary() {
  return (
    <Image
      src={dictionary}
      alt="Dictionary"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function AutoCorrect() {
  return (
    <Image
      src={autoCorrect}
      alt="Auto Correct"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function PreferenceMemory() {
  return (
    <Image
      src={preferenceMemory}
      alt="Preference Memory"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function LayoutViewer() {
  return (
    <Image
      src={layoutViewer}
      alt="Layout Viewer"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function FullyCustomizable() {
  return (
    <Image
      src={fullyCustomizable}
      alt="Fully Customizable"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function Linux() {
  return (
    <Image
      src={linux}
      alt="Linux"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function MacOS() {
  return (
    <Image
      src={macos}
      alt="MacOS"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}

export function Windows() {
  return (
    <Image
      src={windows}
      alt="Windows"
      width={64}
      height={64}
      className="dark:brightness-0 dark:invert"
    />
  );
}
