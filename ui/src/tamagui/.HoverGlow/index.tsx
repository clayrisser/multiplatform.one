import React from 'react';
import { throttle as throttleFn } from '@github/mini-throttle';
import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'tamagui';

import { getBoundingClientRectAsync } from 'ui/src/lib/getBoundingClientRectAsync';

interface BoundedCursorProps {
  size?: number;
  width?: number;
  height?: number;
  resist?: number;
  boundPct?: number | null;
  color?: string;
  inverse?: boolean;
  full?: boolean;
  throttle?: number;
  scale?: number;
  initialOffset?: { x?: number; y?: number };
  offset?: { x?: number; y?: number };
  limitToParentSize?: boolean;
  debug?: boolean;
  disableUpdates?: boolean;
}

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

type HoverGlowProps = BoundedCursorProps & {
  background?: string;
  opacity?: number;
  borderRadius?: number;
  blurPct?: number;
  strategy?: 'blur' | 'radial-gradient';
  glowProps?: DivProps;
  style?: DivProps['style'];
  restingStyle?: DivProps['style'];
};

export function useHoverGlow(props: HoverGlowProps) {
  const {
    color = 'red',
    background = 'transparent',
    opacity = 0.025,
    borderRadius = 1000,
    blurPct = 20,
    strategy = 'radial-gradient',
    glowProps,
    style,
    full,
    scale,
    size,
    restingStyle,
  } = props;
  const elementRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef('');
  const { setParentNode, getGlowBounds, getBounds, parentNode, recalculate } = useRelativePositionedItem(
    {
      ...props,
      itemRef: elementRef,
    },
    ({ transform, position, isResting }) => {
      if (transform === transformRef.current) return;

      if (process.env.NODE_ENV === 'development' && props.debug) {
        if (parentNode) {
          if (!parentNode['originalBorderStyle']) {
            parentNode['originalBorderStyle'] = parentNode.style.border || 'none';
          }
          Object.assign(parentNode.style, {
            border: '1px solid red',
          });
        }
        const consoleNode = elementRef.current?.parentNode?.querySelector('.hoverglow-debug');
        if (consoleNode) {
          const parentBounds = getBounds();
          if (!parentBounds) return;
          const xPct = Math.round(parentBounds.width / position.x);
          const yPct = Math.round(parentBounds.height / position.y);
          consoleNode.textContent = `x: ${position.x.toString().padEnd(5)} (${xPct}%)
y: ${position.y.toString().padEnd(5)} (${yPct}%)
parent:
width: ${parentBounds.width}
height: ${parentBounds.height}`;
        }
      }
      transformRef.current = transform;
      Object.assign(elementRef.current?.style || {}, getStyle(transform, isResting));
    },
  );

  if (process.env.NODE_ENV === 'development') {
    // unset border on debug off
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!props.debug) {
        if (!parentNode) return;
        Object.assign(parentNode.style, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          border: parentNode['originalBorderStyle'],
        });
      }
    }, [parentNode, props.debug]);
  }

  // be sure to update style when restingStyle updates
  useIsomorphicLayoutEffect(() => {
    recalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(restingStyle)]);

  const getStyle = (transform: string, isResting = true): CSSProperties => {
    const bounds = getGlowBounds();
    // estimate size close to final measured size
    const fullSize = full ? `calc(100 * ${scale || 1})%` : 0;
    const width = bounds.width || size || fullSize;
    const height = bounds.height || size || fullSize;
    const restingStyleNow = isResting && restingStyle ? restingStyle : {};
    return {
      position: 'absolute',
      top: '0px',
      left: '0px',
      pointerEvents: 'none',
      opacity: transform ? opacity : 0,
      ...(strategy === 'radial-gradient' && {
        background: `radial-gradient(${color} ${0 + (20 - blurPct)}%, ${background} 70%)`,
      }),
      ...(strategy === 'blur' && {
        background: color,
        filter: `blur(${blurPct}px)`,
      }),
      borderRadius,
      height: `${height}px`,
      width: `${width}px`,
      // nice fade in effect after first measure/show
      transition: transform ? 'transform linear 100ms, opacity ease-in 300ms' : 'opacity ease-in 300ms',
      ...restingStyleNow,
      transform: restingStyleNow.transform ? `${transform} ${restingStyleNow.transform}` : transform,
      ...(props.debug && {
        background: 'yellow',
        opacity: 0.8,
        filter: 'none',
      }),
      ...style,
    };
  };

  const parentRef = (ref?: HTMLElement | null) => setParentNode(ref || undefined);

  const element = (
    <div className="hoverglow" {...glowProps} ref={elementRef} style={getStyle(transformRef.current)}>
      {props.debug ? crosshair : null}
    </div>
  );

  if (process.env.NODE_ENV === 'development' && props.debug) {
    return {
      parentRef,
      element: (
        <>
          {element}
          {crosshair}
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              bottom: 0,
              left: 0,
              zIndex: 100_000,
              top: 0,
              right: 0,
              border: '1px solid grey',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: -25,
                right: 0,
                color: 'grey',
              }}
            >
              glow container
            </div>
          </div>
        </>
      ),
    };
  }

  return {
    parentRef,
    element,
  };
}

