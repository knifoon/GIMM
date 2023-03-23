import { nameSwapper } from './tools';
const {readdirSync} = require('fs')
const Store = require('electron-store');
const settings = new Store();

const getGimi = (f) => {
    let characterMods = {};
    try {
    readdirSync(f,{withFileTypes: true}).forEach((mod)=>{
      if(mod.isDirectory()) {
        let modInfo = {
        folderName: mod.name,
        path: `${f}/${mod.name}`,
        modFolderPath: `${f}/${mod.name}`
        } 
        //find ini
        let iniFile = readdirSync(modInfo.path).find(file => file.endsWith('.ini')) || null;
        if(iniFile) {
          modInfo.character = iniFile.substring(0,iniFile.length-4).toLowerCase()
        }
        //get character name from toggle mods
        if(modInfo.character.includes("merged") || modInfo.character.includes("swap")){
          readdirSync(modInfo.modFolderPath,{withFileTypes: true})
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .every(dirent => {
            let findINI = readdirSync(`${modInfo.modFolderPath}/${dirent}`).find(file => file.endsWith('.ini')) || null;
            if(findINI) {
              if(findINI.includes('icon')) return true
              modInfo.character = findINI.substring(8,findINI.length-4).toLowerCase()
              return false
            } else return true
          })
        }
        if(!characterMods[modInfo.character]) characterMods[modInfo.character] = []
        characterMods[modInfo.character].push({
          name : modInfo.folderName,
          path : modInfo.modFolderPath,
        })
      }
    });
  } catch (err) {
    if(err.code === 'ENOENT'){
      console.log('GIMI folder missing, resetting folder')
      if(settings.get('gimiFolder')) settings.delete('gimiFolder')
    }
  }
    // adjust list
    let charIgnore = ['CharacterShaders','undefined']
    const removeFromList = () =>{
      // mod.inis
      Object.keys(characterMods).forEach(n=>{
        if(n.toLowerCase().endsWith('mod') && n.toLowerCase() !== 'lsmod'){
            characterMods[n.substring(0,n.length-3)] = characterMods[n]
            delete characterMods[n]
        }
        if( n.toLowerCase().startsWith('disabled')) {
          let getName = n.substring(8,n.length).replace(/\s|_/g,'')
          // console.log(n," -> ",getName);
          characterMods[getName] = characterMods[n]
          delete characterMods[n]
        } 
        // sacrificial/royal swords
        if(n.toLowerCase() == 'sacrificialsword' || n.toLowerCase() == 'royallongsword'){
          if(!characterMods['Royal & Sacrificial Swords']) characterMods['Royal & Sacrificial Swords'] = []
          characterMods[n].forEach(nm => {
            characterMods['Royal & Sacrificial Swords'] = [nm]
          })
          delete characterMods[n]
        }
      })
    }
    removeFromList()
    
    let finalList = {}
    Object.keys(characterMods).forEach(n => {
      let nn = nameSwapper(n)
      finalList[nn.charAt(0).toUpperCase() + nn.slice(1)] = characterMods[n]
    })
    console.log('gimi mods');
    console.log(finalList);
    return finalList
  }
export {getGimi}