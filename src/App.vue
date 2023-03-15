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
  if(settings.get('gimiFolder')) showSetup.value = false
})
ipcRenderer.on('gimiFolder',(e,f) =>{
  settings.set('gimiFolder', f)
  activeMods.value = getGimi(f)
  if(settings.get('modFolder')) showSetup.value = false
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
  showSetup.value = true;
  currentContent.value = null;
}

let showSetup = ref(true)
if(settings.get('gimiFolder') && settings.get('modFolder')) showSetup.value=false
</script>
<template>
<div class="content-head" v-show="!showSetup"><h2>Information</h2></div>
<div class="list-head" v-show="!showSetup"><h2>Characters</h2></div>

<div v-if="showSetup" class="setup">
  <img class= "welk" src="/images/gimmbg.png" alt="" >
  <div class="setup-content">
    Please add your a folder with all your mods, unzipped.
    And Add GIMI/3dmigoto's Mods folder.
  </div>
  <button @click="ipcRenderer.send('selectModFolder')" class="mod-button">Add Mod Folder</button>
  <button @click="ipcRenderer.send('selectGimiFolder')" class="gimi-button">Add GIMI mod Folder</button>
  </div>
<Content v-if="!showSetup" :mods="currentContent" :characterName="currentCharacter" :activeMods="activeMods" v-on:updateGimi="updateGimi"></Content>
<div v-if="!showSetup" class="character-list">
  <div v-if="showList">
    <li v-for="(mods, charName) in modList" @click="changeContent(mods,charName)"
    :class="{active: charName == currentCharacter}">
      {{ charName }} ({{ mods.length }})
    </li>
  </div>
</div>
<footer v-show="!showSetup">
  <button @click="resetFolders">Reset Folders</button>
  work in progress</footer>
</template>

<style scoped>
.setup {
  width: 80%;
  margin: auto;
  display: grid;
  padding: 1rem;
  grid-column-start: content;
  grid-row-start: content;
  grid-column-end: sidebar;
  grid-row-end: sidebar;
  text-align: center;
  grid-template-areas: 
    "img img"
    "content content"
    "modbutton gimibutton";
  
}
.welk {
  grid-area: img;
  width: 400px;
  margin: auto;
  display: block;
}
.setup button {
  cursor: pointer;
  background: #333035;
  color: var(--vt-c-white-mute);
  padding: 10px;
  border: none;
  border-radius: 3px;
  width: 200px;
  margin: auto;
}
.setup button:hover {
  background: #413E44;
}
.setup-content {
  grid-area: content;
  padding: 2rem;
}
.mod-button {
  grid-area: modbutton;
}
.gimi-button {
  grid-area: gimibutton;
}
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
