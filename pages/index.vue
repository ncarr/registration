<template>
  <v-app>
    <h1>LunarHacks</h1>
    <v-btn nuxt :to="{ name: 'dashboard' }" v-if="signedIn">Go to dashboard</v-btn>
    <template v-else>
      <v-btn nuxt :to="{ name: 'apply' }">Apply</v-btn>
      <v-btn nuxt :to="{ name: 'signin' }">Sign in</v-btn>
    </template>
  </v-app>
</template>

<script>
export default {
  async asyncData ({ app }) {
    const { data } = await app.$axios.get('/users/me/signedin')
    return data
  }
}
</script>
