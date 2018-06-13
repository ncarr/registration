<template>
  <v-text-field v-bind="$attrs" :value="value" @input="emitDelta" />
</template>

<script>
import Delta from 'quill-delta'
export default {
  props: ['value'],
  data: () => ({
    previous: undefined
  }),
  watch: {
    value (current) {
      this.previous = current
    }
  },
  methods: {
    emitDelta (current) {
      const value = this.previous || this.value
      this.previous = current
      this.$emit('input', current)
      const diff = new Delta().insert(value || '').diff(new Delta().insert(current))
      if (diff.ops.length !== 0) {
        this.$emit('delta', diff)
      }
    }
  }
}
</script>
