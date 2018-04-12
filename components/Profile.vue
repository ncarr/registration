<template>
  <v-card class="mb-3">
    <v-card-title primary-title class="headline">Profile</v-card-title>
    <v-card-text>
      <!-- Google auth goes here -->
      <v-text-field
        v-model="viewer.email"
        type="email"
        label="Email"
        :required="true"
      />
      <FormBuilder v-model="viewer" :fields="fields" />
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
  }
}
</script>
