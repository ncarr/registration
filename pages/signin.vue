<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex text-xs-center sm6 offset-sm3 xs12>
            <v-card v-if="sent">
              <v-card-title class="headline">Request sent!</v-card-title>
              <v-card-text>
                Check your email! Open that link within 15 minutes on as many devices as you need to sign in. You can close this tab.
              </v-card-text>
            </v-card>
            <v-card v-else>
              <v-card-title class="headline">Sign in</v-card-title>
              <v-card-text>
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
                <v-text-field label="Email" v-model="email" />
                <p v-if="error" v-text="error" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="signin">Send sign-in link</v-btn>
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
  data: () => ({
    email: '',
    error: '',
    sent: false
  }),
  methods: {
    async signin () {
      await this.$axios.post('/signin', { email: this.email })
      this.sent = true
    }
  },
  mounted () {
    window.onSignIn = async googleUser => {
      try {
        await this.$axios.post('/signin/google/token', { token: googleUser.getAuthResponse().id_token })
        this.$router.push({ name: 'dashboard' })
      } catch (e) {
        this.error = 'The Google account email is not verified. Please sign in first with your email and then connect your Google account in settings.'
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