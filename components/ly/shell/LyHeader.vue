<!--
  The top bar and the header (design/src/shell.js topbar(),
  header(), menuPanel(); set A "Classic"):

  - the top bar (it scrolls away): the counter's days and hours, the way to
    pay and "Pickup at <street>" on the left; the language & currency pill
    (EN · USD; the region-switcher kit's chips in a small panel), the phone
    and the email on the right. All from the shop's live data.
  - the header (it sticks): "Shop ⌄" (every collection with its best
    seller's photo and its lowest price, and the deals line), Deals,
    Journal, About and Contact on the left; the shop's live title drawn as
    the centred wordmark (with the city under it); search (live suggestions from the
    catalogue, Enter opens every result), the account, the bag with its
    count and "Order now" on the right.
  - phone (≤979px): the menu button, the wordmark (never lost), search and
    the bag; the menu is a panel from the left with the collections (the
    first 6, "Show N more" past 8), the pages, the account, a "Language &
    currency" row (a bottom sheet) and the counter's lines. No bottom tab bar.

  Every layer opens on a click and closes on a second click, Esc, a click
  outside or a page change (ly.ts layers); the menu, the bag and the sheet
  add the scrim. The panels are teleported to <body>. A shop with custom
  header code keeps Selldone's header (StorefrontLayout).
-->
<template>
  <div v-if="!$store.getters.getIsNative" class="ly ly-hdrwrap">
    <a class="skip" href="#main" @click.prevent="skip">{{ t("ly.hdr.skip", "Skip to content") }}</a>

    <div v-if="promoOn" class="vn-promo">
      <router-link :to="dealsTo" class="vn-promo-a"
        ><b>{{ t("vino.hdr.reduced", "Reduced prices") }}</b><span aria-hidden="true" class="sep">|</span><span>{{ t("vino.hdr.upTo", "Up to {off}% off selected watches", { off: offMax }) }}</span></router-link
      >
      <button :aria-label="t('vino.hdr.dismiss', 'Dismiss')" class="x" type="button" @click="shutPromo"><ly-icon name="close" /></button>
    </div>

    <header id="hdr" class="hdr vn-hdr">
      <div class="vn-row">
        <nav :aria-label="t('ly.hdr.main', 'Main')" class="vn-nav">
          <router-link :class="{ on: onDeals }" :to="dealsTo">{{ t("vino.hdr.offers", "Offers") }}</router-link>
          <button :aria-expanded="is('dd-shop') ? 'true' : 'false'" aria-controls="dd-shop" type="button" @click="toggle('dd-shop', $event)">
            {{ t("vino.hdr.watches", "Watches") }}<ly-icon cls="chev" name="down" />
          </button>
          <button v-if="brandList.length > 1" :aria-expanded="is('dd-brands') ? 'true' : 'false'" aria-controls="dd-brands" type="button" @click="toggle('dd-brands', $event)">
            {{ t("vino.hdr.brands", "Brands") }}<ly-icon cls="chev" name="down" />
          </button>
          <router-link :class="{ on: onJournal }" :to="blogTo">{{ t("ly.hdr.journal", "Journal") }}</router-link>
        </nav>

        <router-link :aria-label="shopName" class="vn-logo" to="/"
          ><b><bdi>{{ shopName }}</bdi></b><small>{{ t("ly.home.tagline", "Luxury watches") }}</small></router-link
        >

        <div class="tools">
          <button :aria-expanded="is('srch') ? 'true' : 'false'" aria-controls="srch" class="vn-sbox" type="button" @click="toggle('srch', $event)">
            <ly-icon name="search" /><span>{{ t("ly.hdr.searchPh0", "Search watches, brands") }}</span>
          </button>
          <button
            v-if="regionOn"
            :key="regionKey"
            :aria-expanded="is('rgp') ? 'true' : 'false'"
            :aria-label="t('ly.hdr.regionAria', 'Language and currency: {value}', { value: regionShort })"
            aria-controls="rgp"
            class="rg-pill rs-pick__btn vn-rg"
            type="button"
            @click="toggle('rgp', $event)"
          >
            <ly-icon name="globe" /><span dir="ltr">{{ regionShort }}</span>
          </button>
          <router-link :aria-label="t('ly.hdr.account', 'Account')" :to="accountTo" class="ibtn acct"><ly-icon name="user" /></router-link>
          <button
            :aria-expanded="is('drawer') ? 'true' : 'false'"
            :aria-label="t('ly.hdr.bagAria', { one: 'Bag, {n} piece', other: 'Bag, {n} pieces' }, { n: units })"
            aria-controls="drawer"
            class="ibtn bag-btn"
            type="button"
            @click="toggle('drawer', $event)"
          >
            <ly-icon name="bag" /><span class="count">{{ units > 99 ? "99+" : units }}</span>
          </button>
        </div>
      </div>

      <!-- phone: one row of tabs under the wordmark (menu, Watches, Offers, Journal, search) -->
      <div class="vn-tabs">
        <button :aria-expanded="is('menu') ? 'true' : 'false'" :aria-label="t('ly.hdr.menu', 'Menu')" aria-controls="menu" class="menu-btn" type="button" @click="toggle('menu', $event)">
          <ly-icon name="menu" />
        </button>
        <button :aria-expanded="is('dd-shop') ? 'true' : 'false'" aria-controls="dd-shop" type="button" @click="toggle('dd-shop', $event)">{{ t("vino.hdr.watches", "Watches") }}</button>
        <router-link :class="{ on: onDeals }" :to="dealsTo">{{ t("vino.hdr.offers", "Offers") }}</router-link>
        <router-link :to="blogTo">{{ t("ly.hdr.journal", "Journal") }}</router-link>
        <button :aria-expanded="is('srch') ? 'true' : 'false'" :aria-label="t('ly.hdr.search', 'Search')" aria-controls="srch" type="button" @click="toggle('srch', $event)">
          <ly-icon name="search" />
        </button>
      </div>

      <!-- The mega menu: collections, brands, price bands, movements and the newest watch. -->
      <div id="dd-shop" :class="['vn-mega', { open: is('dd-shop') }]">
        <div class="wrap vn-mega-in">
          <div>
            <p class="vn-mh">{{ t("vino.mega.collections", "Collections") }}</p>
            <ul>
              <li v-for="c in cats" :key="c.id"><router-link :to="catTo(c)"><bdi>{{ catTitle(c) }}</bdi></router-link></li>
            </ul>
          </div>
          <div v-if="brandList.length">
            <p class="vn-mh">{{ t("vino.mega.byBrand", "By brand") }}</p>
            <ul>
              <li v-for="b in brandList.slice(0, 8)" :key="b.name"><router-link :to="brandTo(b.name)"><bdi>{{ b.name }}</bdi></router-link></li>
              <li v-if="brandList.length > 1"><button class="all" type="button" @click="toggle('dd-brands', $event)">{{ t("vino.mega.allBrands", "All brands") }}</button></li>
            </ul>
          </div>
          <div>
            <p class="vn-mh">{{ t("vino.mega.byPrice", "By price") }}</p>
            <ul>
              <li v-for="b in bands" :key="b.label"><router-link :to="b.to">{{ b.label }}</router-link></li>
            </ul>
          </div>
          <div>
            <template v-if="moves.length">
              <p class="vn-mh">{{ t("vino.mega.movement", "Movement") }}</p>
              <ul>
                <li v-for="m in moves" :key="m"><router-link :to="searchTo(m)">{{ m }}</router-link></li>
              </ul>
            </template>
            <p class="vn-mh gap">{{ t("vino.mega.popular", "Popular") }}</p>
            <ul>
              <li><router-link :to="newTo">{{ t("vino.mega.newIn", "New in") }}</router-link></li>
              <li><router-link :to="dealsTo">{{ t("vino.hdr.reduced", "Reduced prices") }}</router-link></li>
              <li><router-link :to="allTo">{{ t("vino.mega.all", "All watches") }}</router-link></li>
            </ul>
          </div>
          <router-link v-if="feat" :to="productTo(feat)" class="vn-mfeat">
            <span class="vn-well"><img :src="thumbBig(feat)" alt="" loading="lazy" /></span>
            <span class="eyebrow">{{ t("vino.mega.newIn", "New in") }}</span>
            <b>{{ feat.title }}</b>
            <span class="vn-m">{{ money(priceView(shop, feat).now) }}</span>
          </router-link>
        </div>
      </div>

      <!-- Brands: every brand as a tile (its newest watch, its name, how many watches), each opening that brand's watches. -->
      <div id="dd-brands" :class="['vn-mega', 'vn-brm', { open: is('dd-brands') }]">
        <div class="wrap vn-brm-in">
          <div class="vn-brm-hd">
            <p class="vn-mh">{{ t("vino.mega.byBrand", "By brand") }}</p>
            <router-link :to="allTo" class="all">{{ t("vino.mega.all", "All watches") }}<ly-icon cls="flip-rtl" name="right" /></router-link>
          </div>
          <ul class="vn-brm-l">
            <li v-for="b in brandList" :key="b.name">
              <router-link :to="brandTo(b.name)">
                <span class="vn-well"><img v-if="brandImg(b.name)" :src="brandImg(b.name)" alt="" loading="lazy" /></span>
                <b><bdi>{{ b.name }}</bdi></b>
                <span class="n">{{ t("vino.mega.brandN", { one: "{n} watch", other: "{n} watches" }, { n: b.n }) }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Search: suggestions while typing (the live catalogue); Enter opens every result. -->
      <div id="srch" :class="['srch', { open: is('srch') }]" role="search">
        <div class="wrap srch-in">
          <form class="srch-f" @submit.prevent="submit()">
            <ly-icon name="search" />
            <input
              ref="q"
              :aria-label="t('ly.hdr.searchLabel', 'Search the bakery')"
              :placeholder="searchPlaceholder"
              :value="q"
              autocomplete="off"
              enterkeyhint="search"
              type="search"
              @input="q = $event.target.value"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
            />
            <button :aria-label="t('ly.hdr.closeSearch', 'Close search')" class="ibtn x" type="button" @click="closeLayer()"><ly-icon name="close" /></button>
          </form>
          <div class="srch-out">
            <p v-if="!query" class="srch-hint">
              <template v-if="popular.length">{{ t("ly.hdr.popular", "Popular:") }}</template>
              <button v-for="w in popular" :key="w" class="chip" type="button" @click="setQuery(w)">{{ w }}</button>
            </p>
            <template v-else>
              <ul v-if="hits.length" class="srch-list" role="listbox">
                <li v-for="(p, i) in hits" :key="p.id">
                  <router-link :class="{ hl: i === cursor }" :to="productTo(p)" role="option">
                    <span class="th"><img :src="thumb(p)" alt="" /></span>
                    <span class="tx"
                      ><b>{{ p.title }}</b
                      ><small><bdi>{{ catTitle(catOf(p.category_id)) }}</bdi> · {{ t("ly.card.perLow", "per {unit}", { unit: unitOf(p) }) }}</small></span
                    >
                    <span class="ly money">{{ money(priceView(shop, p).now) }}</span>
                  </router-link>
                </li>
              </ul>
              <p v-if="!hits.length" class="srch-hint">{{ t("ly.hdr.noMatch", "Nothing matches “{q}”. Try another word.", { q: query }) }}</p>
              <router-link v-else :to="searchTo(query)" class="srch-all">{{ t("ly.hdr.allFor", "See every result for “{q}”", { q: query }) }}<ly-icon name="arrow" /></router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <div v-if="trust.length || facts.phone" class="vn-usp">
      <div class="vn-usp-in">
        <ul>
          <li v-for="x in trust" :key="x.title"><ly-icon :name="x.icon" />{{ x.title }}</li>
        </ul>
        <ul class="r">
          <li v-if="facts.phone"><a :href="tel" dir="ltr"><ly-icon name="phone" />{{ facts.phone }}</a></li>
          <li><router-link :to="faqTo">{{ t('vino.hdr.help', 'Help') }}</router-link></li>
          <li><router-link :to="contactTo">{{ t('vino.hdr.contactUs', 'Contact us') }}</router-link></li>
        </ul>
      </div>
    </div>

    <teleport to="body">
      <div :dir="rtl ? 'rtl' : 'ltr'" class="ly ly-layers">
        <!-- Language and currency (the region-switcher kit's chips; its class
             names stay on the pill, panel and sheet so its checks find them). -->
        <div v-if="regionOn" id="rgp" ref="rgp" :aria-label="t('region.title', 'Language & currency')" :class="['rgp', 'rs-pop', { open: is('rgp') }]" :style="rgpPos" role="dialog">
          <p class="dd-h">{{ regionTitle }}</p>
          <region-chips :key="regionKey" @picked="closeLayer()" />
          <p v-if="regionNote" class="rgp-note">{{ regionNote }}</p>
        </div>

        <!-- The phone menu: a panel from the left. -->
        <nav id="menu" :aria-label="t('ly.hdr.menu', 'Menu')" :class="['panel', 'menu', { open: is('menu') }]">
          <div class="pn-hd">
            <span class="pn-t">{{ t("ly.hdr.menu", "Menu") }}</span>
            <button :aria-label="t('ly.hdr.closeMenu', 'Close menu')" class="ibtn x" type="button" @click="closeLayer()"><ly-icon name="close" /></button>
          </div>
          <p class="pn-h">{{ t("ly.hdr.collections", "The collections") }}</p>
          <ul class="pn-list">
            <li v-for="c in menuCats" :key="c.id">
              <router-link :to="catTo(c)">
                <span class="th"><img v-if="topImg(c)" :src="topImg(c)" alt="" loading="lazy" /></span><span><bdi>{{ catTitle(c) }}</bdi></span><ly-icon cls="chev" name="right" />
              </router-link>
            </li>
            <li v-if="menuRest.length">
              <button :aria-expanded="moreOpen ? 'true' : 'false'" class="pn-more" type="button" @click="moreOpen = !moreOpen">
                <span class="th"><ly-icon :name="moreOpen ? 'up' : 'down'" /></span
                ><span>{{ moreOpen ? t("ly.hdr.fewer", "Show fewer") : t("ly.hdr.more", "Show {n} more", { n: menuRest.length }) }}</span>
              </button>
            </li>
          </ul>
          <ul class="pn-list plain">
            <li>
              <router-link :to="dealsTo"><span>{{ t("ly.hdr.deals", "Deals") }}</span><ly-icon cls="chev" name="right" /></router-link>
            </li>
            <li>
              <router-link :to="blogTo"><span>{{ t("ly.hdr.journal", "Journal") }}</span><ly-icon cls="chev" name="right" /></router-link>
            </li>
            <li>
              <router-link :to="aboutTo"><span>{{ t("ly.hdr.about", "About") }}</span><ly-icon cls="chev" name="right" /></router-link>
            </li>
            <li>
              <router-link :to="contactTo"><span>{{ t("ly.hdr.contact", "Contact") }}</span><ly-icon cls="chev" name="right" /></router-link>
            </li>
            <li>
              <router-link :to="accountTo"><span>{{ t("ly.hdr.account", "Account") }}</span><ly-icon cls="chev" name="right" /></router-link>
            </li>
            <li v-if="regionOn">
              <button :key="regionKey" aria-controls="langsheet" class="pn-rg rs-row" type="button" @click="openLayer('langsheet', $event.currentTarget)">
                <span>{{ t("region.title", "Language & currency") }}</span><span class="pn-rg-v" dir="ltr">{{ regionShort }}</span><ly-icon cls="chev" name="right" />
              </button>
            </li>
          </ul>
          <div class="pn-info">
            <p v-if="openLine"><ly-icon name="clock" /><span>{{ openLine }}</span></p>
            <p v-if="facts.address"><ly-icon name="pin" /><span><bdi>{{ facts.address }}</bdi></span></p>
            <p v-if="facts.phone">
              <a :href="tel"><ly-icon name="phone" /><span dir="ltr">{{ facts.phone }}</span></a>
            </p>
          </div>
        </nav>

        <!-- The language & currency sheet (phone). -->
        <div v-if="regionOn" id="langsheet" :aria-label="t('region.title', 'Language & currency')" :class="['ly-sheet', 'rs-sheet', { open: is('langsheet') }]" aria-modal="true" role="dialog">
          <div class="pn-hd">
            <h2 class="pn-t">{{ t("region.title", "Language & currency") }}</h2>
            <button :aria-label="t('ly.hdr.close', 'Close')" class="ibtn x" type="button" @click="closeLayer()"><ly-icon name="close" /></button>
          </div>
          <div class="sh-body">
            <region-chips :key="regionKey" />
            <p v-if="regionNote" class="rgp-note">{{ regionNote }}</p>
            <button class="btn block" type="button" @click="closeLayer()">{{ t("region.done", "Done") }}</button>
          </div>
        </div>

        <div :class="['scrim', { open: scrim }]" @click="closeLayer()"></div>
        <ly-bag-drawer />
      </div>
      <ly-quick-view />
    </teleport>
  </div>
</template>

<script>
import LyLogo from "../LyLogo.vue";
import LyIcon from "../LyIcon.vue";
import LyBagDrawer from "./LyBagDrawer.vue";
import LyQuickView from "../ui/LyQuickView.vue";
import RegionChips from "../../region-switcher/RegionChips.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { catalogueRoute, dealsRoute, percentOff } from "../../kalio/kalio-catalog";
import { journalRoute } from "../../kalio/pages/kalio-journal";
import { currencies, currentCurrency, currentLanguage, hasChoice, isRtl, regionState, showLanguages } from "../../region-switcher/region";
import { openLine as openLineOf,
  bySells,
  catOf,
  catTitle,
  catTo,
  closeLayer,
  closeOnRoute,
  ly,
  inCat,
  isModal,
  layer,
  loadDm,
  money,
  openLayer,
  priceView,
  productImage,
  productTo,
  scrollBehavior,
  shopFacts,
  toggleLayer,
  unitOf,
  wireLayers,
} from "../ly";
import { t } from "../../kalio/i18n/kalio-i18n";
import { collectionPhoto } from "../ly-photos";
import { brandOf, brands, maxOff, movementLabel, movementOf, newest, trustLines } from "../vino/vn";

/* Words that say nothing about a pastry, left out of "Popular". */
const STOP = new Set(["and", "with", "the", "of", "a", "an", "in", "on", "mini", "classic", "double", "cake", "cakes"]);

export default {
  name: "LyHeader",
  components: { LyLogo, LyIcon, LyBagDrawer, LyQuickView, RegionChips },
  props: {
    showSearch: { type: Boolean, default: true },
  },
  emits: ["search", "clear"],

  data: () => ({ q: "", cursor: -1, moreOpen: false, rgpPos: {}, layer, ly, region: regionState, promoShut: false }),

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    facts() {
      return shopFacts(this.shop);
    },
    rtl() {
      void this.region.language;
      return isRtl();
    },
    cats() {
      return this.ly.cats;
    },
    /* The most-ordered collection with its own photo (the Shop menu's feature card); none without a photo. */
    feature() {
      const ranked = this.cats
        .map((c, i) => ({ c, i, sold: inCat(c.id).reduce((s, p) => s + (p.sells || 0), 0) }))
        .filter((x) => x.sold || inCat(x.c.id).length)
        .sort((a, b) => b.sold - a.sold || a.i - b.i);
      const hit = ranked.find((x) => collectionPhoto(x.c));
      return hit ? hit.c : null;
    },
    featurePhoto() {
      return this.feature ? collectionPhoto(this.feature) : null;
    },
    street() {
      const p = this.facts.pickupPoint;
      return p?.address || String(this.facts.address || "").split(",")[0];
    },
    /* "Open every day 8:00–18:00" (the counter's days and hours). */
    openLine() {
      return openLineOf(this.facts);
    },
    tel() {
      return "tel:" + String(this.facts.phone || "").replace(/[^\d+]/g, "");
    },
    /* the Journal link stays lit on a post too (the router marks only the list itself) */
    onJournal() {
      const r = window.$storefront?.routes || {};
      return [r.BLOGS_PAGE, r.SHOP_BLOG_PAGE, r.SHOP_BLOG_PAGE_SLUG].filter(Boolean).includes(this.$route?.name);
    },
    onDeals() {
      return !!this.$route?.query?.filter && /only_has_discount/.test(String(this.$route.query.filter)) && !this.$route?.params?.category_name;
    },
    units() {
      return this.getBaskets().reduce((sum, b) => sum + (b?.items || []).reduce((n, it) => n + (it.count || 0), 0), 0);
    },
    scrim() {
      return !!this.layer.open && isModal(this.layer.open);
    },
    /* The region package reads its words when it draws. */
    regionKey() {
      return t("region.title", "Language & currency") + this.region.words;
    },
    regionOn() {
      void this.shop;
      return hasChoice();
    },
    /* "EN · USD": the language and the currency, also with one of each. */
    regionShort() {
      void this.region.currency;
      void this.region.language;
      void this.shop;
      return `${currentLanguage().toUpperCase()} · ${currentCurrency()}`;
    },
    regionTitle() {
      void this.shop;
      return showLanguages() ? t("region.title", "Language & currency") : t("region.currency", "Currency");
    },
    /* The chips say it themselves with one currency ("Prices and totals are
       in US dollars."); with a choice, that every price follows. */
    regionNote() {
      void this.shop;
      if (currencies().length <= 1 && !showLanguages()) return "";
      return t("region.note", "Prices everywhere change at once: cards, filters, bag and checkout.");
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    menuCats() {
      return this.cats.length <= 8 || this.moreOpen ? this.cats : this.cats.slice(0, 6);
    },
    menuRest() {
      return this.cats.length <= 8 ? [] : this.cats.slice(6);
    },
    /* "25% off every piece" / "Up to 30% off", from the live deals. */
    dealsLine() {
      const offs = this.ly.products.map((p) => percentOff(this.shop, p)).filter((x) => x > 0);
      if (!offs.length) return t("ly.hdr.everyPastry", "Every pastry");
      const max = Math.max(...offs);
      const every = offs.length === this.ly.products.length && Math.min(...offs) === max;
      return every ? t("ly.hdr.offEvery", "{off}% off every piece", { off: max }) : t("ly.hdr.offUpTo", "Up to {off}% off", { off: max });
    },
    /* "Popular": the words most products share (flavours), from the live catalogue. */
    popular() {
      const count = new Map();
      const catWords = new Set(this.cats.flatMap((c) => catTitle(c).toLowerCase().split(/\s+/)).concat(this.cats.flatMap((c) => catTitle(c).toLowerCase().replace(/s$/, "").split(/\s+/))));
      for (const p of this.ly.products) {
        const seen = new Set();
        for (const w of String(p.title || "").split(/[^\p{L}]+/u)) {
          const k = w.toLowerCase();
          if (k.length < 4 || STOP.has(k) || catWords.has(k) || catWords.has(k + "s") || seen.has(k)) continue;
          seen.add(k);
          count.set(k, (count.get(k) || 0) + 1);
        }
      }
      return [...count.entries()]
        .filter(([, n]) => n >= 2)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 4)
        .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
    },
    /* "Search croissants, tarts, flavours…" from the shop's own collections. */
    searchPlaceholder() {
      const names = this.cats.slice(0, 2).map((c) => catTitle(c).toLowerCase());
      return names.length ? t("ly.hdr.searchPh", "Search {examples}, flavours…", { examples: names.join(", ") }) : t("ly.hdr.searchPh0", "Search the bakery…");
    },
    query() {
      return this.q.trim();
    },
    hits() {
      const q = this.query.toLowerCase();
      if (!q) return [];
      const words = q.split(/\s+/).filter(Boolean);
      const score = (p) => {
        const title = String(p.title || "").toLowerCase();
        const hay = (title + " " + catTitle(catOf(p.category_id)) + " " + Object.values(p.spec || {}).flat().join(" ")).toLowerCase();
        let s = 0;
        for (const w of words) {
          if (title.includes(w)) s += 3;
          else if (hay.includes(w)) s += 1;
          else return 0;
        }
        return s;
      };
      return this.ly.products
        .map((p) => ({ p, s: score(p) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || (b.p.sells || 0) - (a.p.sells || 0))
        .slice(0, 6)
        .map((x) => x.p);
    },
    r() {
      return window.$storefront.routes;
    },
    offMax() {
      void this.region.currency;
      return this.ly.ready ? maxOff(this.shop) : 0;
    },
    promoOn() {
      return this.offMax > 0 && !this.promoShut;
    },
    trust() {
      void this.region.currency;
      return this.ly.ready ? trustLines(this.shop, (n) => money(n)) : [];
    },
    brandList() {
      return brands();
    },
    moves() {
      const set = new Set(this.ly.products.map((p) => movementOf(p)).filter(Boolean));
      return ['auto', 'quartz', 'solar'].filter((m) => set.has(m)).map((m) => movementLabel(m));
    },
    /* Price bands that hold at least one watch, in the visitor's currency. */
    bands() {
      void this.region.currency;
      const now = this.ly.products.map((p) => priceView(this.shop, p).now);
      const B = [[0, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 100000], [100000, Infinity]];
      return B.filter(([lo, hi]) => now.some((v) => v >= lo && v < hi)).map(([lo, hi]) => ({
        label: lo === 0 ? t('vino.mega.under', 'Under {p}', { p: money(hi, true) }) : hi === Infinity ? t('vino.mega.over', '{p} and over', { p: money(lo, true) }) : money(lo, true) + ' – ' + money(hi, true),
        to: { name: this.r.SHOP_PAGE, query: { price: lo + '-' + (hi === Infinity ? '' : hi) } },
      }));
    },
    feat() {
      return newest()[0] || null;
    },

    newTo() {
      return { name: this.r.SHOP_PAGE, query: { sort: 'newest' } };
    },
    allTo() {
      return { name: this.r.SHOP_PAGE };
    },
    faqTo() {
      return this.$router.hasRoute("ShopFAQ") ? { name: "ShopFAQ" } : { name: this.r.SHOP_CONTACT_US };
    },
    dealsTo() {
      return dealsRoute();
    },
    blogTo() {
      return journalRoute();
    },
    aboutTo() {
      return { name: this.r.SHOP_PROFILE_PAGE_ABOUT_US };
    },
    contactTo() {
      return { name: this.r.SHOP_CONTACT_US };
    },
    accountTo() {
      return { name: "KalioAccountHome" };
    },
    orderHref() {
      return "#selection";
    },
  },

  watch: {
    "layer.open"(id) {
      if (id === "srch") this.$nextTick(() => setTimeout(() => this.$refs.q?.focus({ preventScroll: true }), 60));
      if (id === "rgp") this.$nextTick(() => this.place());
      if (id !== "menu" && id !== "langsheet") this.moreOpen = false;
    },
    query() {
      this.cursor = -1;
    },
  },

  created() {
    try {
      this.promoShut = sessionStorage.getItem("vino-promo") === "0";
    } catch {}
    loadDm();
    wireLayers();
    closeOnRoute(this.$router);
  },

  mounted() {
    this.onResize = () => {
      if (this.layer.open === "rgp") this.place();
    };
    window.addEventListener("resize", this.onResize, { passive: true });
    /* Any part of the page can open the bag. */
    this.openBag = () => openLayer("drawer");
    EventBus.$on("bakini:open-cart", this.openBag);
    EventBus.$on("ly:open-bag", this.openBag);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    EventBus.$off("bakini:open-cart", this.openBag);
    EventBus.$off("ly:open-bag", this.openBag);
  },

  methods: {
    t,
    money,
    priceView,
    catTitle,
    catTo,
    catOf,
    unitOf,
    productTo,
    openLayer,
    closeLayer,
    is(id) {
      return this.layer.open === id;
    },
    toggle(id, e) {
      toggleLayer(id, e?.currentTarget || null);
    },
    /* The collection's best seller, as its thumbnail. */
    topImg(c) {
      const top = bySells(inCat(c.id))[0];
      return top ? productImage(top, 128) : null;
    },
    /* The collection's lowest price now, in the visitor's currency. */
    fromPrice(c) {
      void this.region.currency;
      const list = inCat(c.id);
      if (!list.length) return "";
      return money(Math.min(...list.map((p) => priceView(this.shop, p).now)));
    },
    /* A brand's own watches: ?brand= (the listing keeps only that brand). */
    brandTo(name) {
      return { name: this.r.SHOP_PAGE, query: { brand: name } };
    },
    /* The brand's newest watch, as its tile's photo. */
    brandImg(name) {
      const p = newest().find((x) => brandOf(x) === name) || this.ly.products.find((x) => brandOf(x) === name);
      /* the original photo: a product's 256 px copy does not always exist (one brand drew a broken image) */
      return p ? productImage(p) : null;
    },
    thumbBig(p) {
      return productImage(p);
    },
    shutPromo() {
      this.promoShut = true;
      try {
        sessionStorage.setItem("vino-promo", "0");
      } catch {}
    },
    thumb(p) {
      return productImage(p, 128);
    },
    /* Under the pill, its right edge on the pill's, never within 12px of an edge. */
    place() {
      const btn = document.querySelector('[aria-controls="rgp"]');
      const el = this.$refs.rgp;
      if (!btn || !el) return;
      const r = btn.getBoundingClientRect();
      const w = el.offsetWidth || 300;
      const left = Math.max(12, Math.min(window.innerWidth - w - 12, r.right - w));
      this.rgpPos = { top: `${r.bottom + 8}px`, left: `${left}px` };
    },
    move(d) {
      const n = this.hits.length;
      if (!n) return;
      this.cursor = (this.cursor + d + n) % n;
    },
    setQuery(w) {
      this.q = w;
      this.$nextTick(() => this.$refs.q?.focus({ preventScroll: true }));
    },
    searchTo(q) {
      return { name: this.r.SHOP_PAGE, query: { search: q } };
    },
    submit() {
      if (this.cursor >= 0 && this.hits[this.cursor]) {
        this.$router.push(productTo(this.hits[this.cursor]));
        return;
      }
      const text = this.query;
      closeLayer(true);
      if (!text) return this.$emit("clear");
      this.$emit("search", { search: text, search_type: null });
    },
    /* "Order now": today's selection on the home. */
    orderNow() {
      closeLayer(true);
      const go = () => {
        const el = document.getElementById("selection");
        if (el) el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      };
      if (document.getElementById("selection")) return go();
      this.$router.push({ path: "/" }).then(() => setTimeout(go, 400)).catch(() => {});
    },
    skip() {
      const m = document.getElementById("main") || document.querySelector("main");
      if (m) {
        m.setAttribute("tabindex", "-1");
        m.focus();
      }
    },
    catalogueRoute,
  },
};
</script>
