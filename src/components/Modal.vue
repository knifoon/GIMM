<script setup>
import EditMod from './modals/EditMod.vue'
import Settings from './modals/Settings.vue';

defineEmits(['closeModal','reloadList'])

const props = defineProps(['content'])
</script>
<template>
    <div class="modal">
    <div class="starmap">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>  
    <div class="welk">
    <img src="/images/welk.png" alt="" >
    <img src="/images/welkbg.png" alt="" >
    </div>
    <div class="wrap">
        <div class="content">
          <header>
            <button @click="$emit('closeModal'),$emit('reloadList')">
            {{'<back'}}
            </button>
          </header>
          <div v-if="props.content">
            <Settings :json="props.content.settings" v-if="props.content.settings"></Settings>
            <EditMod :json="props.content.editMod" v-if="props.content.editMod"></EditMod>
          </div>
          <slot v-else></slot>
        </div>
    </div>
    </div>
</template>
<style scoped>
.modal {
    position: absolute;
    height: 100vh;
    width: 100vw;
    z-index: 100;
    background: radial-gradient(ellipse at bottom,#30272c 0%,var(--color-background));
    overflow: hidden;
}
.wrap{
    height: 100%;
    width: 100%;
    z-index: 110;
    overflow-y: scroll;
}
.content {
  margin: 8% auto 0;
  width: 80%;
}
.starmap {
    position: absolute;
    filter: blur(4px);
}
.welk {
    height: 100vh;
    position: absolute;
    right: 0;
    transform: translate(50%);
    filter: blur(4px);
    opacity: 69%;
}
.welk img {
  height: 100%;
}
.welk img:first-child {
  z-index: 102;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}
.welk img:nth-child(2) {
  position: absolute;
  left: 125px;
  top: 0;
    animation: rotate linear 50s infinite forwards;
    mix-blend-mode: screen;
    filter: hue-rotate(63deg);
}
button {
    font-weight: bold;
}
</style>