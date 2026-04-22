"use client";

import * as React from "react";

export type PresenceEntry<T> = {
  key: string | number;
  item: T;
  exiting: boolean;
};

export function usePresenceList<T>(
  items: T[],
  getKey: (item: T) => string | number,
  exitDuration = 160,
) {
  const [rendered, setRendered] = React.useState<PresenceEntry<T>[]>(() =>
    items.map((item) => ({
      key: getKey(item),
      item,
      exiting: false,
    })),
  );

  const timeoutsRef = React.useRef<
    Map<string | number, ReturnType<typeof setTimeout>>
  >(new Map());

  React.useEffect(() => {
    setRendered((previous) => {
      const currentEntries = items.map((item) => ({
        key: getKey(item),
        item,
        exiting: false,
      }));

      const nextKeys = new Set(currentEntries.map((entry) => entry.key));

      const mergedEntries = currentEntries;

      previous.forEach((entry, previousIndex) => {
        if (nextKeys.has(entry.key)) {
          return;
        }

        const insertAt = Math.min(previousIndex, mergedEntries.length);
        mergedEntries.splice(insertAt, 0, {
          ...entry,
          exiting: true,
        });
      });

      return mergedEntries;
    });
  }, [items, getKey]);

  React.useEffect(() => {
    rendered.forEach((entry) => {
      if (!entry.exiting) {
        const timeout = timeoutsRef.current.get(entry.key);
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeoutsRef.current.delete(entry.key);
        }
        return;
      }

      if (timeoutsRef.current.has(entry.key)) {
        return;
      }

      const timeout = setTimeout(() => {
        setRendered((current) =>
          current.filter((currentEntry) => currentEntry.key !== entry.key),
        );
        timeoutsRef.current.delete(entry.key);
      }, exitDuration);

      timeoutsRef.current.set(entry.key, timeout);
    });
  }, [rendered, exitDuration]);

  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutsRef.current.clear();
    };
  }, []);

  return rendered;
}
