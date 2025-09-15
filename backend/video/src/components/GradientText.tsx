import React from "react";
import { cn } from "../lib/utils";

const GradientText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <p
      className={cn(
        "relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl",
        className,
      )}
    >
      {children}
    </p>
  );
};

export default GradientText;
