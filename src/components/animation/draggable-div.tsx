"use client";

import * as React from "react";

type Point = {
  x: number;
  y: number;
};

export type PanInfo = {
  point: Point;
  offset: Point;
};

type DragBounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type DragConstraints =
  | DragBounds
  | React.RefObject<HTMLElement | null>
  | React.RefObject<HTMLDivElement | null>;

type DragDirection = boolean | "x" | "y";

type DragHandler = (
  event: MouseEvent | TouchEvent | PointerEvent,
  info: PanInfo,
) => void;

type BaseDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDragStart" | "onDrag" | "onDragEnd"
>;

type Props = BaseDivProps & {
  drag?: DragDirection;
  dragConstraints?: DragConstraints;
  dragSnapToOrigin?: boolean;
  whileDrag?: React.CSSProperties;
  onDragStart?: DragHandler;
  onDrag?: DragHandler;
  onDragEnd?: DragHandler;
  dragMomentum?: boolean;
  dragElastic?: number;
  dragTransition?: { timeConstant?: number };
  offsetResetKey?: string | number;
};

type DragSession = {
  pointerId: number;
  started: boolean;
  startX: number;
  startY: number;
  startOffsetX: number;
  startOffsetY: number;
  refLimits?: {
    minDeltaX: number;
    maxDeltaX: number;
    minDeltaY: number;
    maxDeltaY: number;
  };
  boxLimits?: DragBounds;
};

