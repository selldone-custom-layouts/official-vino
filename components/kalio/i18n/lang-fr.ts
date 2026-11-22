/* The Layout in fr: every base word (vino-base.fr.ts, translated from the effective English) and Vino's own words, with the skin's fr words on top; one chunk. */
import base from "./vino-base.fr";
import own from "./vino.fr";
import { withSkinWords } from "../../ly/ly-words";

export default withSkinWords({ ...base, ...own }, "fr") as Record<string, string>;
