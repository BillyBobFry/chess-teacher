/** Chess moves in running text, e.g. "Nd2", "11...Nh5", "12. Bc7", "exd4", "O-O", "e8=Q+". */
const MOVE =
  /(\d+\.(?:\.\.)?\s?)?(O-O(?:-O)?|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h]x[a-h][1-8]|[a-h][1-8])(=[QRBN])?[+#]?/g;

export type Segment = { text: string; move: boolean };

/** Split text into plain segments and chess moves (whole tokens only). */
export function splitMoves(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(MOVE)) {
    const i = m.index;
    const before = text[i - 1];
    const after = text[i + m[0].length];
    if ((before && /[A-Za-z0-9]/.test(before)) || (after && /[A-Za-z0-9]/.test(after))) continue;
    if (i > last) out.push({ text: text.slice(last, i), move: false });
    out.push({ text: m[0], move: true });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), move: false });
  return out;
}
