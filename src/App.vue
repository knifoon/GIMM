<script setup>
import {ref} from 'vue'
import Content from './components/Content.vue'
import { getMods } from "@/assets/getMods.js"
import { getGimi } from "@/assets/getGimi.js"

const {ipcRenderer} = require('electron')
const Store = require('electron-store');

const settings = new Store();


let showList = ref(false)
let modList = {}
let currentContent = ref(null)
let currentCharacter = ref(null)

let listRender = (f) =>{let unsorted = getMods(f)
  modList = Object.keys(unsorted).sort().reduce((m,name) => ({ ...m, [name]: unsorted[name]}), {});
  showList.value = true}
let activeMods = ref(null)
let updateGimi = () => {
  activeMods.value = getGimi(settings.get('gimiFolder'))
  console.log(activeMods);
}
if(settings.get('modFolder')) listRender(settings.get('modFolder'))
if(settings.get('gimiFolder')) updateGimi()

ipcRenderer.on('modFolder',(e,f) =>{
  settings.set('modFolder', f)
  listRender(f)
})
ipcRenderer.on('gimiFolder',(e,f) =>{
  settings.set('gimiFolder', f)
  activeMods.value = getGimi(f)
})

const changeContent = (con,char) => {
  if(settings.get('gimiFolder')){
    currentContent.value = con
    currentCharacter.value = char
  }
}

const resetFolders = () => {
  settings.delete('gimiFolder')
  settings.delete('modFolder')
  showList.value = false;
  currentContent.value = null;
}
</script>

<template>
<div class="content-head"><h2>Information</h2></div>
<div class="list-head"><h2>Characters</h2></div>
<Content :mods="currentContent" :characterName="currentCharacter" :activeMods="activeMods" v-on:updateGimi="updateGimi"></Content>
<div class="character-list">
  <div v-if="showList">
    <li v-for="(mods, charName) in modList" @click="changeContent(mods,charName)"
    :class="{active: charName == currentCharacter}">
      {{ charName }} ({{ mods.length }})
    </li>
  </div>
  <div v-else>
    <button @click="ipcRenderer.send('selectModFolder')">Add Mod Folder</button>
  </div>
</div>
<footer>
  <button @click="resetFolders">Reset Folders</button>
  work in progress</footer>
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
  overflow-y: scroll;
}
.character-list {
  grid-area: sidebar;
  padding-left: 1rem;
  overflow-y: scroll;
}
.character-list li {
  cursor: pointer;
}
.character-list li:hover {
  color: #fff;
}
.character-list .active {
  color: #fff;
  font-weight: bold;
}
</style>
