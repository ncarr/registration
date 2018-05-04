<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex sm6 offset-sm3 xs12>
            <h1>USERS</h1>
              <v-card v-for="(user, index) in users" :key="index">
                <nuxt-link :to="{ name: 'id', params: { id: index }}">
                  {{ user.name }}
                </nuxt-link>
              </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    let { data } = await axios.get('/api/users')
    return { users: data }
  },
  head () {
    return {
      title: 'Users'
    }
  }
}
</script>