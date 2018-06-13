<template>
  <v-card class="mb-3" v-if="!checkEmail">
    <v-card-title primary-title class="headline">Sign in</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="email"
        type="email"
        label="Email"
        autocomplete="email"
        :required="true"
        :disabled="!!viewer"
      />
      <v-btn v-if="dirty && !viewer" @click="signIn">Next</v-btn>
      <div class="g-signin2 mb-2" data-onsuccess="onSignIn"></div>
      <p>Connecting with Google allows you to skip email verification and checking your email every time you sign in.</p>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-flex text-xs-center sm6 offset-sm3 xs12>
      <h1 class="headline">Sign-in link sent</h1>
      <p>Click the link in your email within the next 15 minutes to sign in to LunarHacks and edit your saved application.</p>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    emailInternal: '',
    dirty: false,
    checkEmail: false
  }),
  computed: {
    viewer: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    email: {
      get () {
        return this.emailInternal || this.viewer.email
      },
      set (value) {
        this.emailInternal = value
      }
    }
  },
  watch: {
    email () {
      this.dirty = true
    }
  },
  methods: {
    async signIn () {
      const { status, data } = await this.$axios.post('/signin/email', { email: this.email })
      if (status === 201) {
        this.viewer = data
      } else {
        this.checkEmail = true
      }
    }
  },
  mounted () {
    window.onSignIn = async googleUser => {
      if (!this.viewer.googleID) {
        this.signin = false
        await this.$axios.post('/signin/google/token', { token: googleUser.getAuthResponse().id_token })
        // Download application
        const { data } = await this.$axios.get('/users/me')
        this.viewer = data
      }
    }
  }
}
</script>
