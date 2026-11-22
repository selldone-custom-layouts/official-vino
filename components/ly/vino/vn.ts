/*
 * Vino (option A "Hairline"): the watch shop's selections, read live from the shop (watchino-design/src/common.cjs
 * mirrors these rules): a product's brand and one spec line (movement · case size · water), the live reductions
 * biggest first (Selldone's PriceHelper window), the newest, brands, price bands, movements and the trust lines
 * from the shop's own delivery ways, gateways and product condition. Nothing names a product, price or category.
 */
import { ly, priceView, shopFacts, specValue } from "../ly";
import { percentOff } from "../../kalio/kalio-catalog";
import { t } from "../../kalio/i18n/kalio-i18n";

export function brandOf(p: any): string {
  return String(p?.brand || "").trim();
}

function one(p: any, ...keys: string[]): string {
  for (const k of keys) {
    const v = specValue(p, k);
    if (v && v !== "group") return String(v);
  }
  return "";
}

export type Movement = "auto" | "quartz" | "solar" | "";
export function movementOf(p: any): Movement {
  const mv = one(p, "Movement", "Movement Type");
  if (!mv) return "";
  if (/solar/i.test(mv)) return "solar";
  if (/automatic|mechanical|flyback|calendar|manual/i.test(mv)) return "auto";
  if (/quartz/i.test(mv)) return "quartz";
  return "";
}
export function movementLabel(m: Movement): string {
  if (m === "auto") return t("vino.spec.auto", "Automatic");
  if (m === "quartz") return t("vino.spec.quartz", "Quartz");
  if (m === "solar") return t("vino.spec.solar", "Solar quartz");
  return "";
}

/** "Automatic · 40 mm · 100 m water", from whatever keys the product really has. */
export function specLine(p: any): string {
  const out: string[] = [];
  const mv = movementLabel(movementOf(p));
  if (mv) out.push(mv);
  const size = one(p, "Case diameter", "Case Diameter", "Dial Size", "Case Size");
  const sm = size.match(/(\d+(?:\.\d+)?)\s*(mm|millimeters|millimetres)/i);
  if (sm) out.push(t("vino.spec.mm", "{n} mm", { n: sm[1] }));
  const wr = one(p, "Water Resistance", "Water resistance");
  const wm = wr.match(/(\d+)\s*m/i);
  if (wm) out.push(t("vino.spec.water", "{n} m water", { n: wm[1] }));
  return out.slice(0, 3).join(" · ");
}

export function liveDeals(shop: any): any[] {
  return ly.products
    .map((p) => ({ p, off: percentOff(shop, p) }))
    .filter((x) => x.off > 0)
    .sort((a, b) => b.off - a.off || (b.p.price || 0) - (a.p.price || 0))
    .map((x) => x.p);
}
export function maxOff(shop: any): number {
  return ly.products.reduce((m, p) => Math.max(m, percentOff(shop, p) || 0), 0);
}
export function newest(): any[] {
  return [...ly.products].sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")) || b.id - a.id);
}
export function byPriceDesc(shop: any): any[] {
  return [...ly.products].sort((a, b) => priceView(shop, b).now - priceView(shop, a).now);
}
export function brands(): { name: string; n: number }[] {
  const m = new Map<string, number>();
  for (const p of ly.products) {
    const b = brandOf(p);
    if (b) m.set(b, (m.get(b) || 0) + 1);
  }
  return [...m.entries()].map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
}

export interface Trust {
  icon: string;
  title: string;
  text: string;
}
/** The delivery facts, from the shop's own ways, gateways and products. */
export function trustLines(shop: any, money: (n: number) => string): Trust[] {
  const f = shopFacts(shop);
  const out: Trust[] = [];
  const ship = f.shipping;
  if (ship)
    out.push(
      ship.distance >= 5000 || !ship.distance
        ? { icon: "truck", title: t("vino.trust.world", "Worldwide delivery"), text: ship.fee > 0 ? t("vino.trust.worldFee", "Flat {fee} shipping to any address", { fee: money(ship.fee) }) : t("vino.trust.worldFree", "Free shipping to any address") }
        : { icon: "truck", title: t("vino.trust.ship", "Delivery"), text: t("vino.trust.shipKm", "Up to {km} km away", { km: ship.distance }) },
    );
  const cod = f.gateways.some((g: any) => g?.cod || /^cod/i.test(String(g?.code || "")));
  if (f.courier && cod) out.push({ icon: "cash", title: t("vino.trust.cod", "Cash on delivery"), text: t("vino.trust.codKm", "By local courier, up to {km} km away", { km: f.courier.distance }) });
  else if (f.courier) out.push({ icon: "truck", title: t("vino.trust.courier", "Local courier"), text: t("vino.trust.codKm2", "Up to {km} km away", { km: f.courier.distance }) });
  if (ly.products.length && ly.products.every((p) => !p.condition || p.condition === "new")) out.push({ icon: "seal", title: t("vino.trust.new", "New and original"), text: t("vino.trust.newP", "Every watch is sold new, as listed") });
  return out;
}

/** The shop's own description, sentence by sentence. */
export function sentences(shop: any): string[] {
  return String(shop?.description || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
