<!--
  Vino's home (watchino-design/home-a.html, option A "Hairline"), all from the shop's live data:
  the offers hero (the hero photo, white words on its dark side; the biggest live reduction), three trust facts and
  three entry tiles (the largest collection, the newest watch, watches under a price), the collections as photo
  tiles, New in, the editorial pair (About and Ask us), Reduced prices (live windows only, biggest first), the
  delivery feature (from the shop's own ways), the brands and the journal. A section with nothing to show hides.
-->
<template>
  <div class="vn-home">
    <section id="offers" class="vn-hero">
      <picture>
        <source v-if="photo('hero-phone')" :srcset="photo('hero-phone')" media="(max-width: 900px)" />
        <img v-if="photo('hero')" :alt="t('ly.home.heroAlt', 'A man fastening his watch')" :src="photo('hero')" fetchpriority="high" height="1000" width="2400" />
      </picture>
      <div class="wrap vn-hero-in">
        <div class="vn-hero-copy">
          <span class="eyebrow">{{ off ? t("vino.hdr.reduced", "Reduced prices") : shopName }}</span>
          <h1>{{ off ? t("vino.home.heroH", "Up to {off}% off selected watches", { off }) : t("ly.home.tagline", "Luxury watches") }}</h1>
          <p>{{ off ? t("vino.home.heroP", "Live reductions across our collections, with the full price shown next to every one.") : lede[0] }}</p>
          <router-link :to="off ? dealsTo : allTo" class="btn">{{ off ? t("vino.home.heroBtn", "Shop reduced prices") : t("ly.home.shopAll", "Shop all watches") }}</router-link>
        </div>
      </div>
    </section>

    <section class="vn-sec vn-top">
      <div class="wrap">
        <div v-if="facts.length" class="vn-trust">
          <div v-for="x in facts" :key="x.title"><ly-icon :name="x.icon" /><p><b>{{ x.title }}</b><span>{{ x.text }}</span></p></div>
        </div>
        <div v-if="tiles.length" class="vn-tiles3">
          <router-link v-for="x in tiles" :key="x.key" :to="x.to" class="vn-pt">
            <span class="vn-pt-tx"><b class="vn-pt-h"><template v-if="x.amt && x.title.includes(x.amt)">{{ x.title.split(x.amt)[0] }}<span class="vn-amt">{{ x.amt }}</span>{{ x.title.split(x.amt)[1] }}</template><template v-else>{{ x.title }}</template></b><span class="vn-go">{{ t("vino.home.shopNow", "Shop now") }}<ly-icon name="right" /></span></span>
            <span class="vn-pt-pic"><img :src="img(x.p)" alt="" loading="lazy" /></span>
          </router-link>
        </div>
      </div>
    </section>

    <section v-if="cats.length" class="vn-sec band">
      <div class="wrap">
        <div class="vn-sh"><h2>{{ t("vino.home.byCol", "Shop by collection") }}</h2><router-link :to="allTo" class="vn-more">{{ t("vino.mega.all", "All watches") }}<ly-icon name="right" /></router-link></div>
        <div :style="{ '--n': Math.min(cats.length, 6) }" class="vn-cols">
          <router-link v-for="c in cats" :key="c.id" :to="catTo(c)" class="vn-ct">
            <img v-if="colPhoto(c)" :src="colPhoto(c)" alt="" loading="lazy" />
            <span v-else class="vn-ct-fb"><img v-if="topOf(c)" :src="img(topOf(c))" alt="" loading="lazy" /></span>
            <span class="vn-ct-t"><bdi>{{ catTitle(c) }}</bdi><ly-icon name="right" /></span>
          </router-link>
        </div>
      </div>
    </section>

    <section v-if="newIn.length" id="new" class="vn-sec">
      <div class="wrap">
        <div class="vn-sh">
          <div><h2>{{ t("vino.mega.newIn", "New in") }}</h2><p>{{ t("vino.home.newP", "The latest watches added to the shop.") }}</p></div>
          <vn-arrows target="vn-r-new" />
        </div>
        <div id="vn-r-new" class="vn-rail"><ly-card v-for="p in newIn" :key="p.id" :product="p" no-cat /></div>
      </div>
    </section>

    <section class="vn-sec band">
      <div class="wrap vn-ed2">
        <article>
          <div class="vn-ed-media"><img v-if="photo('story')" :src="photo('story')" alt="" loading="lazy" /></div>
          <div class="vn-ed-card">
            <span class="eyebrow">{{ t("vino.home.aboutEb", "About us") }}</span>
            <h3>{{ aboutH }}</h3>
            <p v-if="lede[1] || lede[0]">{{ lede[1] || lede[0] }}</p>
            <router-link :to="{ name: r.SHOP_PROFILE_PAGE_ABOUT_US }" class="btn ghost">{{ t("vino.ftr.about", "About {shop}", { shop: shopName }) }}</router-link>
          </div>
        </article>
        <article>
          <div class="vn-ed-media"><img v-if="photo('boutique')" :src="photo('boutique')" alt="" loading="lazy" /></div>
          <div class="vn-ed-card">
            <span class="eyebrow">{{ t("vino.home.askEb", "Ask us") }}</span>
            <h3>{{ t("vino.home.askH", "Questions about a watch?") }}</h3>
            <ul v-if="info.phone || info.email" class="vn-rows">
              <li v-if="info.phone"><ly-icon name="phone" /><a :href="'tel:' + info.phone.replace(/[^\d+]/g, '')" dir="ltr">{{ info.phone }}</a></li>
              <li v-if="info.email"><ly-icon name="mail" /><a :href="'mailto:' + info.email">{{ info.email }}</a></li>
            </ul>
            <router-link :to="{ name: r.SHOP_CONTACT_US }" class="btn ghost">{{ t("vino.hdr.contactUs", "Contact us") }}</router-link>
          </div>
        </article>
      </div>
    </section>

    <section v-if="reduced.length" id="reduced" class="vn-sec">
      <div class="wrap">
        <div class="vn-sh">
          <div><h2>{{ t("vino.hdr.reduced", "Reduced prices") }}</h2><p>{{ t("vino.home.redP", "Live reductions, largest first.") }}</p></div>
          <vn-arrows target="vn-r-off" />
        </div>
        <div id="vn-r-off" class="vn-rail"><ly-card v-for="p in reduced" :key="p.id" :product="p" no-cat /></div>
      </div>
    </section>

    <section v-if="delivery" class="vn-sec vn-pt0">
      <div class="wrap">
        <div class="vn-feat">
          <div class="vn-feat-ph"><img v-if="photo('travel')" :src="photo('travel')" alt="" loading="lazy" /></div>
          <div class="vn-feat-tx">
            <span class="eyebrow">{{ t("vino.home.delEb", "Delivery") }}</span>
            <h2>{{ t("vino.home.delH", "Delivered to your door, wherever you are") }}</h2>
            <p>{{ delivery }}</p>
            <router-link :to="faqTo" class="btn">{{ t("vino.home.delBtn", "Delivery & payment") }}</router-link>
          </div>
        </div>
      </div>
    </section>

    <section v-if="brandList.length" id="brands" class="vn-sec band">
      <div class="wrap">
        <div class="vn-sh"><h2>{{ t("vino.home.byBrand", "Shop by brand") }}</h2></div>
        <div class="vn-br">
          <router-link v-for="b in brandList" :key="b.name" :to="searchTo(b.name)"><b><bdi>{{ b.name }}</bdi></b><span>{{ t("vino.home.shopNow", "Shop now") }}</span></router-link>
        </div>
      </div>
    </section>

    <section v-if="posts.length" id="journal" class="vn-sec">
      <div class="wrap">
        <div class="vn-sh"><h2>{{ t("vino.home.journal", "The journal") }}</h2></div>
        <div class="vn-jr">
          <router-link v-for="a in posts" :key="a.id" :to="postRoute(a)">
            <span class="vn-cov"><img v-if="a.image" :src="postImg(a)" alt="" loading="lazy" /></span>
            <time :datetime="a.created_at" class="eyebrow">{{ fmtDate(a.created_at) }}</time>
            <b>{{ a.title }}</b>
            <span v-if="a.description" class="vn-jr-p">{{ a.description }}</span>
            <span class="vn-more">{{ t("vino.home.readMore", "Read more") }}<ly-icon name="right" /></span>
          </router-link>
        </div>
        <div class="vn-center"><router-link :to="blogTo" class="btn ghost">{{ t("vino.home.allPosts", "View all articles") }}</router-link></div>
      </div>
    </section>
  </div>
</template>

<script>
import LyIcon from "../LyIcon.vue";
import LyCard from "../ui/LyCard.vue";
import VnArrows from "./VnArrows.vue";
import { bySells, catTitle, catTo, fmtDate, guestCheckout, inCat, loadDm, ly, money, priceView, productImage, shopFacts } from "../ly";
import { collectionPhoto, slotPhoto } from "../ly-photos";
import { dealsRoute } from "../../kalio/kalio-catalog";
import { journalPage, journalRoute, postRoute } from "../../kalio/pages/kalio-journal";
import { currencies, regionState } from "../../region-switcher/region";
import { brands, liveDeals, maxOff, newest, sentences, trustLines } from "./vn";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "VnHome",
  components: { LyIcon, LyCard, VnArrows },
  props: { band: Boolean, variant: { type: String, default: "" } },
  data: () => ({ ly, region: regionState, posts: [] }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    r() {
      return window.$storefront.routes;
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    info() {
      const f = shopFacts(this.shop);
      return f.ready ? f : { phone: "", email: "" };
    },
    lede() {
      return sentences(this.shop);
    },
    aboutH() {
      const s = this.lede[0] || "";
      const m = s.match(/where ([^.,]+)/i);
      return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : this.shopName;
    },
    off() {
      void this.region.currency;
      return this.ly.ready ? maxOff(this.shop) : 0;
    },
    cats() {
      return this.ly.cats.filter((c) => inCat(c.id).length);
    },
    newIn() {
      return newest().slice(0, 6);
    },
    reduced() {
      void this.region.currency;
      return liveDeals(this.shop).slice(0, 6);
    },
    brandList() {
      return brands().slice(0, 12);
    },
    facts() {
      const out = [];
      const cur = currencies();
      if (cur.length) out.push({ icon: "globe", title: t("vino.home.cur", "Your currency"), text: t("vino.home.curP", "Prices in {list}", { list: cur.map((c) => c.code || c).join(", ") }) });
      if (guestCheckout(this.shop)) out.push({ icon: "user", title: t("vino.home.guest", "No account needed"), text: t("vino.home.guestP", "Check out as a guest") });
      out.push({ icon: "seal", title: t("vino.home.live", "Every price is live"), text: t("vino.home.liveP", "Reductions only while they run") });
      return out;
    },
    tiles() {
      void this.region.currency;
      if (!this.ly.ready) return [];
      const out = [];
      const big = [...this.cats].sort((a, b) => inCat(b.id).length - inCat(a.id).length)[0];
      if (big) out.push({ key: "c", title: catTitle(big), to: catTo(big), p: bySells(inCat(big.id))[0] });
      const nw = newest()[0];
      if (nw) out.push({ key: "n", title: t("vino.home.newArr", "New arrivals"), to: { name: this.r.SHOP_PAGE, query: { sort: "newest" } }, p: nw });
      const cheap = [...this.ly.products].sort((a, b) => priceView(this.shop, a).now - priceView(this.shop, b).now);
      const lim = 5000;
      const under = cheap.filter((p) => priceView(this.shop, p).now < lim);
      if (under.length && under.length < this.ly.products.length) out.push({ key: "u", amt: money(lim, true), title: t("vino.home.under", "Watches under {p}", { p: money(lim, true) }), to: { name: this.r.SHOP_PAGE, query: { price: "0-" + lim } }, p: under[0] });
      return out.filter((x) => x.p);
    },
    delivery() {
      void this.region.currency;
      const f = shopFacts(this.shop);
      const parts = [];
      if (f.shipping && f.shipping.fee > 0 && (f.shipping.distance >= 5000 || !f.shipping.distance)) parts.push(t("vino.home.delWorld", "worldwide shipping at a flat {fee}", { fee: money(f.shipping.fee) }));
      else if (f.shipping && (f.shipping.distance >= 5000 || !f.shipping.distance)) parts.push(t("vino.home.delWorldFree", "free worldwide shipping"));
      const cod = f.gateways.some((g) => g?.cod || /^cod/i.test(String(g?.code || "")));
      if (f.courier) parts.push(cod ? t("vino.home.delCod", "a local courier within {km} km, with cash on delivery", { km: f.courier.distance }) : t("vino.home.delCourier", "a local courier within {km} km", { km: f.courier.distance }));
      if (!parts.length) return "";
      const s = parts.join(t("vino.home.and", ", and "));
      return s.charAt(0).toUpperCase() + s.slice(1) + ".";
    },
    dealsTo() {
      return dealsRoute();
    },
    allTo() {
      return { name: this.r.SHOP_PAGE };
    },
    blogTo() {
      return journalRoute();
    },
    faqTo() {
      return this.$router.hasRoute("ShopFAQ") ? { name: "ShopFAQ" } : { name: this.r.SHOP_CONTACT_US };
    },
  },
  created() {
    loadDm();
    journalPage({ page: 1, limit: 4 })
      .then(({ articles }) => (this.posts = (articles || []).slice(0, 4)))
      .catch(() => (this.posts = []));
  },
  methods: {
    t,
    catTitle,
    catTo,
    fmtDate,
    postRoute,
    photo: slotPhoto,
    colPhoto: collectionPhoto,
    img(p) {
      return productImage(p);
    },
    topOf(c) {
      return bySells(inCat(c.id))[0];
    },
    postImg(a) {
      return window.CDN.GET_SHOP_IMAGE_PATH(a.image, null);
    },
    searchTo(q) {
      return { name: this.r.SHOP_PAGE, query: { search: q } };
    },
  },
};
</script>
