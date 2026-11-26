import { ParaglideMessage } from "@inlang/paraglide-js-react";
import type { ReactNode } from "react";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";

// Names and SPDX identifiers: the same in every language.
const COMPONENTS = [
  { component: "chess.js", licence: "BSD-2-Clause", note: null },
  { component: "ONNX Runtime Web", licence: "MIT", note: null },
  { component: "react-chessboard", licence: "MIT", note: m.licences_item_pieces },
  { component: "React", licence: "MIT", note: null },
];

const external = (href: string) =>
  function ExternalLink({ children }: { children?: ReactNode }) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  };

/** Third-party licences. Stockfish (GPL-3.0) and Maia-3 (AGPL-3.0) are distributed to the
 * browser, so their licences and links to their source must be available to every user. */
export function Licences({ onBack }: { onBack: () => void }) {
  const base = import.meta.env.BASE_URL;
  return (
    <section className="licences">
      <h1>{m.licences_title()}</h1>
      <h2>{m.licences_stockfish_heading()}</h2>
      <p>
        <ParaglideMessage
          message={m.licences_stockfish}
          inputs={{}}
          markup={{
            gpl: external(`${base}stockfish/COPYING.txt`),
            stockfish: external("https://github.com/official-stockfish/Stockfish"),
            stockfishjs: external("https://github.com/nmrugg/stockfish.js"),
            licence11: external(`${base}stockfish11/COPYING.txt`),
          }}
        />
      </p>
      <h2>{m.licences_maia_heading()}</h2>
      <p>
        <ParaglideMessage
          message={m.licences_maia}
          inputs={{}}
          markup={{
            agpl: external("https://www.gnu.org/licenses/agpl-3.0.html"),
            maia: external("https://github.com/CSSLab/maia3"),
            weights: external("https://huggingface.co/UofTCSSLab/Maia3-5M"),
            model: external("https://github.com/BillyBobFry/chess-teacher/releases/tag/maia3-5m-int8-v1"),
          }}
        />
      </p>
      <h2>{m.licences_other()}</h2>
      <ul>
        {COMPONENTS.map(({ component, licence, note }) => (
          <li key={component}>{(note ?? m.licences_item)({ component, licence })}</li>
        ))}
      </ul>
      <Button onPress={onBack}>{m.back()}</Button>
    </section>
  );
}
