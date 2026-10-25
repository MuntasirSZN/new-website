import { cn } from "@/lib/cn";

interface FlexProps {
  children: React.ReactNode;
  className?: string;
}

export default function Flex({ children, className }: FlexProps) {
  return <div className={cn("flex items-center justify-center", className)}>{children}</div>;
}
