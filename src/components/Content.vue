<script setup>
import { marked } from "marked";
import {ref, defineEmits} from 'vue'

const emit = defineEmits(['updateGimi'])
const props = defineProps(['mods','characterName','activeMods'])
console.log('from content')
console.log(props.mods)
const {ipcRenderer} = require('electron')
const {readFileSync, readdirSync, rmSync, cpSync} = require('fs')

const Store = require('electron-store');

const settings = new Store();

const renderRM = (file) => marked.parse(readFileSync(file,'utf-8'));

let activeRM = ref('none');
let rmToggle = (rm) => {
if (activeRM.value == rm) activeRM.value = 'none'
else activeRM.value = rm
}
let compareMods = (p) => {
  if(props.activeMods[props.characterName]){
    let gimiMod = props.activeMods[props.characterName][0].path.split('/')
    let comp = p.split('/')
    let cur =  comp[comp.length -1]
    let active = gimiMod[gimiMod.length -1]
    console.log(`active : ${active} check : ${cur}`);
    if(cur == active) return true
  } else return false
}
let swapMods = (p) => {
  let comp = p.split('/')
  let cur =  comp[comp.length -1]
  if (props.activeMods[props.characterName]){
    rmSync(props.activeMods[props.characterName][0].path,{recursive: true})
  }
  cpSync(p,`${settings.get('gimiFolder')}/${cur}`,{recursive: true})
  emit('updateGimi')
}
</script>

<template>
  <div class="content">
    <div v-if="props.mods" class="readme">
      <h1>{{ props.characterName }}</h1>
    <li class="mod-li" v-for="item in props.mods">
      <div>
        {{ item.name }} <button v-if="item.readme" @click="rmToggle(item.name)">🔍</button>
        
        
        <button class="toggle" v-if="!compareMods(item.path)" @click="swapMods(item.path)">Enable</button>
        <span v-else>Active</span>
      </div>
    <div v-if="activeRM == item.name" v-html="renderRM(item.readme)"></div>
    </li>
    </div>
    <div v-else class="readme">
      <div class="info">
        <h3>Welcome!</h3>
        <p>
          This is still under development, so beware
          
          The goal of this project is to easily manage character skins in <a href="https://github.com/SilentNightSound/GI-Model-Importer">[GIMI]</a>
          choose a folder that has all your character skins, and the mod folder inside GIMI
        </p>
        <br>
        <span class="highlight">Please make sure all the mods you currently have inside GIMI are also in your mod folder, this tool will delete folders from the gimi mod folder when setting new mods to active</span>
      </div>

      <div v-if="settings.get('gimiFolder')"> Current GIMI folder: {{ settings.get('gimiFolder') }}</div>
      <div v-else>
        No GIMI folder set, please select the mods folder in your GIMI directory
        <button @click="ipcRenderer.send('selectGimiFolder')">Add GIMI mod Folder</button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.mod-li div:first-child{
  border: solid 1px #ddd;
  padding: 0.5rem ;
}
.mod-li div:nth-child(2){
  border: solid 1px #ddd;
  border-top: none;
  padding: 0.5rem ;
}
.toggle {
  float: right;
  background: rgb(81, 125, 108);
  padding: 5px;
}
.mod-li span {
  background: #5a6f98;
  color: var(--vt-c-white-mute);
  padding: 5px;
  float: right;
}
.info {
  margin-bottom: 2rem;
}
.info .highlight {
  display: inline-block;
  padding: 20px;
  font-weight: bold;
  background: #fdf196;
}
</style>
