<template>
  <div id="app">
    <router-view />
  </div>
</template>



<script>
export default  {
  name:  'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
}
</script>
<style>
.navbar-static-side {
  background: #2f4050;
}

nav .logo {
  background-color: #367fa9;
}
/** 蓝色主题 skin-blue **/
.navbar, .skin-blue .navbar {
  background-color: #3c8dbc
}
</style>
