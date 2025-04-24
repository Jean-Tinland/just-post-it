"use client";

import * as React from "react";

export type IconCode =
  | "bin"
  | "calendar"
  | "chevron-up"
  | "close"
  | "download"
  | "file-edit"
  | "file-text"
  | "github"
  | "grid"
  | "info"
  | "more-vertical"
  | "plus"
  | "question"
  | "search"
  | "settings"
  | "trello"
  | "tune";

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
