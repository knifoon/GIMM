<script setup>
import Form from './Form.vue'
import {ref} from 'vue'

const props = defineProps(['json'])
const Store = require('electron-store');
const settings = new Store();
const emit = defineEmits('notify');
const tabs = ['general','overrides'];

let activeSettings = ref('general');
let checkActive = (t) => {
    if(t == activeSettings.value) return true
}

let defaultOverrides = {
      "raidenshogun": "Raiden Shogun",
      "lsmod": "Loading Screen",
      "barbarasummertime": "Barbara - Summer Time",
      "dilucflamme": "Diluc - Red Dead of Night",
      "fischlhighness": "Fischl - Highness",
      "keqingopulent": "Keqing - Opulent",
      "ningguangorchid": "Ningguang - Orchid",
      "jeansea": "Jean - Sea Breeze",
      "royalsacrificialswords": "Royal & Sacrificial Swords"
    }
let defaultGeneral = {
      "Show Author": true,
      "Show Mod Count": true,
      "Show Preview Thumbnail": true
}
if(!settings.get('overrides')) settings.set('overrides',defaultOverrides)
if(!settings.get('general')) settings.set('general',defaultGeneral)
//sort for list
let workingObj = ref({})
let generalObj = ref({})

Object.keys(settings.get('overrides')).sort().forEach(o => {
workingObj.value[o.toLowerCase()] = settings.get('overrides')[o]
})
generalObj.value = settings.get('general')
console.log(generalObj.value);

let newOverTar = ref('Target')
let newOverVal = ref('Override')

const test = () => {
    console.log(generalObj.value);
}

const removeOver = (o) => {
    delete workingObj.value[o]
}

const addOver = (t,o) => {
    workingObj.value = {[t.toLowerCase()]:o,...workingObj.value}
    newOverTar.value = "Target"
    newOverVal.value = "Override"
}
const saveOver = () => {
if(newOverTar.value != "Target") addOver(newOverTar.value,newOverVal.value)
settings.set('overrides',workingObj.value)
console.log(settings.get('overrides'))
emit('notify')
}
const saveGen = () => {
settings.set('general',generalObj.value)
console.log(settings.get('general'))
emit('notify')
}
</script>
<template class="settings">
    <header>
    </header>   
    <div class="sidebar">
        <ul>
            <h2>Settings</h2>
            <li v-for="tab in tabs" :class="{active: checkActive(tab)}" @click="activeSettings = tab">{{tab.charAt(0).toUpperCase() + tab.slice(1)}}</li>
          </ul>
    </div>
    <div class="overrides" v-if="checkActive('overrides')">
        <button @click="saveOver" class="save-btn">Save</button>
        <div class="new-override">
            <input type="text" v-model="newOverTar"> :<input type="text" v-model="newOverVal">
        </div>
        <button @click="addOver(newOverTar,newOverVal)"> New </button>
        <div v-for="title in Object.keys(workingObj)">
        <Form class="override" type="text" :label="title" v-model:data="workingObj[title]"/><button @click="removeOver(title)"> - </button>
        </div>
    </div>
    <div class="general" v-else-if="checkActive('general')">
        <button @click="saveGen()" class="save-btn"> Save </button>
        <div>
            <Form type="check" :label="'Show Author'" v-model:data="generalObj['Show Author']"/>
            <Form type="check" :label="'Show Mod Count'" v-model:data="generalObj['Show Mod Count']"/>
            <Form type="check" :label="'Show Preview Thumbnail'" v-model:data="generalObj['Show Preview Thumbnail']"/>
        </div>
    </div>
</template>

<style scoped>
.overrides button, header button {
    width: 80px;
}
header {
    text-align: center;
}
.sidebar {
  width: 200px;
  max-width: 20%;
  display: inline-block;
  cursor: default;
  height: 100%;
  vertical-align: top;
}
.sidebar ul li {
    margin-left: 10px;
    cursor: pointer;
}
.sidebar .active {
    font-weight: bold;
}
.save-btn {
    width: 150px !important;
    position: fixed;
    top: 20px;
    right: 60px;
}
.new-override {
    display: inline-block;
    padding: 5px;
    font-weight: bold;
}
.new-override input:first-child{
    width: 182px;
    text-align: right;
}
.new-override input:last-child{
    margin-left: 10px;
    width: 300px;
}
.overrides, .general {
    margin: auto;
    display: inline-block;
}
</style>

<!-- for children -->

<style>
.override {
    display: inline-block;
}
.override label{
    width: 200px;
}
.override input {
    width: 300px;
}
</style>