function findRelativePositionedParent(node?: HTMLElement | null) {
  let parent = node?.parentElement;
  while (parent) {
    if (getComputedStyle(parent).position) {
      return parent;
    }
    parent = parent.parentElement;
  }
}

export const useRelativePositionedItem = (
  props: BoundedCursorProps & {
    itemRef?: { current?: HTMLElement | null };
  },
  onPositionChange?: (props: { position: { x: number; y: number }; transform: string; isResting: boolean }) => void,
) => {
  const {
    limitToParentSize,
    width: propWidth = 100,
    height: propHeight = 100,
    resist = 0,
    boundPct = null,
    size,
    scale = 1,
    offset = { x: 0, y: 0 },
    initialOffset = { x: 0, y: 0 },
    full,
    inverse,
    debug,
    throttle = 16,
    disableUpdates,
  } = props;
  const [parentNode, setParentNode] = useState<HTMLElement>();
  const state = useRef({
    tracking: false,
    currentPosition: { x: 0, y: 0 },
  });
  const relativeToParentNode = findRelativePositionedParent(props.itemRef?.current);
  const getRelativeToParentBounds = useGetBounds(relativeToParentNode);
  const getParentBounds = useGetBounds(parentNode, () => {
    setInitialPosition();
  });
  const offX = initialOffset.x || 0;
  const offY = initialOffset.y || 0;

  const getGlowBounds = useCallback(() => {
    const bounds = getParentBounds();
    if (!bounds) {
      return { width: 0, height: 0 };
    }

    const width = Math.min(
      limitToParentSize ? bounds.width : Infinity,
      scale * (full ? bounds.width : size || propWidth),
    );
    const height = Math.min(
      limitToParentSize ? bounds.height : Infinity,
      scale * (full ? bounds.height : size || propHeight),
    );
    return {
      width,
      height,
    };
  }, [limitToParentSize, full, getParentBounds, propHeight, propWidth, scale, size]);

  const callback = useCallback(
    (position: { x: number; y: number } = state.current.currentPosition) => {
      if (!onPositionChange) return;
      if (disableUpdates) return;
      state.current.currentPosition = position;
      const { width, height } = getGlowBounds();
      const bounds = getParentBounds();
      const containerBounds = getRelativeToParentBounds();
      if (!bounds || !containerBounds) return;
      const doInverse = inversed.bind(null, inverse);
      const doResist = resisted.bind(null, resist);
      const doBound = bounded.bind(null, boundPct);

      const [misfitX, misfitY] = [bounds.left - containerBounds.left, bounds.top - containerBounds.top];

      let x = position.x;
      x = doResist(bounds.width, x);
      x = doBound(bounds.width, width, x);
      x = doInverse(bounds.width, x);
      const halfW = width / 2;
      x = x - halfW + misfitX;
      x = x + (offset.x || 0);

      let y = position.y;
      y = doResist(bounds.height, y);
      y = doBound(bounds.height, height, y);
      y = doInverse(bounds.height, y);
      const halfH = height / 2;
      y = y - halfH + misfitY;
      y = y + (offset.y || 0);

      if (process.env.NODE_ENV === 'development' && debug) {
        // eslint-disable-next-line no-console
        console.table({
          start: {
            x: position.x,
            y: position.y,
            position: [position.x, position.y].map((val) => Math.round(val)).join(', '),
            bounds: [bounds.width, bounds.height].map((val) => Math.round(val)).join(', '),
            glowDimensions: [width, height].join(', '),
          },
          resisted: {
            x: doResist(bounds.width, position.x),
            y: doResist(bounds.height, position.y),
          },
          bounded: {
            x: doInverse(bounds.width, doResist(bounds.width, position.x)),
            y: doInverse(bounds.height, doResist(bounds.width, position.y)),
          },
          inversed: {
            x: doInverse(bounds.width, doInverse(bounds.width, doResist(bounds.width, position.x))),
            y: doInverse(bounds.height, doInverse(bounds.height, doResist(bounds.width, position.y))),
          },
          final: {
            x,
            y,
          },
        });
      }

      onPositionChange({
        isResting: !state.current.tracking,
        position: {
          x,
          y,
        },
        transform: `
        translateX(${x}px)
        translateY(${y}px)
        translateZ(0px)
      `,
      });
    },
    [
      onPositionChange,
      disableUpdates,
      getGlowBounds,
      getParentBounds,
      getRelativeToParentBounds,
      inverse,
      resist,
      boundPct,
      offset.x,
      offset.y,
      debug,
    ],
  );

  const setInitialPosition = useCallback(() => {
    const bounds = getParentBounds();
    if (!bounds) return;
    callback({
      x: bounds.width / 2 + offX,
      y: bounds.height / 2 + offY,
    });
  }, [getParentBounds, callback, offX, offY]);

  useIsomorphicLayoutEffect(() => {
    setInitialPosition();
  }, [setInitialPosition]);

  useIsomorphicLayoutEffect(() => {
    if (!parentNode) return;

    const disposers = new Set<() => void>();

    // force re-calc offsets after scrolls
    const resetLastDimensions = () => {
      lastDimensions.set(parentNode, null);
    };
    const topWindow = window.top ?? window;
    addEvent(disposers, topWindow, 'scroll', resetLastDimensions);
    addEvent(disposers, topWindow, 'resize', resetLastDimensions);
    addEvent(disposers, topWindow, 'mouseup', resetLastDimensions);

    const handleMove = async (e: MouseEvent) => {
      if (!state.current.tracking) return;
      const [x, y] = await getOffset(e, parentNode);
      callback({
        x: x + offX,
        y: y + offY,
      });
    };

    const trackMouse = (val: boolean) => () => {
      state.current.tracking = val;
      if (!val) {
        // reset to center on mouseleave
        setInitialPosition();
      }
    };

    addEvent(disposers, parentNode, 'mouseenter', trackMouse(true));
    addEvent(disposers, parentNode, 'mousemove', handleMove);
    addEvent(disposers, parentNode, 'mouseleave', trackMouse(false));

    return () => {
      disposers.forEach((d) => d());
    };
  }, [debug, callback, offX, offY, parentNode, throttle, setInitialPosition]);

  return {
    recalculate: callback,
    getBounds: getParentBounds,
    getGlowBounds,
    setParentNode,
    parentNode,
  };
};

