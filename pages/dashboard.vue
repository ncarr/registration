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
              <v-card-text v-if="status === 0">In progress</v-card-text>
              <v-card-text v-else-if="status === 1">Under review</v-card-text>
              <v-card-text v-else-if="status === 2">Rejected</v-card-text>
              <v-card-text v-else-if="status === 3">Accepted</v-card-text>
              <v-card-text v-else-if="status === 4">
                Can't come 
                <v-btn flat @click="rsvpOpen = true">Change</v-btn>
              </v-card-text>
              <v-card-text v-else-if="status === 5">
                Going
                <v-btn flat @click="rsvpOpen = true">Change</v-btn>
              </v-card-text>
                <v-card-text v-if="status === 3 || rsvpOpen">
                  <h3 class="headline">RSVP</h3>
                  <v-btn @click="rsvp(true)">Going</v-btn>
                  <v-btn @click="rsvp(false)">Can't come</v-btn>
                </v-card-text>
              <v-card-actions>
                <v-btn v-if="status === 0" nuxt :to="{ name: 'apply' }">Finish your application</v-btn>
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
    const { data } = await app.$axios.get('/users/me?fields=dashboard')
    return data
  },
  data: () => ({
    drawer: undefined,
    rsvpOpen: false
  }),
  methods: {
    async rsvp (going) {
      this.rsvpOpen = false
      await this.$axios.post('/users/me/rsvp', { going })
      this.status = 4 + going
    }
  }
}
</script>