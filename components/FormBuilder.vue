<template>
  <v-card class="mb-3">
    <v-card-title class="headline" v-if="title" v-text="title" />
    <v-card-text>
      <v-form>
        <template v-for="(field, i) of fields">
          <v-select
            v-if="field.type === 'select'"
            v-model="data[field.name]"
            @input="value => $emit('update', { field: field.name, value })"
            :label="label(field)"
            :items="field.items"
            :combobox="field.combobox"
            :disabled="disabled || field.disabled"
            :required="!field.optional"
            :key="i"
          />
          <v-quill
            v-else
            v-model="data[field.name]"
            @delta="delta => $emit('update', { field: field.name, delta })"
            :key="i"
            :type="field.type"
            :label="label(field)"
            :disabled="disabled || field.disabled"
            :required="!field.optional"
            :multi-line="field.multiLine"
            :autocomplete="field.autocomplete"
          />
        </template>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import startCase from 'lodash.startcase'
import VQuill from '~/components/VQuill'
export default {
  components: {
    VQuill
  },
  props: {
    fields: {
      type: Array,
      default: () => ([])
    },
    value: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
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
