import type { PrincipleKind } from "@chess-teacher/contract";
import { isConceptId, isPrincipleId } from "@chess-teacher/core";
import { useSyncExternalStore } from "react";

/**
 * Each page of the app has its own URL under Vite's base (`/app/`), so a refresh stays on the
 * page and the browser's back and forward buttons move between pages. A thin layer over the
 * History API: the app has a handful of flat routes and no nested layouts.
 */
export type Route =
  | { page: "play" }
  | { page: "games" }
  /** A finished game's review; with `lesson`, that lesson starts open. */
  | { page: "pastGame"; id: string; lesson?: number }
  | { page: "progress" }
  /** One principle or concept from the progress page, and the lessons behind it. */
  | { page: "principle"; kind: PrincipleKind; id: string }
  | { page: "licences" };

/** The base without its trailing slash: "/app", or "" when served from the root. */
const base = () => import.meta.env.BASE_URL.replace(/\/$/, "");

/** The path of a route, ready for an `href` or `history.pushState`. */
export function hrefOf(route: Route): string {
  switch (route.page) {
    case "play":
      return `${base()}/`;
    case "games":
      return `${base()}/games`;
    case "pastGame": {
      const game = `${base()}/games/${encodeURIComponent(route.id)}`;
      return route.lesson === undefined ? game : `${game}/lessons/${route.lesson}`;
    }
    case "progress":
      return `${base()}/progress`;
    case "principle":
      return `${base()}/progress/${route.kind}/${encodeURIComponent(route.id)}`;
    case "licences":
      return `${base()}/licences`;
  }
}

/** The route a path shows, or null when it isn't one of ours. A trailing slash doesn't matter. */
export function routeOf(pathname: string): Route | null {
  const prefix = base();
  if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return null;
  const parts = pathname.slice(prefix.length).split("/").filter(Boolean);
  if (parts.length === 0) return { page: "play" };
  if (parts.length === 1) {
    if (parts[0] === "games") return { page: "games" };
    if (parts[0] === "progress") return { page: "progress" };
    if (parts[0] === "licences") return { page: "licences" };
  }
  try {
    if (parts.length === 2 && parts[0] === "games" && parts[1]) {
      return { page: "pastGame", id: decodeURIComponent(parts[1]) };
    }
    if (
      parts.length === 4 &&
      parts[0] === "games" &&
      parts[1] &&
      parts[2] === "lessons" &&
      /^\d+$/.test(parts[3] ?? "")
    ) {
      return { page: "pastGame", id: decodeURIComponent(parts[1]), lesson: Number(parts[3]) };
    }
    if (parts.length === 3 && parts[0] === "progress" && parts[2]) {
      // Only ids this version of the core knows: anything else isn't a page.
      const id = decodeURIComponent(parts[2]);
      if (parts[1] === "principle" && isPrincipleId(id)) return { page: "principle", kind: "principle", id };
      if (parts[1] === "concept" && isConceptId(id)) return { page: "principle", kind: "concept", id };
    }
  } catch {
    // A malformed escape, from a hand-edited URL.
  }
  return null;
}

// Each history entry the app makes records the path it came from, so a Back button knows
// whether the browser's Back stays in the app and where it leads. A refresh keeps it; an entry
// the app didn't make (a deep link, a link from the landing page) has none.
type EntryState = { previous: string | null };
const previousOf = (state: unknown): string | null =>
  typeof state === "object" && state !== null && "previous" in state && typeof state.previous === "string"
    ? state.previous
    : null;

// pushState fires no event of its own, so navigateTo() announces the change itself.
const CHANGE = "app:navigate";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

/** The current path; re-renders on every navigation, in-app or from the browser's buttons. */
export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

/**
 * The route the current page was reached from in the app, or null after a deep link or a link
 * from outside. Re-renders on every navigation, like `usePathname`.
 */
export function usePreviousRoute(): Route | null {
  const previous = useSyncExternalStore(subscribe, () => previousOf(window.history.state));
  return previous === null ? null : routeOf(previous);
}

/**
 * Goes to a path in a new history entry, or replaces the current one. For React Aria's
 * `RouterProvider`, which hands over the `href` of a link, and for code that navigates.
 */
export function navigateTo(href: string, { replace = false }: { replace?: boolean } = {}) {
  if (replace) {
    const state: EntryState = { previous: previousOf(window.history.state) };
    window.history.replaceState(state, "", href);
  } else {
    const state: EntryState = { previous: window.location.pathname };
    window.history.pushState(state, "", href);
    // A new page starts at its top; Back and Forward restore where the player was.
    window.scrollTo(0, 0);
  }
  window.dispatchEvent(new Event(CHANGE));
}

export function navigate(route: Route, options?: { replace?: boolean }) {
  navigateTo(hrefOf(route), options);
}

/**
 * A page's Back button: the browser's Back when the page before is one of the app's, so
 * history doesn't grow; otherwise (a deep link or a link from outside) the given page.
 */
export function goBack(fallback: Route) {
  if (previousOf(window.history.state) !== null) window.history.back();
  else navigate(fallback);
}

/**
 * A Back button that names its page ("Back to your games"): the browser's Back when that page
 * is the one before, so going there and back doesn't pile up entries; otherwise, a new entry.
 */
export function goBackTo(route: Route) {
  if (previousOf(window.history.state) === hrefOf(route)) window.history.back();
  else navigate(route);
}
