<script setup>
import {ref, getCurrentInstance} from 'vue'
import Form from './Form.vue'
const instance = getCurrentInstance();
const {readFileSync, readdirSync, rmSync, cpSync, writeFileSync} = require('fs')
const props = defineProps(['json'])

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
    // getOriginalName = getOriginalName
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
            <h1>Editing Mod for {{ gimm.character || modInfo.character }}</h1>
            <div> Location: <span class="path">{{ modInfo.path }}</span></div>
            <div> ReadMe: <span class="path">{{ modInfo.readme }}</span></div>
        </div>
        <br>
        <Form type="text" label="name" v-model:data="gimm.name"/>
        <Form type="text" label="version" v-model:data="gimm.version"/>
        <Form type="text" label="collection" v-model:data="gimm.collection"/>
        <Form type="text" label="author" v-model:data="gimm.author"/>
        <button @click="save">save changes</button>
    </div>
</template>
<style scoped>
.container {
    margin: auto;
}
.meta div {
    padding: 5px;
}
.path {
    white-space: nowrap;

}
</style>