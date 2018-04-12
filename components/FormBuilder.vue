<template>
  <v-form>
    <v-text-field
      v-for="(field, i) of fields"
      v-model="data[field.name]"
      @input="data => $emit('field:input', { name: field.name, data })"
      :key="i"
      :type="field.type"
      :label="label(field)"
      :disabled="field.disabled"
      :required="!field.optional"
      :multi-line="field.multiLine"
    />
  </v-form>
</template>

<script>
import startCase from 'lodash.startcase'
export default {
  props: {
    fields: {
      type: Array,
      default: () => ([])
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    data: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    label: field => field.label || startCase(field.name)
  }
}
</script>
