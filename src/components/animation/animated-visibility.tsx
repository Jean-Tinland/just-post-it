"use client";

import * as React from "react";
import { motionValuesToStyle, type MotionValues } from "./motion-values";

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  visible: boolean;
  initial?: MotionValues;
  animate?: MotionValues;
  exit?: MotionValues;
  duration?: number;
  children: React.ReactNode;
};

const DEFAULT_DURATION = 160;

function mergeTransform(
  style: React.CSSProperties | undefined,
  animationStyle: React.CSSProperties,
) {
  const baseTransform =
    typeof style?.transform === "string" ? style.transform : undefined;
  const animatedTransform =
    typeof animationStyle.transform === "string"
      ? animationStyle.transform
      : undefined;

  if (!baseTransform) return animatedTransform;
  if (!animatedTransform) return baseTransform;

  return `${baseTransform} ${animatedTransform}`;
}

export default function AnimatedVisibility({
  visible,
  initial,
  animate,
  exit,
  duration = DEFAULT_DURATION,
  style,
  children,
  ...rest
}: Props) {
  const [mounted, setMounted] = React.useState(visible);
  const [phase, setPhase] = React.useState<"enter" | "active" | "exit">(
    visible ? "enter" : "exit",
  );

  const frameRef = React.useRef<number>(undefined);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    if (frameRef.current !== undefined) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }

    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    if (visible) {
      setMounted(true);
      setPhase("enter");
      frameRef.current = requestAnimationFrame(() => {
        setPhase("active");
      });
      return;
    }

    if (!mounted) {
      return;
    }

    setPhase("exit");
    timeoutRef.current = setTimeout(() => {
      setMounted(false);
    }, duration);
  }, [visible, mounted, duration]);

  React.useEffect(() => {
    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }

      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const values =
    phase === "enter"
      ? (initial ?? animate)
      : phase === "exit"
        ? (exit ?? initial ?? animate)
        : (animate ?? initial);

  const animationStyle = motionValuesToStyle(values);
  const transition = `opacity ${duration}ms var(--ds-transition-easing), transform ${duration}ms var(--ds-transition-easing)`;
  const transform = mergeTransform(style, animationStyle);

  return (
    <div
      {...rest}
      style={{
        ...style,
        ...animationStyle,
        ...(transform ? { transform } : undefined),
        transition: style?.transition
          ? `${style.transition}, ${transition}`
          : transition,
      }}
    >
      {children}
    </div>
  );
}
