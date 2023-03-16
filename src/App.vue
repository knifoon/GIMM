<script setup>
import {ref} from 'vue'
import Content from './components/Content.vue'
import { getMods } from "@/assets/getMods.js"
import { getGimi } from "@/assets/getGimi.js"
import log from 'electron-log/renderer';

log.info('Log from the renderer process');
const {ipcRenderer} = require('electron')
const Store = require('electron-store');

const settings = new Store();


let showList = ref(false)
let GBLink = ref(false)
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
ipcRenderer.on("handle-deep-link",link => {
  GBLink.value = true;
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
  <div v-if="showSetup">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
  </div>
  <div class="content-head" v-show="!showSetup"><h2>Information</h2></div>
<div class="list-head" v-show="!showSetup"><h2>Mod List</h2></div>

<div v-if="showSetup" class="setup">
  <div class="welk">
    <img src="/images/welk.png" alt="" >
    <img src="/images/welkbg.png" alt="" >
  </div>
  <div class="setup-content">
    <div v-if="GBLink"> Searching Game Banana </div>
    <strong>Mod Collection</strong>: a folder with all your mods, unzipped.
    <br>
    <strong>GIMI Mods</strong>: GIMI/3dmigoto's Mods folder.
  </div>
  <button @click="ipcRenderer.send('selectModFolder')" class="mod-button">Add Mod Collection</button>
  <button @click="ipcRenderer.send('selectGimiFolder')" class="gimi-button">Add GIMI Mods</button>
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
  position: relative;
  width: 400px;
  margin: auto;
  display: block;
}
.welk img {
  width: 100%;
}
.welk img:first-child {
  z-index: 2;
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
    height: 300px;
    width: 300px;
    left: 50px;
    top: 0;
    animation: rotate linear 50s infinite forwards;
    mix-blend-mode: screen;
    filter: hue-rotate(63deg);
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
