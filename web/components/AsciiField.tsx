"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A text run used as the rasterizer: the glyph is the mark, not the pixel.
 * Lifted in architecture from the typographic-shader prototype (BRO-2186) and
 * deliberately NOT in idiom -- that prototype's palette and 6px lattice were
 * measured off the Claude FM stream and are that stream's optical signature.
 * Halftone and ASCII rasterisation are century-old and decades-old prior art
 * respectively; the look is not. So this runs the generic technique on
 * Parallax's own tokens.
 *
 * The one part worth keeping exactly: the ramp is MEASURED, not assumed. Each
 * candidate glyph is drawn to a scratch canvas and its ink coverage summed, so
 * the ordering is a property of the font actually resolved on the reader's
 * machine rather than a guess baked in at authoring time. A ramp written by
 * hand is wrong the moment the font falls back.
 *
 * This is the cheap monospace-lattice variant. The proportional-type version
 * needs a per-row layout solve, which is the whole difficulty of the original
 * and buys nothing at this size.
 */

const RAMP_CHARS = " .,:;-~+=*oOxX#%@&8BM";

/** Ink coverage of one glyph in [0,1], measured by rendering it. */
function coverage(ch: string, font: string, ctx: CanvasRenderingContext2D): number {
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(ch, 16, 16);
  const d = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 3; i < d.length; i += 4) sum += d[i];
  return sum / (32 * 32 * 255);
}

export function AsciiField({ src, alt, cols = 150 }: { src: string; alt: string; cols?: number }) {
  const [rows, setRows] = useState<string[]>([]);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const scratch = document.createElement("canvas");
      scratch.width = 32;
      scratch.height = 32;
      const sctx = scratch.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;

      // Measure the ramp against the font that actually resolved, then sort by
      // coverage. Normalising to the densest glyph keeps the mapping linear in
      // perceived ink regardless of which face won the fallback chain.
      const font = `24px ${getComputedStyle(document.body).getPropertyValue("--mono") || "monospace"}`;
      const ramp = RAMP_CHARS.split("").map((ch) => ({
        ch,
        cov: ch === " " ? 0 : coverage(ch, font, sctx),
      }));
      const max = Math.max(...ramp.map((e) => e.cov)) || 1;
      for (const e of ramp) e.cov /= max;
      ramp.sort((a, b) => a.cov - b.cov);

      const img = new Image();
      img.decoding = "async";
      img.src = src;
      try {
        await img.decode();
      } catch {
        return; // no image, no field; the caption still carries the point
      }
      if (cancelled) return;

      // A monospace cell is about twice as tall as it is wide, so the row count
      // has to divide by that or the picture comes out stretched vertically.
      const cellAspect = 2.05;
      const rowCount = Math.max(1, Math.round((cols * img.height) / img.width / cellAspect));

      const c = document.createElement("canvas");
      c.width = cols;
      c.height = rowCount;
      const cctx = c.getContext("2d", { willReadFrequently: true });
      if (!cctx) return;
      cctx.drawImage(img, 0, 0, cols, rowCount);
      const px = cctx.getImageData(0, 0, cols, rowCount).data;

      const out: string[] = [];
      for (let y = 0; y < rowCount; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          // Rec. 709 luma. The footage is dark, so a plain average would crush
          // the whole frame into the bottom three glyphs.
          const l = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
          let lo = 0;
          let hi = ramp.length - 1;
          while (lo < hi) {
            const m = (lo + hi) >> 1;
            if (ramp[m].cov < l) lo = m + 1;
            else hi = m;
          }
          line += ramp[lo].ch;
        }
        out.push(line);
      }
      if (!cancelled) setRows(out);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [src, cols]);

  return (
    <div className="ascii" ref={host}>
      <pre aria-hidden="true">{rows.join("\n")}</pre>
      <p className="vh">{alt}</p>
    </div>
  );
}
