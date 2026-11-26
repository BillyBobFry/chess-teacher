import type { ReactNode } from "react";
import { Drawer } from "../ui/Drawer.tsx";

/**
 * A game screen: the board as large as fits, and the panel beside it (a sidebar) or under it
 * (a drawer that fills the rest of the screen and expands over the board). The page itself
 * never scrolls; the panel does. Fills the height it's given, so its `Shell` is a game one.
 */
export function GameLayout({
  board,
  panel,
  panelLabel,
  expanded,
  onExpandedChange,
}: {
  /** The board, with the status line above it and anything that belongs under it. */
  board: ReactNode;
  panel: ReactNode;
  panelLabel: string;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) {
  return (
    // A size container: the board and the drawer measure the screen from it. `--peek` is the
    // least the collapsed drawer shows: its handle, a heading row and a couple of moves.
    <main className="flex min-h-0 flex-1 flex-col [--peek:11rem] [container-type:size] wide:flex-row">
      {/* Using the board means playing: put the drawer away so all of it shows (UX-105). */}
      <div
        className="flex shrink-0 justify-center px-4 pt-3 pb-2 wide:min-w-0 wide:flex-1 wide:items-[safe_center] wide:overflow-y-auto wide:p-6 wide:[container-type:size]"
        onPointerDown={() => onExpandedChange(false)}
      >
        {/* As wide as the space allows, and short enough to leave the status line and the
            drawer's least room below it. */}
        <div className="flex w-[min(100cqi_-_2rem,100cqb_-_var(--peek)_-_3.5rem)] flex-col gap-2 wide:w-[min(100cqi,100cqb_-_2.5rem,48rem)]">
          {board}
        </div>
      </div>
      <Drawer
        label={panelLabel}
        expanded={expanded}
        onExpandedChange={onExpandedChange}
        className="min-h-(--peek) flex-1 wide:w-80 wide:flex-none wide:lg:w-100"
      >
        {panel}
      </Drawer>
    </main>
  );
}
