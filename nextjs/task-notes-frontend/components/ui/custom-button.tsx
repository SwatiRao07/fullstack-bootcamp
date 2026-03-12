import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

const customButtonVariants = cva(
  "relative overflow-hidden transition-all duration-200",
  {
    variants: {
      intent: {
        success: "bg-green-600 hover:bg-green-700 text-white shadow-green-200/50",
        warning: "bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-200/50",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-red-200/50",
      },
      glow: {
        true: "shadow-lg hover:shadow-xl",
        false: "",
      }
    },
    defaultVariants: {
      glow: false,
    },
  }
);

interface CustomButtonProps
  extends ButtonProps,
    VariantProps<typeof customButtonVariants> {}

export function CustomButton({
  className,
  intent,
  glow,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      className={cn(customButtonVariants({ intent, glow }), className)}
      {...props}
    />
  );
}
