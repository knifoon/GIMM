<script setup>
import {ref} from 'vue'

const {readFileSync, readdirSync, rmSync, cpSync, writeFileSync} = require('fs')
const props = defineProps(['json'])

let modInfo = JSON.parse(props.json)
let gimmFile = readdirSync(modInfo.path).find(file => file.startsWith('GIMM.json'))
console.log(modInfo);
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
    writeFileSync(`${modInfo.path}/GIMM.jsonc`, JSON.stringify(gimm.value), err => {
        if (err) {
            console.error(err);
        }
    })
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
        <li><label for="name"> Name : </label><input name="name" type="text" v-model="gimm.name"></li>
        <li><label for="version"> version : </label><input name="version" type="text" v-model="gimm.version"></li>
        <li><label for="collection"> Collection : </label><input name="collection" type="text" v-model="gimm.collection"></li>
        <li><label for="author"> Author : </label><input name="author" type="text" v-model="gimm.author"></li>
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