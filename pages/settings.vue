<template>
  <v-app>
    <v-toolbar app fixed>
      <v-btn icon nuxt :to="{ name: 'dashboard' }">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout>
          <v-flex offset-sm3 sm6 xs12>
            <v-card>
              <v-card-text>
                <v-subheader>Email settings</v-subheader>
                <v-text-field
                  label="Email"
                  v-model="me.email"
                  :readonly="!changing"
                />
                <v-btn v-if="!changing" @click="changing = true">Change</v-btn>
                <v-btn v-if="changing" @click="changeEmail">Save</v-btn>
                <p v-if="!me.emailVerified">Email unverified - Check your new email for a verification link and click it to verify this email.</p>
                <v-btn @click="resend" v-if="!me.emailVerified">Resend verification email</v-btn>
                <v-switch label="Enable sign-in through email links" v-model="me.emailSignInEnabled" @change="emailSignIn" />
                <v-subheader>Google account</v-subheader>
                <span v-if="google" v-text="google" />
                <v-btn v-if="!google" @click="connectGoogle">Connect</v-btn>
                <v-btn v-else @click="disconnectGoogle">Disconnect</v-btn>
                <p v-text="googleError" />
                <v-switch label="Enable Google sign-in" v-model="me.googleSignInEnabled" @change="googleSignIn" />
                <p>If a Google account is not currently connected, if enabled this will still allow you to connect and sign in with the account with a corresponding email</p>
                <v-subheader>General</v-subheader>
                <v-btn @click="signOut">Sign out</v-btn>
                <v-btn @click="signOutOther">Sign out all other devices</v-btn>
              </v-card-text>
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
    const { data } = await app.$axios.get('/users/me?fields=settings')
    return { me: data }
  },
  data: () => ({
    me: {},
    changing: false,
    google: false,
    googleError: '',
    auth2: null
  }),
  methods: {
    async changeEmail () {
      await this.$axios.put('/users/me/email', { email: this.email })
      this.me.emailVerified = false
      this.changing = false
    },
    async resend () {
      await this.$axios.post('/users/me/resendverification')
    },
    async connectGoogle () {
      try {
        this.googleError = ''
        const googleUser = await this.auth2.signIn()
        await this.$axios.post('/signin/google/token', { token: googleUser.getAuthResponse().id_token })
        this.google = googleUser.getBasicProfile().getEmail()
      } catch (e) {
        this.googleError = e
      }
    },
    async disconnectGoogle () {
      try {
        this.googleError = ''
        this.auth2.disconnect()
        await this.$axios.delete('/users/me/google')
      } catch (e) {
        this.googleError = e
      }
    },
    async signOut () {
      await this.$axios.post('/signout')
      await this.auth2.signOut()
      this.$router.push('/')
    },
    async signOutOther () {
      await this.$axios.post('/signoutother')
    },
    async emailSignIn () {
      await this.$axios.put('/users/me/signin/email', { enabled: this.me.emailSignIn })
    },
    async googleSignIn () {
      await this.$axios.put('/users/me/signin/google', { enabled: this.me.googleSignIn })
    }
  },
  mounted () {
    window.gapi.load('auth2', async () => {
      this.auth2 = await window.gapi.auth2.init({
        client_id: process.env.GOOGLE_CLIENT_ID
      })
      this.google = this.auth2.isSignedIn.get() && this.auth2.currentUser.get().getBasicProfile().getEmail()
    })
  }
}
</script>
