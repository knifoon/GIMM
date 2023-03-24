<script setup>
import {ref, getCurrentInstance} from 'vue'
import Form from './Form.vue'
const instance = getCurrentInstance();
const {readFileSync, readdirSync, writeFileSync} = require('fs')
const props = defineProps(['json'])

let characterForm = ref(false)
let modInfo = JSON.parse(props.json)
let gimmFile = readdirSync(modInfo.path).find(file => file.startsWith('GIMM.json'))
let gimm
if(gimmFile){
    const stripJSONComments = (data) => {
        var re = new RegExp("\/\/(.*)","g");
        return data.replace(re,'');
    }
    gimm = readFileSync(`${modInfo.path}/${gimmFile}`,'utf8')
    gimm = stripJSONComments(gimm)
    gimm = ref(JSON.parse(gimm))
} else {
    gimm = ref({"name":modInfo.name,"character":modInfo.character,"locked":false})
}
const save = () => {
    console.log('from edit screen');
    let getOriginalName = modInfo.path.split('/')
    let originalName = getOriginalName[getOriginalName.length - 1]
    if(gimm.value.name == "") gimm.value.name = originalName
    writeFileSync(`${modInfo.path}/GIMM.jsonc`, JSON.stringify(gimm.value))
    instance.parent.emit('reloadList',gimm.character)
    instance.parent.emit('closeModal')
}
</script>
<template>
    <div class="container">
        <div class="meta">
            <div class="characterTitle">
                <h1>Editing Mod for {{ gimm.character || modInfo.character }}</h1>
                <button @click="characterForm = true" title="Edit Character Name, this will move this mod under a different mod group">?</button>
            </div>
            <div> Location: <span class="path">{{ modInfo.path.replaceAll('/','\\') }}</span></div>
            <div v-if="modInfo.readme"> ReadMe: <span class="path">{{ modInfo.readme }}</span></div>
            <div v-else>No ReadMe File Found</div>
        </div>
        <br>
        <Form type="text" label="character" v-model:data="gimm.character" v-if="characterForm"/>
        <Form type="text" label="name" v-model:data="gimm.name"/>
        <Form type="text" label="version" v-model:data="gimm.version"/>
        <Form type="text" label="collection" v-model:data="gimm.collection"/>
        <Form type="text" label="author" v-model:data="gimm.author"/>
        <button @click="save">Save Changes</button>
    </div>
</template>
<style scoped>
.characterTitle {
    display: flex;
    align-items:center
}
.characterTitle h1 {
    display: inline-block;
}
.characterTitle button{
    display: inline-block;
    margin-left: 10px;
}
.container {
    margin: auto;
}
.meta div {
    padding: 5px;
}
.path {
    white-space: nowrap;

}
button {
    font-weight: bold;
}
</style>