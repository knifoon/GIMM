<script setup>
import { marked } from "marked";
// import { getMods} from "@/assets/getMods.js"
import { emit } from "process";

const {ipcRenderer} = require('electron')
const {readFileSync, readdirSync} = require('fs')
let test = marked.parse(readFileSync('./public/rmex.md','utf-8'));
let listAvailable = false

// ipcRenderer.on('modFolder',(e,f) =>{
//   // modsList.value = getMods(f)
//   emit('updateList', getMods(f))
//   listAvailable = true;
//   console.log('list made')
// })
</script>

<template>
  <div class="content">
    <header>
      select folders
      <button @click="ipcRenderer.send('selectModFolder')">mod folder</button>
    </header>
    <div class="readme" v-html="test">
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
</style>
