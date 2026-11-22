/* The Layout in es: every base word (vino-base.es.ts, translated from the effective English) and Vino's own words, with the skin's es words on top; one chunk. */
import base from "./vino-base.es";
import own from "./vino.es";
import { withSkinWords } from "../../ly/ly-words";

export default withSkinWords({ ...base, ...own }, "es") as Record<string, string>;
