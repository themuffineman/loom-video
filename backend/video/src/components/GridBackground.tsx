import { AbsoluteFill } from "remotion";
import { cn } from "../lib/utils";
import noise from "../../public/noise.webp";

export function GridBackgroundDemo({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <AbsoluteFill>
      <div className="relative flex h-full w-full items-center justify-center bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        <div
          className="absolute bg-neutral-800 top-0 left-0 w-full h-full opacity-12"
          style={{ backgroundImage: `url(${noise})` }}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <div
          className={cn(
            "relative z-20 bg-gradient-to-b size-full  from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
}
