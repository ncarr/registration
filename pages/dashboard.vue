<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12>
            <h1>Dashboard</h1>
            <v-card>
              <v-card-title class="headline">LunarHacks Application</v-card-title>
              <v-card-text v-if="data === 0">In progress</v-card-text>
              <v-card-text v-else-if="data === 1">Under review</v-card-text>
              <v-card-text v-else-if="data === 2">Rejected</v-card-text>
              <v-card-text v-else-if="data === 3">Accepted</v-card-text>
              <v-card-text v-else-if="data === 4">Can't come</v-card-text>
              <v-card-text v-else-if="data === 5">Going</v-card-text>
              <v-card-actions>
                <v-btn v-if="data === 0" nuxt :to="{ name: 'apply' }">Finish your application</v-btn>
                <v-btn v-else nuxt :to="{ name: 'apply' }">View your application</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  async asyncData ({ app }) {
    const { data } = await app.$axios.get('/users/me/application/status')
    return data
  },
  data: () => ({
    data: 0
  })
}
</script>