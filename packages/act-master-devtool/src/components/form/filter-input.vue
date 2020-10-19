<template>
  <div class="field has-addons has-addons-centered">
    <p class="control">
      <input
        v-model="val"
        class="input is-small"
        type="text"
        placeholder="Filter requests"
      />
    </p>
    <p class="control">
      <button @click.prevent="val = ''" class="button is-primary is-small"> X </button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      required: true,
      type: String
    },
  },

  setup(props, { emit }) {
    const val = ref(props.modelValue);

    watch(val, (v) => {
      emit('update:modelValue', v);
    })

    return {
      val,
    };
  },
});
</script>
