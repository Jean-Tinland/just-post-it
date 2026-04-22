import type * as React from "react";

export type MotionValues = {
  opacity?: number;
  scale?: number;
  x?: number | string;
  y?: number | string;
};

function toLength(value: number | string) {
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
}

export function motionValuesToStyle(
  values?: MotionValues,
): React.CSSProperties {
  if (!values) {
    return {};
  }

  const transforms: string[] = [];

  if (values.x !== undefined || values.y !== undefined) {
    const x = values.x !== undefined ? toLength(values.x) : "0px";
    const y = values.y !== undefined ? toLength(values.y) : "0px";
    transforms.push(`translate(${x}, ${y})`);
  }

  if (values.scale !== undefined) {
    transforms.push(`scale(${values.scale})`);
  }

  return {
    ...(values.opacity !== undefined ? { opacity: values.opacity } : undefined),
    ...(transforms.length > 0
      ? { transform: transforms.join(" ") }
      : undefined),
  };
}
