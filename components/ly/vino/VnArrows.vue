<!-- The two round arrows of a rail (both always visible; they scroll the rail by its own width, mirrored in RTL). -->
<template>
  <div class="vn-arrows">
    <button :aria-label="t('vino.rail.back', 'Scroll back')" class="vn-arr" type="button" @click="go(-1)"><ly-icon cls="k-flip" name="left" /></button>
    <button :aria-label="t('vino.rail.fwd', 'Scroll forward')" class="vn-arr" type="button" @click="go(1)"><ly-icon cls="k-flip" name="right" /></button>
  </div>
</template>

<script>
import LyIcon from "../LyIcon.vue";
import { t } from "../../kalio/i18n/kalio-i18n";
import { scrollBehavior } from "../ly";

export default {
  name: "VnArrows",
  components: { LyIcon },
  props: { target: { type: String, required: true } },
  methods: {
    t,
    go(d) {
      const r = document.getElementById(this.target);
      if (!r) return;
      const rtl = getComputedStyle(r).direction === "rtl";
      r.scrollBy({ left: (rtl ? -d : d) * r.clientWidth * 0.9, behavior: scrollBehavior() });
    },
  },
};
</script>
