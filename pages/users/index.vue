<template>
  <v-app>
    <organizer-drawer v-model="drawer" />
    <v-toolbar app fixed>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title>Users</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex sm4 xs12 v-for="user in users" :key="user._id">
            <v-card nuxt :to="{ name: 'users-id', params: { id: user._id }}">
              <v-card-title class="subheading" v-text="user.name" />
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-btn
      fab
      fixed
      bottom
      right
      nuxt
      to="/users/new"
    >
      <v-icon>add</v-icon>
      <v-icon>close</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import OrganizerDrawer from '~/components/OrganizerDrawer'
export default {
  components: {
    OrganizerDrawer
  },
  async asyncData ({ app }) {
    const { data } = await app.$axios.get('/users')
    return { users: data }
  },
  data: () => ({
    drawer: undefined
  })
}
</script>