// resists being moved (towards center)
const resisted = (resist: number | undefined, parentSize: number, coord: number) => {
  if (!resist) return coord;
  const resistAmt = 1 - resist / 100;
  return coord * resistAmt + parentSize / ((100 / resist) * 2);
};

// bounds it within box x% size of parent
const bounded = (boundPct: number | undefined | null, parentSize: number, childSize: number, coord: number) => {
  if (boundPct === undefined || boundPct === null || boundPct > 100) return coord;
  const difference = parentSize - childSize;
  const direction = coord / Math.abs(coord);
  const max = (difference * (boundPct / 100)) / 2;
  const cur = Math.abs(coord);
  return Math.min(max, cur) * direction;
};

const inversed = (inverse: boolean | undefined, parentSize: number, coord: number) => {
  if (!inverse) return coord;
  return parentSize - coord;
};

const lastDimensions = new WeakMap<HTMLElement, DOMRect | null>();

const getOffset = async (ev: MouseEvent, parentElement?: HTMLElement) => {
  const parent = (parentElement || ev.currentTarget) as HTMLElement;
  const canMeasure = 'getBoundingClientRect' in parent;
  if (!canMeasure) return [0, 0];
  const clientX = ev.clientX || 0;
  const clientY = ev.clientY || 0;
  let parentDimensions = lastDimensions.get(parent);
  if (!parentDimensions) {
    parentDimensions = await getBoundingClientRectAsync(parent);
    if (!parentDimensions) return [0, 0];
    lastDimensions.set(parent, parentDimensions);
  }
  const xOffset = clientX - parentDimensions.left;
  const yOffset = clientY - parentDimensions.top;
  return [xOffset, yOffset] as const;
};

const useGetBounds = (node?: HTMLElement | null, onDidUpdate?: (props: { width: number; height: number }) => void) => {
  const state = useRef<DOMRect>();

  useIsomorphicLayoutEffect(() => {
    if (!node) {
      return;
    }

    function update(rect: DOMRect) {
      state.current = rect;
      onDidUpdate?.(state.current);
    }

    getBoundingClientRectAsync(node).then((rect) => rect && update(rect));

    const ro = new ResizeObserver(
      throttleFn(([entry]) => {
        if (!entry) return;
        update(node.getBoundingClientRect());
      }, 40),
    );

    ro.observe(node);

    return () => {
      ro.disconnect();
    };
    // onDidUpdate is event callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  return useCallback(() => state.current, []);
};

const addEvent = <K extends keyof HTMLElementEventMap>(
  disposers: Set<() => void>,
  n: HTMLElement | Window,
  type: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: any,
  options?: boolean | AddEventListenerOptions | undefined,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  n.addEventListener(type, listener, options);
  disposers.add(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    n.removeEventListener(type, listener);
  });
};

const crosshair =
  process.env.NODE_ENV === 'development' ? (
    <YStack
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 100_000,
      }}
    >
      <div
        style={{
          width: 1,
          height: 50,
          background: 'red',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translateX(-0.5px) translateY(-25px)`,
        }}
      />
      <YStack
        style={{
          width: 50,
          height: 1,
          background: 'red',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translateY(-0.5px) translateX(-25px)`,
        }}
      />
    </YStack>
  ) : null;
