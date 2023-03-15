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
console.log('mods!!!')
console.log(props.activeMods)
let rmMod = () => {
  rmSync(props.activeMods[props.characterName][0].path,{recursive: true})
  emit('updateGimi')
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
    <div v-if="props.mods">
      <header>
        <div>{{ props.characterName }}</div>
        <button class="disable" v-if="props.activeMods[props.characterName]" @click="rmMod">Disable</button>
      </header>
    <li class="mod-li" v-for="item in props.mods">
      <div class="mod-info">
        <span class="mod-name">{{ item.name }}</span>
        <button v-if="item.readme" @click="rmToggle(item.name)" class="rm-toggle"><img src="/images/info.svg" title="readme"></button>
        <button class="toggle" v-if="!compareMods(item.path)" @click="swapMods(item.path)">Enable</button>
        <span v-else class="active-mod">Active</span>
      </div>
    <div class="readme" v-if="activeRM == item.name" v-html="renderRM(item.readme)"></div>
    </li>
    </div>
    <div v-else>
      <div class="info">
        <h3>Welcome!</h3>
        <p>
          This is still under development, so beware
          <br>
          The goal of this project is to easily manage character skins in <a href="https://github.com/SilentNightSound/GI-Model-Importer">[GIMI]</a>
          <br>
          <br>
          Both folders you've added should be different. If you've made a mistake, you can reset the folders by clicking the button on the bottom right.
          <br>
          <br>
          If you have any issues, check out the <a href="http://gamebanana.com/tools/12471">gamebanana page</a>
        </p>
        <span class="highlight">Please make sure all the mods you currently have inside GIMI are also in your mod folder, this tool will delete folders from the gimi mod folder when setting new mods to active</span>
      </div>

      <div v-if="settings.get('gimiFolder')"> Current GIMI folder: {{ settings.get('gimiFolder') }}</div>
    </div>
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: flex-start;
  padding: 10px;
}
header div {
  flex-grow: 1;
  font-size: 24px;
  font-weight: bold;
}
.mod-li:last-child div:first-child{
border-bottom: solid 1px #ddd;
}
.mod-li div:first-child{
  border: solid 1px #ddd;
  border-bottom: none;
  padding: 0.5rem ;
}
.mod-li div:nth-child(2){
  border: solid 1px #ddd;
  padding: 0.5rem ;
  margin-bottom: 0.5rem;
}
.active-mod , .toggle , .disable{
  cursor: pointer;
  border: none;
  border-radius: 3px;
  height: 34px;
  min-width: 60px;
  text-align: center;
  color: var(--vt-c-white-mute);
  padding: 5px;
}
.active-mod:hover , .toggle:hover, .disable:hover {
  font-weight: bold;
}
.toggle {
  background: rgb(130, 165, 219);
}
.disable{
  background: #c95d63;
}
.rm-toggle {
  cursor: pointer;
  margin: 0 10px;
  height: 34px;
  border: none;
}
.active-mod {
  background: #5adc97;
}
.mod-info {
  display: flex;
  align-items: flex-start;
}
.mod-name {
  flex-grow: 1;
  font-size: 1.2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

<!-- Read Me Style -->
<style>
.readme h1{
font-size: 18px;
font-weight: bold;
display: block;
}
.readme strong {
  font-weight: bold;
}
.readme p {
  margin: 10px 0;
}
.readme blockquote {
  background: #ddd;
  border-radius: 3px;
  padding: 10px;
  margin: 10px;
}
.readme code {
  background: var(--vt-c-black-soft);
  color: #fff;
  border-radius: 3px;
  padding: 10px;
  margin: 10px;
}
.readme pre code {
  display: block;
  overflow: hidden;
  white-space: pre-wrap;
  background: var(--vt-c-black-soft);
  color: #fff;
  border-radius: 3px;
  padding: 10px;
  margin: 10px;
}

.readme hr {
  margin: 15px 0;
}
.readme ol li {
  list-style: decimal;
}
</style>