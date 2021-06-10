<template>
<div>
  <div :key="cobranca.id" v-for="cobranca in cobrancas">
    <Cobranca
      @pagar-cobranca="$emit('pagar-cobranca', cobranca.id)"
      @negar-cobranca="$emit('negar-cobranca', cobranca.id)"
      :cobranca="cobranca"
    />
  </div>
</div>
</template>

<script>
import Cobranca from './Cobranca.vue'

export default {
  name: 'Cobrancas',
  props: {
    cobrancas: Array,
  },
  components: {
    Cobranca,
  },
  emits: ['pagar-cobranca', 'negar-cobranca'],
}
</script>