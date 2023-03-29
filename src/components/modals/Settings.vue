<script setup>
import Form from './Form.vue'
import {ref} from 'vue'

const props = defineProps(['json'])
const Store = require('electron-store');
const settings = new Store();
const emit = defineEmits('notify')

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
if(!settings.get('overrides')) settings.set('overrides',defaultOverrides)
//sort for list
let workingObj = ref({})
Object.keys(settings.get('overrides')).sort().forEach(o => {
workingObj.value[o.toLowerCase()] = settings.get('overrides')[o]
})
let newOverTar = ref('Target')
let newOverVal = ref('Override')
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
</script>
<template class="settings">
    <header>
        <h1>Settings > Overrides</h1>
        <button @click="saveOver">Save</button>
    </header>   
    <div class="overrides">
        <div class="new-override">
            <input type="text" v-model="newOverTar"> :<input type="text" v-model="newOverVal">
        </div>
        <button @click="addOver(newOverTar,newOverVal)"> New </button>
        <div v-for="title in Object.keys(workingObj)">
        <Form class="override" type="text" :label="title" v-model:data="workingObj[title]"/><button @click="removeOver(title)"> - </button>
    </div>
</div>
</template>

<style scoped>
.overrides button, header button {
    width: 80px;
}
header {
    display: flex;
    align-items: flex-start;
}
h1 {
    width: 510px;
    display: inline-block;
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
.overrides {
    margin: auto;
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