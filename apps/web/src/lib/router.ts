import { useSyncExternalStore } from "react";

/**
 * Each page of the app has its own URL under Vite's base (`/app/`), so a refresh stays on the
 * page and the browser's back and forward buttons move between pages. A thin layer over the
 * History API: the app has a handful of flat routes and no nested layouts.
 */
export type Route =
  | { page: "play" }
  | { page: "games" }
  | { page: "pastGame"; id: string }
  | { page: "progress" }
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
    case "pastGame":
      return `${base()}/games/${encodeURIComponent(route.id)}`;
    case "progress":
      return `${base()}/progress`;
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
  if (parts.length === 2 && parts[0] === "games" && parts[1]) {
    try {
      return { page: "pastGame", id: decodeURIComponent(parts[1]) };
    } catch {
      return null; // A malformed escape, from a hand-edited URL.
    }
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
