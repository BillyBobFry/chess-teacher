import { describe, expect, it } from "vitest";
import { hrefOf, routeOf, type Route } from "../src/lib/router.ts";

describe("routes", () => {
  const routes: Route[] = [
    { page: "play" },
    { page: "games" },
    { page: "pastGame", id: "3f2c9a10-7d4e-4b8a-9c1e-2a6f5b8d0e47" },
    { page: "pastGame", id: "a/b c" },
    { page: "pastGame", id: "3f2c9a10-7d4e-4b8a-9c1e-2a6f5b8d0e47", lesson: 12 },
    { page: "progress" },
    { page: "principle", source: "features", id: "hanging" },
    { page: "principle", source: "diagnosis", id: "lost_time" },
    { page: "licences" },
  ];

  it.each(routes)("a link to $page leads back to the same page", (route) => {
    expect(routeOf(hrefOf(route))).toEqual(route);
  });

  it("ignores a trailing slash", () => {
    expect(routeOf(`${hrefOf({ page: "games" })}/`)).toEqual({ page: "games" });
  });

  it.each([
    "/nowhere",
    "/games/1/2",
    "/games/1/lessons/x",
    "/progress/x",
    "/progress/principle/not-a-principle",
    "/progress/concept/hanging",
    "/games/%E0%A4%A",
  ])("%s is not a page", (path) => {
    expect(routeOf(path)).toBeNull();
  });
});
