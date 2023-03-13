<script setup>
import {ref} from 'vue'
import Content from './components/Content.vue'
import { getMods } from "@/assets/getMods.js"

const {ipcRenderer} = require('electron')

let showList = ref(false)
let modList = {}

ipcRenderer.on('modFolder',(e,f) =>{
  // modsList.value = getMods(f)
  modList = getMods(f)
  showList.value = true
  console.log(modList)
})
</script>

<template>
<div class="content-head"><h2>Information</h2></div>
<div class="list-head"><h2>Characters</h2></div>
<Content></Content>
<div class="character-list">
  <div v-if="showList">
    <li v-for="(mods, charName) in modList">
      {{ charName }} ({{ mods.length }})
    </li>
  </div>
  <div v-else>
    <h3>Add Mod Folder</h3>
  </div>
</div>
<footer>work in progress</footer>
</template>

<style scoped>
.content-head {
  grid-area: h1;
  padding: 1rem;
}
.list-head {
  grid-area: h2;
  padding: 1rem;
}
#app footer {
  grid-area: footer;
  text-align: right;
  padding: 1rem;
}
.content {
  padding: 2rem;
  grid-area: content;
  background: var(--vt-c-white-mute);
  color: var(--vt-c-black-soft);
}
.character-list {
  grid-area: sidebar;
  padding-left: 1rem;
}
</style>
