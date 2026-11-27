import { ChevronUp } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { Button } from "react-aria-components";
import { pressable } from "./Button.tsx";

/** How far a swipe on the handle travels before it counts as one rather than a tap. */
const SWIPE_PX = 16;

/**
 * A panel beside the main content. Where there's room (the `wide` variant) it's a full-height
 * sidebar. Otherwise it's a drawer along the bottom that fills the space it's given and, when
 * expanded, grows upwards over the content to fit what it holds, up to a height that always
 * leaves some of the content showing. Past that, it scrolls.
 *
 * Its parent must be a size container (`container-type: size`): the drawer's maximum height is
 * measured from it.
 */
export function Drawer({
  label,
  expanded,
  onExpandedChange,
  className,
  children,
}: {
  /** What the panel holds, for its landmark and its handle ("Moves"). */
  label: string;
  /** Controlled: the caller expands it for news that needs the room and collapses it for play. */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** Placement only: the space the drawer fills, or the sidebar's width. */
  className?: string;
  children: ReactNode;
}) {
  const bodyId = useId();
  // A swipe on the handle sets the state from its direction. If it ends on the handle, React
  // Aria still reports a press, which must not toggle it straight back.
  const swiped = useRef(false);

  return (
    <div className={`relative ${className ?? ""}`}>
      <aside
        aria-label={label}
        data-expanded={expanded || undefined}
        className={[
          "absolute inset-x-0 bottom-0 flex h-full flex-col",
          "rounded-t-panel border-t border-border bg-surface shadow-drawer",
          // Fits its content, from its own space up to all but the top of the content behind.
          "data-expanded:z-10 data-expanded:h-auto data-expanded:max-h-[calc(100cqb_-_10rem)] data-expanded:min-h-full",
          "wide:static wide:h-full wide:max-h-none wide:rounded-none wide:border-t-0 wide:border-s wide:shadow-none",
        ].join(" ")}
      >
        {/* Swiping here must not scroll the page or pull to refresh. */}
        <div
          className="shrink-0 touch-none wide:hidden"
          onPointerDownCapture={(e) => {
            const start = e.clientY;
            swiped.current = false;
            // A swipe ends wherever the finger leaves the screen, usually off the handle.
            window.addEventListener(
              "pointerup",
              (up) => {
                const dy = up.clientY - start;
                if (Math.abs(dy) < SWIPE_PX) return;
                swiped.current = true;
                onExpandedChange(dy < 0);
                // Any press comes in this same event; after it, presses count again (keyboard).
                setTimeout(() => (swiped.current = false));
              },
              { once: true },
            );
          }}
        >
          <Button
            aria-label={label}
            aria-expanded={expanded}
            aria-controls={bodyId}
            onPress={() => {
              if (swiped.current) swiped.current = false;
              else onExpandedChange(!expanded);
            }}
            className={[
              "flex h-11 w-full items-center justify-center rounded-t-panel border-0 bg-transparent text-fg-muted",
              ...pressable,
              "data-hovered:text-fg data-pressed:text-fg data-focus-visible:-outline-offset-2",
            ].join(" ")}
          >
            <ChevronUp
              aria-hidden
              className={[
                "size-5 transition-transform duration-150 ease-settle motion-reduce:transition-none",
                expanded ? "rotate-180" : "",
              ].join(" ")}
            />
          </Button>
        </div>
        {/* A flex column, so content that scrolls a part of itself (a list) can fill it.
            Positioned, so absolutely placed content (screen-reader text) scrolls inside it
            rather than stretching the page. */}
        <div
          id={bodyId}
          className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] wide:pt-4"
        >
          {children}
        </div>
      </aside>
    </div>
  );
}
