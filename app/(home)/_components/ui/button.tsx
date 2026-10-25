import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva("items-center justify-center rounded-2xl duration-200 ease-in-out", {
  variants: {
    variant: {
      default:
        "border border-transparent bg-emerald-700 text-white hover:bg-emerald-800/90 dark:bg-emerald-700 dark:hover:bg-emerald-600/90",
      outline:
        "border border-[#5D5D5D] bg-transparent text-[#5D5D5D] hover:border-transparent hover:bg-gray-300 dark:text-gray-100 dark:hover:bg-gray-300/30 dark:hover:text-white",
    },
    size: {
      default: "px-7 py-4 font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
