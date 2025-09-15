import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/DMSans";
import { cn } from "../lib/utils";

const { fontFamily } = loadFont();

type Animations = "typing" | "none";

interface AnimatedTextProps {
  text: string;
  from?: number;
  to?: number;
  className?: string;
  animation?: Animations;
  typingSpeed?: number; // frames per character
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  from = 0,
  to = 60,
  className,
  animation = "none",
  typingSpeed = 3, // smaller = faster typing
}) => {
  const duration = to - from;

  if (animation === "none") {
    return (
      <Sequence from={from} durationInFrames={duration}>
        <span
          style={{ fontFamily }}
          className={cn(
            "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-2 font-bold text-transparent",
            className,
          )}
        >
          {text}
        </span>
      </Sequence>
    );
  }

  if (animation === "typing") {
    return (
      <div className="flex flex-row tracking-tight justify-center">
        {text.split("").map((char, index) => {
          const charFrom = from + index * typingSpeed;
          const charDuration = duration - index * typingSpeed;

          return (
            <Sequence
              key={`char-${index}`}
              from={charFrom}
              durationInFrames={5}
              style={{
                position: "relative",
                width: "max-content",
                height: "max-content",
              }}
            >
              <span
                style={{ fontFamily }}
                className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-2 font-bold text-transparent"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            </Sequence>
          );
        })}
      </div>
    );
  }

  return null;
};

export default AnimatedText;
