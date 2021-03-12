<template>
  <section class="appContent">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
          <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'appContent',
  computed: {
    cachedViews() {
        return this.$store.state.tagsView.cachedViews
    },
    key() {
        return this.$route.fullPath
      }
    }
}
</script>

<style scoped>
.appContent {
  width:100%;
  height: 100%;
}
</style>