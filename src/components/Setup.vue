<script setup>
const {ipcRenderer} = require('electron')
const props = defineProps(['dupe'])
</script>

<template>
    <div class="setup">
  <div class="welk">
    <img src="/images/welk.png" alt="" >
    <img src="/images/welkbg.png" alt="" >
  </div>
  <div class="setup-content">
    <h1 v-if="dupe">Mod Collection & GIMI Mod Folders must be different</h1>
    <strong>Mod Collection</strong>: a folder with all your mods, unzipped.
    <br>
    <strong>GIMI Mods</strong>: GIMI/3dmigoto's Mods folder.
  </div>
  <button @click="ipcRenderer.send('selectModFolder')" class="mod-button">Add Mod Collection</button>
  <button @click="ipcRenderer.send('selectGimiFolder')" class="gimi-button">Add GIMI Mods</button>
  </div>

</template>

<style scoped>
h1{
  background: -webkit-linear-gradient(white, #38495a);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
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
.setup-content{
    grid-area: content;
    padding: 2rem;
}
.setup-content, .setup-content strong{
    background: -webkit-linear-gradient(white, #38495a);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.setup-content strong{
    -webkit-text-fill-color: #fff;
}

.mod-button {
  grid-area: modbutton;
}
.gimi-button {
  grid-area: gimibutton;
}

</style>