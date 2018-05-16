<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-if="done">
            <h1 class="headline">Application submitted</h1>
            <p>Your email has also been verified.</p>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else>
            <h1 class="headline">Submitting...</h1>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    done: false
  }),
  async mounted () {
    await this.$axios.post(`submit/${this.$route.params.token}`)
    this.done = true
  }
}
</script>