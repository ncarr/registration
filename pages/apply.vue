<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-if="!submitted">
            <Profile v-model="application" />
            <Application v-model="application" />
            <v-btn v-if="saving" flat color="secondary">Saving...</v-btn>
            <v-btn v-else-if="saved" flat color="secondary">Saved</v-btn>
            <v-btn v-else flat color="secondary" @click="save">Save</v-btn>
            <v-btn color="primary" @click="submit">Submit</v-btn>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else>
            <h1 class="headline">Submitted!</h1>
            <v-btn nuxt :to="{ name: 'dashboard' }">Go to dashboard</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Profile from '~/components/Profile'
import Application from '~/components/Application'

export default {
  components: {
    Profile,
    Application
  },
  data: () => ({
    application: {},
    saving: false,
    saved: true,
    submitted: false
  }),
  methods: {
    async save () {
      this.saving = true
      await this.$axios.patch('/users/me', this.application)
      this.saving = false
      this.saved = true
    },
    async submit () {
      await this.save()
      await this.$axios.post('/users/me/application/submit')
      this.submitted = true
    }
  },
  watch: {
    application () {
      this.saved = false
    }
  }
}
</script>
