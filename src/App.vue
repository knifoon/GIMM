<script setup>
import { ref } from 'vue'
import Content from './components/Content.vue'
import Setup from './components/Setup.vue'
import { getMods } from "@/assets/getMods.js"
import { getGimi } from "@/assets/getGimi.js"
import log from 'electron-log/renderer';
import Modal from './components/Modal.vue'

const { version } = require('../package.json');
const { ipcRenderer } = require('electron')
const Store = require('electron-store');
const settings = new Store();


let GBLink = ref(false)
let modList = {}
let currentContent = ref(null)
let currentCharacter = ref(null)

let defaultGeneral = {
      "Show Author": true,
      "Show Mod Count": true,
      "Show Preview Thumbnail": true
}
if(!settings.get('general')) settings.set('general',defaultGeneral)
const overRep = (n) => {
  if(settings.get('overrides')[n.toLowerCase()]) return settings.get('overrides')[n.toLowerCase()]
  return n
}
let listRender = (f) =>{
  let unsorted = getMods(f)
  let incompatible = unsorted[overRep('Incompatible')]
  delete unsorted[overRep('Incompatible')]
  modList = Object.keys(unsorted).sort().reduce((m,name) => ({ ...m, [name]: unsorted[name]}), {});
  if(incompatible) modList[overRep('Incompatible')] = incompatible
}
let activeMods = ref(null)
let updateGimi = () => {
  activeMods.value = getGimi(settings.get('gimiFolder'))
  console.log('gimi updated');
  console.log(activeMods.value)
}
if(settings.get('modFolder')) listRender(settings.get('modFolder'))
if(settings.get('gimiFolder')) updateGimi()

ipcRenderer.on('modFolder',(e,f) =>{
  settings.set('modFolder', f)
  listRender(f)
  if(settings.get('gimiFolder')) {
    if(settings.get('modFolder') == settings.get('gimiFolder')) {
      settings.delete('modFolder')
      dupe.value = true
    }
    else showSetup.value = false
  } 
})
ipcRenderer.on('gimiFolder',(e,f) =>{
  settings.set('gimiFolder', f)
  activeMods.value = getGimi(f)
  if(settings.get('modFolder')) {
    if(settings.get('modFolder') == settings.get('gimiFolder')){
       settings.delete('gimiFolder')
       dupe.value = true
      }
    else showSetup.value = false
  }
})
ipcRenderer.on("handle-deep-link",link => {
  GBLink.value = true;
})
ipcRenderer.on("resetFolders",link => {
  resetFolders()
})
ipcRenderer.on('edit-mod', (e, data) => {
  modalContent.value = {"editMod" : data}
  modal.value =  true;
})
ipcRenderer.on('settings', (e, data) => {
  modalContent.value = {"settings" : true}
  modal.value =  true;
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
  showSetup.value = true;
  currentContent.value = null;
  currentCharacter.value = null;
}

let showSetup = ref(true)
if(settings.get('gimiFolder') && settings.get('modFolder')) showSetup.value=false
let modal = ref(false)
let modalContent = ref(null)

const reloader = () => {
  listRender(settings.get('modFolder'))
  if(currentCharacter) currentContent.value = modList[currentCharacter.value]
  updateGimi();
}
let dupe = ref(false)
</script>

<template>
  <Transition name="fast">
    <Modal v-if="modal" :content="modalContent" @closeModal="modal = false" @reloadList="reloader()"/>
  </Transition>
  <Transition>
    <div class="starmap" v-if="showSetup">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>  
  </Transition>

<div class="content-head" v-show="!showSetup">
  <h2>Information</h2>
</div>
<div class="list-head" v-show="!showSetup"><h2>Mod List</h2></div>
  <Setup v-if="showSetup" :dupe="dupe"/>
<Content v-if="!showSetup" :key="reloader" :mods="currentContent" :characterName="currentCharacter" :activeMods="activeMods" v-on:updateGimi="updateGimi"></Content>
<div v-if="!showSetup" class="character-list">
  <div>
    <li v-for="(mods, charName) in modList" @click="changeContent(mods,charName)"
    :class="{active: charName == currentCharacter}">
      {{ charName }} 
      <span v-if="mods && settings.get('general')['Show Mod Count']">
        ({{ mods.length }})
      </span>
    </li>
  </div>
</div>
<footer v-show="!showSetup">
  {{ version }} --  by <a href="http://twitter.com/knifoon">Knifoon</a>
  </footer>
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
  background: #3d3d3d;
  /* color: var(--vt-c-black-soft); */
  overflow-y: scroll;
  border-radius: 0 10px 10px 0;
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
.starmap {
  position: absolute;
}
</style>
