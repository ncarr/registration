<template>
  <v-app>
    <organizer-drawer v-model="drawer" />
    <v-toolbar app fixed>
      <v-btn icon nuxt to="/log">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title v-text="action.message || `${action.method} ${action.endpoint}`">Audit log</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-flex sm6 offset-sm3 xs12>
        <v-card>
          <v-card-text>
            <p v-text="action.user.name" />
            <p v-text="action.user.email" />
            <v-subheader>Method</v-subheader>
            <p v-text="action.method" />
            <v-subheader>Endpoint</v-subheader>
            <p v-text="action.endpoint" />
            <template v-if="action.before">
              <v-subheader>State before change</v-subheader>
              <code v-text="action.before" />
            </template>
            <template v-if="action.after">
              <v-subheader>Change made</v-subheader>
              <code v-text="action.after" />
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
import OrganizerDrawer from '~/components/OrganizerDrawer'
export default {
  components: {
    OrganizerDrawer
  },
  async asyncData ({ app, params }) {
    const { data } = await app.$axios.get(`/log/${params.id}`)
    return { action: data }
  },
  data: () => ({
    drawer: undefined
  })
}
</script>