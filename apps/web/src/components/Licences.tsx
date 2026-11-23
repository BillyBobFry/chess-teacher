/** Third-party licences. Stockfish is GPL-3.0 and is distributed to the browser, so its
 * licence and a link to its source must be available to every user. */
export function Licences({ onBack }: { onBack: () => void }) {
  const base = import.meta.env.BASE_URL;
  return (
    <section className="licences">
      <h1>Licences</h1>
      <h2>Stockfish</h2>
      <p>
        The chess engine running in your browser is Stockfish 19 (the WebAssembly build by the stockfish.js
        project), licensed under the{" "}
        <a href={`${base}stockfish/COPYING.txt`} target="_blank" rel="noreferrer">
          GNU General Public License v3
        </a>
        . Source code:{" "}
        <a href="https://github.com/official-stockfish/Stockfish" target="_blank" rel="noreferrer">
          Stockfish
        </a>{" "}
        and{" "}
        <a href="https://github.com/nmrugg/stockfish.js" target="_blank" rel="noreferrer">
          stockfish.js
        </a>
        . This app talks to the engine only through the UCI text protocol.
      </p>
      <h2>Other components</h2>
      <ul>
        <li>chess.js: BSD-2-Clause</li>
        <li>react-chessboard (including its piece set): MIT</li>
        <li>React: MIT</li>
      </ul>
      <button onClick={onBack}>Back</button>
    </section>
  );
}
