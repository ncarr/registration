<template>
  <v-app>
    <v-toolbar app fixed flat color="transparent" v-if="signedIn">
      <v-btn icon nuxt :to="{ name: 'dashboard' }">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-if="!submitted && !sent">
            <Profile v-model="application" @emailBlur="checkEmail" @signin="sent = true" :signin="signin" />
            <Application v-model="application" :disabled="signin" />
            <v-btn v-if="saving" flat color="secondary">Saving...</v-btn>
            <v-btn v-else-if="saved" flat color="secondary">Saved</v-btn>
            <v-btn v-else flat color="secondary" @click="save" :disabled="signin">Save</v-btn>
            <v-btn color="primary" @click="submit" :disabled="signin">Submit</v-btn>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else-if="!sent">
            <h1 class="headline">Submitted!</h1>
            <v-btn nuxt :to="{ name: 'dashboard' }">Go to dashboard</v-btn>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else>
            <h1 class="headline">Sign-in link sent</h1>
            <p>Click the link in your email within the next 15 minutes to sign in to LunarHacks and edit your saved application.</p>
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
  async asyncData ({ app }) {
    try {
      const { data } = await app.$axios.get('/users/me')
      return { application: data, signedIn: true }
    } catch (e) {
      return { application: {}, signedIn: false }
    }
  },
  data: () => ({
    application: {},
    saving: false,
    saved: true,
    sent: false,
    signin: false,
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
    },
    async checkEmail () {
      try {
        await this.$axios.post('/signin/checkemail')
        this.signin = false
      } catch (e) {
        this.signin = true
      }
    }
  },
  watch: {
    application () {
      this.saved = false
    }
  },
  mounted () {
    window.onSignIn = async googleUser => {
      if (!this.application.googleID) {
        this.signin = false
        await this.$axios.post('/signin/google/token', { token: googleUser.getAuthResponse().id_token })
        // Download application
        const { data } = await this.$axios.get('/users/me')
        this.application = data
      }
    }
  },
  head: {
    script: [
      { src: 'https://apis.google.com/js/platform.js' }
    ],
    meta: [
      { name: 'google-signin-client_id', content: process.env.GOOGLE_CLIENT_ID }
    ]
  }
}
</script>
