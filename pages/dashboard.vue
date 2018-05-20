<template>
  <v-app>
    <organizer-drawer v-if="roles.includes('organizer')" v-model="drawer" />
    <v-toolbar app fixed>
      <v-toolbar-side-icon v-if="roles.includes('organizer')" @click="drawer = !drawer" />
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer />
      <v-btn icon nuxt :to="{ name: 'settings' }">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12>
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
import OrganizerDrawer from '~/components/OrganizerDrawer'
export default {
  components: {
    OrganizerDrawer
  },
  async asyncData ({ app }) {
    const { data } = await app.$axios.get('/users/me/dashboard')
    return data
  },
  data: () => ({
    drawer: undefined
  })
}
</script>