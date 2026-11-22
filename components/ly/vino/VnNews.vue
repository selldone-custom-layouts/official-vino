<!--
  The newsletter band above the footer (watchino-design home-a.html newsletter()): the shop's news by email.
  Selldone subscribes a signed-in customer (POST /subscribe), so a guest is asked to sign in first and a
  customer subscribes (or unsubscribes) with one press; no address is collected from a guest.
-->
<template>
  <section :aria-label="t('vino.news.aria', 'Newsletter')" class="ly vn-news">
    <div class="wrap vn-news-in">
      <div>
        <h2>{{ t("vino.news.h", "The {shop} newsletter", { shop: shopName }) }}</h2>
        <p>{{ done ? t("vino.news.on", "You are subscribed. Unsubscribe at any time.") : t("vino.news.p", "New arrivals and price changes, by email. Unsubscribe at any time.") }}</p>
      </div>
      <form class="vn-news-f" @submit.prevent="go">
        <label class="sr" for="vn-news-mail">{{ t("vino.news.mail", "Email address") }}</label>
        <input id="vn-news-mail" :placeholder="t('vino.news.ph', 'Your email address')" :readonly="!!user" :value="user?.email || ''" autocomplete="email" class="vn-inp" type="email" @focus="!user && signIn()" />
        <button :disabled="busy" class="btn" type="submit">{{ !user ? t("vino.news.signIn", "Sign up") : done ? t("vino.news.off", "Unsubscribe") : t("vino.news.sub", "Subscribe") }}</button>
      </form>
    </div>
  </section>
</template>

<script>
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "VnNews",
  data: () => ({ busy: false }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    user() {
      return this.$store.getters.getUser || null;
    },
    done() {
      return !!this.user?.subscribed;
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
  },
  methods: {
    t,
    signIn() {
      EventBus.$emit("need-login", true);
    },
    go() {
      if (!this.user) return this.signIn();
      this.busy = true;
      window.axios
        .post(window.XAPI.POST_SUBSCRIBE(this.shop.name), { subscribe: !this.done })
        .then(({ data }) => {
          if (!data.error && this.user) this.user.subscribed = data.subscribed;
        })
        .catch(() => {})
        .finally(() => (this.busy = false));
    },
  },
};
</script>
