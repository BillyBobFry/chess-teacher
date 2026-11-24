import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Every locale in project.inlang/settings.json must translate every message, with the same
// placeholders, so a missing or broken translation fails CI rather than falling back silently.
const read = (path: string): unknown =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

const settings = read("project.inlang/settings.json") as { baseLocale: string; locales: string[] };

const catalogue = (locale: string) =>
  Object.fromEntries(
    Object.entries(read(`messages/${locale}.json`) as Record<string, unknown>).filter(
      ([key]) => key !== "$schema",
    ),
  );

/** {name} placeholders and declared inputs, from a plain message or a variant message. */
const placeholders = (message: unknown) => {
  const text = JSON.stringify(message);
  const names = [...text.matchAll(/\{(\w+)\}|input (\w+)/g)].map((match) => match[1] ?? match[2]);
  return [...new Set(names)].sort();
};

const base = catalogue(settings.baseLocale);

describe.each(settings.locales.filter((locale) => locale !== settings.baseLocale))(
  "messages/%s.json",
  (locale) => {
    const messages = catalogue(locale);

    it(`has exactly the keys of messages/${settings.baseLocale}.json`, () => {
      expect(Object.keys(messages).sort()).toEqual(Object.keys(base).sort());
    });

    it(`uses every placeholder of messages/${settings.baseLocale}.json`, () => {
      for (const [key, message] of Object.entries(base)) {
        expect(placeholders(messages[key]), key).toEqual(expect.arrayContaining(placeholders(message)));
      }
    });
  },
);

describe(`messages/${settings.baseLocale}.json`, () => {
  // UX-31: house style for English copy.
  it("has no em dashes or emoji", () => {
    for (const [key, message] of Object.entries(base)) {
      expect(JSON.stringify(message), key).not.toMatch(/—|\p{Extended_Pictographic}/u);
    }
  });
});
