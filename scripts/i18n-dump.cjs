#!/usr/bin/env node
/*
 * i18n-dump.cjs — the Layout's English words as the visitor reads them (base + bakini + ly + vino, the skin's basket
 * word and its words.en on top), as JSON. Used to hand the translators exactly the English that shows.
 *
 *   node scripts/i18n-dump.cjs [out.json] [--lang de]   (with --lang: that language's merged words instead)
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const I = path.join(ROOT, "components/kalio/i18n");

function loadTs(file) {
  if (!fs.existsSync(file)) return {};
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/^\s*import[^\n]*\n/gm, "").replace(/export default [^\n]*/g, "").replace(/const (\w+)\s*:\s*Record<string,\s*string>\s*=/, "module.exports =");
  const m = { exports: {} };
  new Function("module", "exports", s)(m, m.exports);
  return m.exports;
}
const skin = JSON.parse(fs.readFileSync(path.join(ROOT, "skins/vino/skin.json"), "utf8"));
const ONE = skin.basket.one, MANY = skin.basket.many;
const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
const basketWord = (s) => s.replace(/\b(bags|Bags|BAGS|bag|Bag|BAG)\b/g, (w) => {
  const b = /s$/i.test(w) ? MANY : ONE;
  if (w === w.toUpperCase()) return b.toUpperCase();
  return w[0] === w[0].toUpperCase() ? cap(b) : b;
});
const args = process.argv.slice(2);
const li = args.indexOf("--lang");
const lang = li >= 0 ? args[li + 1] : "en";
const out = args.find((a, i) => !a.startsWith("--") && (li < 0 || i !== li + 1));
const files = ["base/" + lang, "bakini." + lang, "ly." + lang, "vino." + lang].map((f) => path.join(I, f + ".ts"));
const merged = Object.assign({}, ...files.map(loadTs));
const res = {};
for (const [k, v] of Object.entries(merged)) res[k] = lang === "en" ? basketWord(v) : v;
Object.assign(res, (skin.words || {})[lang] || {});
const json = JSON.stringify(res, null, 1);
if (out) fs.writeFileSync(out, json);
else process.stdout.write(json);
console.error(`${lang}: ${Object.keys(res).length} keys`);
