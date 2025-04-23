"use client";

import * as React from "react";

export type IconCode =
  | "file-edit"
  | "file-text"
  | "settings"
  | "grid"
  | "trello"
  | "download"
  | "more-vertical"
  | "calendar"
  | "close"
  | "bin"
  | "chevron-up"
  | "info"
  | "plus"
  | "search"
  | "tune"
  | "question";

type Props = React.SVGProps<SVGSVGElement> & {
  code: IconCode;
};

export default function Icon({ code, ...props }: Props) {
  const ref = React.useRef<SVGSVGElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const isCompatible = "IntersectionObserver" in window;
    if (isCompatible) {
      const svg = ref.current;
      if (svg) {
        const observer = new IntersectionObserver(
          ([entry]) => setInView(entry.isIntersecting),
          { rootMargin: "24px" },
        );
        observer.observe(svg);
        return () => {
          observer.unobserve(svg);
        };
      }
    } else {
      setInView(true);
    }
  }, []);

  const href = inView ? `/images/icons/${code}.svg#icon` : undefined;

  return (
    <svg ref={ref} width={24} height={24} {...props}>
      <use href={href} />
    </svg>
  );
}