const SNAP_DURATION = 140;
const DRAG_START_THRESHOLD = 3;
const DRAG_RESET = { x: 0, y: 0 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export const DraggableDiv = React.forwardRef<HTMLDivElement, Props>(
  function DraggableDiv(
    {
      drag = false,
      dragConstraints,
      dragSnapToOrigin = false,
      whileDrag,
      onDragStart,
      onDrag,
      onDragEnd,
      dragMomentum: _dragMomentum,
      dragElastic: _dragElastic,
      dragTransition: _dragTransition,
      offsetResetKey,
      style,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      ...rest
    },
    forwardedRef,
  ) {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    const sessionRef = React.useRef<DragSession | null>(null);
    const snapTimeoutRef =
      React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const snapFrameRef = React.useRef<number>(undefined);

    const offsetRef = React.useRef(DRAG_RESET);
    const [dragging, setDragging] = React.useState(false);
    const [snappingBack, setSnappingBack] = React.useState(false);

    const setDragOffset = React.useCallback((nextOffset: Point) => {
      offsetRef.current = nextOffset;
      const node = nodeRef.current;
      if (!node) return;

      node.style.setProperty("--jt-drag-x", `${Math.round(nextOffset.x)}px`);
      node.style.setProperty("--jt-drag-y", `${Math.round(nextOffset.y)}px`);
    }, []);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        nodeRef.current = node;

        if (!forwardedRef) return;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
          return;
        }

        forwardedRef.current = node;
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      setDragOffset(DRAG_RESET);
    }, [offsetResetKey, setDragOffset]);

    React.useEffect(() => {
      return () => {
        if (snapTimeoutRef.current !== undefined) {
          clearTimeout(snapTimeoutRef.current);
        }

        if (snapFrameRef.current !== undefined) {
          cancelAnimationFrame(snapFrameRef.current);
        }
      };
    }, []);

    const isEnabled = drag !== false;
    const lockX = drag === "y";
    const lockY = drag === "x";

    const computeRefLimits = React.useCallback(() => {
      const node = nodeRef.current;
      if (!node || !dragConstraints || !("current" in dragConstraints)) {
        return undefined;
      }

      const container = dragConstraints.current;
      if (!container) return undefined;

      const nodeRect = node.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      return {
        minDeltaX: containerRect.left - nodeRect.left,
        maxDeltaX: containerRect.right - nodeRect.right,
        minDeltaY: containerRect.top - nodeRect.top,
        maxDeltaY: containerRect.bottom - nodeRect.bottom,
      };
    }, [dragConstraints]);

    const computeBoxLimits = React.useCallback(() => {
      if (!dragConstraints || "current" in dragConstraints) {
        return undefined;
      }
      return dragConstraints;
    }, [dragConstraints]);

    const getInfoOffset = React.useCallback(
      (deltaX: number, deltaY: number, session: DragSession) => {
        if (session.refLimits) {
          return {
            x: clamp(
              deltaX,
              session.refLimits.minDeltaX,
              session.refLimits.maxDeltaX,
            ),
            y: clamp(
              deltaY,
              session.refLimits.minDeltaY,
              session.refLimits.maxDeltaY,
            ),
          };
        }

        return { x: deltaX, y: deltaY };
      },
      [],
    );

    const getVisualOffset = React.useCallback(
      (infoOffset: Point, session: DragSession) => {
        let visualDeltaX = infoOffset.x;
        let visualDeltaY = infoOffset.y;

        if (session.boxLimits) {
          visualDeltaX = clamp(
            infoOffset.x,
            -session.boxLimits.left,
            session.boxLimits.right,
          );
          visualDeltaY = clamp(
            infoOffset.y,
            -session.boxLimits.top,
            session.boxLimits.bottom,
          );
        }

        return {
          x: lockX ? session.startOffsetX : session.startOffsetX + visualDeltaX,
          y: lockY ? session.startOffsetY : session.startOffsetY + visualDeltaY,
        };
      },
      [lockX, lockY],
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);

      if (!isEnabled) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const node = nodeRef.current;
      if (!node) return;

      const nextSession: DragSession = {
        pointerId: event.pointerId,
        started: false,
        startX: event.clientX,
        startY: event.clientY,
        startOffsetX: offsetRef.current.x,
        startOffsetY: offsetRef.current.y,
        refLimits: computeRefLimits(),
        boxLimits: computeBoxLimits(),
      };

      sessionRef.current = nextSession;

      if (snapTimeoutRef.current !== undefined) {
        clearTimeout(snapTimeoutRef.current);
        snapTimeoutRef.current = undefined;
      }

      if (snapFrameRef.current !== undefined) {
        cancelAnimationFrame(snapFrameRef.current);
        snapFrameRef.current = undefined;
      }

      setSnappingBack(false);

      node.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);

      const session = sessionRef.current;
      if (!session || session.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;

      const hasMovedEnough =
        Math.abs(deltaX) > DRAG_START_THRESHOLD ||
        Math.abs(deltaY) > DRAG_START_THRESHOLD;

      if (!session.started && !hasMovedEnough) {
        return;
      }

      if (!session.started) {
        session.started = true;
        setDragging(true);
        setSnappingBack(false);

        onDragStart?.(event.nativeEvent, {
          point: { x: event.clientX, y: event.clientY },
          offset: { x: 0, y: 0 },
        });
      }

      const infoOffset = getInfoOffset(deltaX, deltaY, session);
      const visualOffset = getVisualOffset(infoOffset, session);

      setDragOffset(visualOffset);

      onDrag?.(event.nativeEvent, {
        point: { x: event.clientX, y: event.clientY },
        offset: infoOffset,
      });
    };

    const endDrag = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        const session = sessionRef.current;
        if (!session || session.pointerId !== event.pointerId) return;

        if (!session.started) {
          sessionRef.current = null;
          return;
        }

        const deltaX = event.clientX - session.startX;
        const deltaY = event.clientY - session.startY;
        const infoOffset = getInfoOffset(deltaX, deltaY, session);

        onDragEnd?.(event.nativeEvent, {
          point: { x: event.clientX, y: event.clientY },
          offset: infoOffset,
        });

        sessionRef.current = null;
        setDragging(false);

        if (dragSnapToOrigin) {
          setSnappingBack(true);

          if (snapFrameRef.current !== undefined) {
            cancelAnimationFrame(snapFrameRef.current);
          }

          // Apply transition first, then reset position on next frame.
          snapFrameRef.current = requestAnimationFrame(() => {
            setDragOffset(DRAG_RESET);
            snapFrameRef.current = undefined;
          });

          snapTimeoutRef.current = setTimeout(() => {
            setSnappingBack(false);
            snapTimeoutRef.current = undefined;
          }, SNAP_DURATION);
        }
      },
      [dragSnapToOrigin, getInfoOffset, onDragEnd, setDragOffset],
    );

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerUp?.(event);
      endDrag(event);
    };

    const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerCancel?.(event);
      endDrag(event);
    };

    const dragTransform = isEnabled
      ? "translate3d(var(--jt-drag-x, 0px), var(--jt-drag-y, 0px), 0)"
      : undefined;

    const baseTransform =
      typeof style?.transform === "string" ? style.transform : undefined;

    const combinedTransform = [baseTransform, dragTransform]
      .filter(Boolean)
      .join(" ");

    const transitions: string[] = [];

    if (style?.transition) {
      transitions.push(String(style.transition));
    }

    if (snappingBack) {
      transitions.push(
        `transform ${SNAP_DURATION}ms var(--ds-transition-easing)`,
      );
    }

    const mergedStyle: React.CSSProperties = {
      ...style,
      ...(dragging ? whileDrag : undefined),
      ...(combinedTransform ? { transform: combinedTransform } : undefined),
      ...(transitions.length > 0
        ? { transition: transitions.join(", ") }
        : undefined),
      ...(isEnabled ? { touchAction: "none" } : undefined),
    };

    return (
      <div
        {...rest}
        ref={setRefs}
        style={mergedStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />
    );
  },
);
