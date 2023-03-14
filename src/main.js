import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App)


app.mount('#app')

const shell = require('electron').shell;

document.addEventListener('click',e=>{
    if(e.target == document.querySelector('a[href^="http"]'))
    e.preventDefault();
    shell.openExternal(e.target.href);
})
