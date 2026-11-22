/* The Layout in de: every base word (vino-base.de.ts, translated from the effective English) and Vino's own words, with the skin's de words on top; one chunk. */
import base from "./vino-base.de";
import own from "./vino.de";
import { withSkinWords } from "../../ly/ly-words";

export default withSkinWords({ ...base, ...own }, "de") as Record<string, string>;
