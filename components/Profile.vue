<template>
  <v-card class="mb-3">
    <v-card-title primary-title class="headline">Profile</v-card-title>
    <v-card-text>
      <div class="g-signin2" data-onsuccess="onSignIn"></div>
      <v-text-field
        v-model="viewer.email"
        type="email"
        label="Email"
        autocomplete="email"
        :required="true"
        @blur="$emit('emailBlur')"
      />
      <v-btn v-if="signin" @click="email">Email me a sign-in link</v-btn>
      <p v-if="signin">You have already saved a draft of an application with this email. Please sign in to view the saved copy.</p>
      <FormBuilder v-model="viewer" :fields="fields" :disabled="signin" />
    </v-card-text>
  </v-card>
</template>

<script>
import { fields } from '~/forms/profile'
import FormBuilder from '~/components/FormBuilder'

export default {
  components: { FormBuilder },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    signin: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({ fields }),
  computed: {
    viewer: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    async email () {
      await this.$axios.post('/signin', { email: this.email })
      this.$emit('signin')
    }
  }
}
</script>
