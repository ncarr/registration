<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-if="done">
            <h1 class="headline">Email verification cancelled</h1>
            <p>The account's email has been reverted to the previous address.</p>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else>
            <h1 class="headline">Cancelling...</h1>
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
    await this.$axios.post(`verify/${this.$route.params.token}/cancel`)
    this.done = true
  }
}
</script>