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
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-if="!submitted">
            <SignIn v-model="application" @input="signedIn = true" />
            <FormBuilder title="Profile" v-model="application" :fields="profileFields" :disabled="!signedIn" @update="sendUpdate" />
            <FormBuilder title="Application" v-model="application" :fields="applicationFields" :disabled="!signedIn || application.status > 0" @update="sendUpdate" />
            <p v-if="signedIn">All changes are saved in the cloud</p>
            <v-btn v-if="application.status === 0" color="primary" @click="submit" :disabled="!signedIn">Submit</v-btn>
            <template v-else-if="signedIn">
              <v-btn @click="unsubmit">Unsubmit</v-btn>
              <p>Note: you will lose your spot in the queue if you unsubmit</p>
            </template>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else-if="application.emailVerified">
            <h1 class="headline">Submitted!</h1>
            <v-btn nuxt :to="{ name: 'dashboard' }">Go to dashboard</v-btn>
          </v-flex>
          <v-flex text-xs-center sm6 offset-sm3 xs12 v-else>
            <h1 class="headline">One last step!</h1>
            <p>Check your email for a confirmation link, then your application will be submitted.</p>
            <v-btn nuxt :to="{ name: 'dashboard' }">Go to dashboard</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Delta from 'quill-delta'
import SignIn from '~/components/SignIn'
import FormBuilder from '~/components/FormBuilder'
import profile from '~/forms/profile'
import application from '~/forms/application'

export default {
  components: {
    SignIn,
    FormBuilder
  },
  async asyncData ({ app }) {
    try {
      const { data } = await app.$axios.get('/users/me')
      // Please change this ugly hack back to { application: data } when Vue 2.5.17 is released
      return { application: { ...[...profile.fields, ...application.fields].reduce((o, field) => ({ ...o, [field.name]: '' }), {}), ...data }, signedIn: true }
    } catch (e) {
      // Change this back to null too
      return { application: [...profile.fields, ...application.fields].reduce((o, field) => ({ ...o, [field.name]: '' }), {}), signedIn: false }
    }
  },
  data: () => ({
    socket: null,
    submitted: false,
    profileFields: profile.fields,
    applicationFields: application.fields
  }),
  methods: {
    async submit () {
      // await this.save()
      await this.$axios.post('/users/me/application/submit')
      this.submitted = true
    },
    async unsubmit () {
      await this.$axios.post('/users/me/application/unsubmit')
      this.application.status = 0
    },
    sendUpdate (update) {
      this.socket.emit('update', update)
    }
  },
  mounted () {
    const io = require('socket.io-client')
    this.socket = io('/application')
    this.socket.on('update', ({ field, delta, value }) => {
      if (delta) {
        this.application[field] = new Delta().insert(this.application[field] || '').compose(delta).reduce((text, { insert }) => text + insert, '')
      } else {
        this.application[field] = value
      }
    })
  }
}
</script>
