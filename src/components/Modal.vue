<script setup>
import EditMod from './modals/EditMod.vue'
import Settings from './modals/Settings.vue';
import { ref } from 'vue';

defineEmits(['closeModal','reloadList','notify'])

const props = defineProps(['content'])
let nContent = ref('Saved!')
let nShow = ref(false)
const notify = () => {
nShow.value = true
setTimeout(() => {
  nShow.value = false
}, 500);
}
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
        <Transition>
          <div class="notification" v-if="nShow">{{ nContent }}</div>
        </Transition>
        <button @click="$emit('closeModal'),$emit('reloadList')" class="close-btn">
            {{'X'}}
        </button>
        <div class="content">
          <header>
          </header>
          <div v-if="props.content">
            <Settings :json="props.content.settings" v-if="props.content.settings" @notify="notify"></Settings>
            <EditMod :json="props.content.editMod" v-if="props.content.editMod"></EditMod>
          </div>
          <slot v-else></slot>
        </div>
    </div>
    </div>
</template>
<style scoped>
.notification {
  position: absolute;
  display: inline-block;
  padding: 10px 100px;
  background-color: rgb(127 255 212 / 65%);
  font-weight: bold;
  left: 50%;
  transform: translateX(-50%);

}
.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
}
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
    text-align: center;
    z-index: 110;
    overflow-y: scroll;
}

.content {
  display: inline-block;
  text-align: left;
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