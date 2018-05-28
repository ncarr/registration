<template>
  <v-app>
    <organizer-drawer v-model="drawer" />
    <v-toolbar app fixed>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title>Audit log</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-list two-line>
        <v-list-tile :key="action._id" v-for="action in log" nuxt :to="{ name: 'log-id', params: { id: action._id }}">
          <v-list-tile-content>
            <v-list-tile-title v-text="action.message || `${action.method} ${action.endpoint}`"></v-list-tile-title>
            <v-list-tile-sub-title v-if="!action.message" v-text="action.user.name"></v-list-tile-sub-title>
            <v-list-tile-sub-title v-else><span v-text="action.user.name" /> | <span>{{action.method}} {{action.endpoint}}</span></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
    const { data } = await app.$axios.get('/log')
    return { log: data }
  },
  data: () => ({
    drawer: undefined
  })
}
</script>