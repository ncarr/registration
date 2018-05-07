<template>
  <v-card>
    <v-card-title primary-title class="headline">Application</v-card-title>
    <v-card-text>
      <FormBuilder v-model="application" :fields="fields" :disabled="disabled" />
    </v-card-text>
  </v-card>
</template>

<script>
import { fields } from '~/forms/application'
import FormBuilder from '~/components/FormBuilder'

export default {
  components: { FormBuilder },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({ fields }),
  computed: {
    application: {
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
