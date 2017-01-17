<script>
  import MyFooter from '~components/Footer.vue'

  export default {
    components: {
      MyFooter
    }
  }
</script>

<template>
  <div>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link to="/" class="navbar-brand">Test technique Totem</router-link>
        </div>
      </div>
    </nav>
    <nuxt/>
    <my-footer/>
  </div>
</template>
