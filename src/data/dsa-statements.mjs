/**
 * Problem statements for DSA solutions, keyed by the solution's exact `problem`
 * string. Kept apart from the solution code so each file stays readable.
 *
 * Shape: { text, ex?: [{ in, out, why? }] }
 *   text — what you are given and what to return; blank line = new paragraph.
 *   ex   — worked examples. `in` / `out` are shown as code.
 */
import { part1 } from './statements/part1.mjs';
import { part2 } from './statements/part2.mjs';
import { part3 } from './statements/part3.mjs';
import { part4 } from './statements/part4.mjs';

/** @type {Record<string, { text: string, ex?: { in: string, out: string, why?: string }[] }>} */
export const statements = { ...part1, ...part2, ...part3, ...part4 };
