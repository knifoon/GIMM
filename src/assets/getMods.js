import { nameSwapper } from './tools';
const {readFileSync, readdirSync} = require('fs')
const Store = require('electron-store');
const settings = new Store();

const getMods = (f) => {
    let modList = {};
    try {
    readdirSync(f,{withFileTypes: true}).forEach((mod)=>{
      if(mod.isDirectory()) {
        let modInfo = {
        folderName: mod.name,
        path: `${f}/${mod.name}`,
        modFolderPath: `${f}/${mod.name}`
        } 
        //find Readme
        let readmeFile = readdirSync(modInfo.path).find(file => file.toLowerCase().startsWith('readme')) || null;
        if(readmeFile) modInfo.readme = `${modInfo.path}/${readmeFile}`
        //Identify Mod folder
        let iniFile = readdirSync(modInfo.path).find(file => file.endsWith('.ini')) || null;
        if(iniFile) {
          modInfo.character = iniFile.substring(0,iniFile.length-4).toLowerCase()
        } else {
          //check inner folders
          readdirSync(modInfo.path,{withFileTypes: true})
          .every(dirent => {
          if(dirent.isDirectory()) iniFile = readdirSync(`${modInfo.path}/${dirent.name}`).find(file => file.endsWith('.ini')) || null;
          if(iniFile) {
            modInfo.character = iniFile.substring(0,iniFile.length-4).toLowerCase()
            modInfo.modFolderPath = `${modInfo.path}/${dirent.name}`;
            return false
          } else return true
          })
        }
        if (!modInfo.character) {
          modInfo.character = "other"
        }
        //get character name from toggle mods
        if(modInfo.character.includes("merged") || modInfo.character.includes("swap")){
          readdirSync(modInfo.modFolderPath,{withFileTypes: true})
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .every(dirent => {
            let findINI = readdirSync(`${modInfo.modFolderPath}/${dirent}`).find(file => file.endsWith('.ini')) || null;
            if(findINI) {
              modInfo.character = findINI.substring(8,findINI.length-4).toLowerCase()
              return false
            } else return true
          })
        }
        // Add to list of mods
        if(readdirSync(modInfo.modFolderPath).find(file => file.startsWith('GIMM.json'))){
          let gimmFile = readdirSync(modInfo.modFolderPath).find(file => file.startsWith('GIMM.json'))
          modInfo.gimm = readFileSync(`${modInfo.modFolderPath}/${gimmFile}`,'utf8')
        }
        // Use GIMM.jsonc
        let modInfoOut = {
          name : modInfo.folderName,
          character : modInfo.character,
          path : modInfo.modFolderPath,
          readme: modInfo.readme || null
        }
        if (modInfo.gimm) {
          const stripJSONComments = (data) => {
            var re = new RegExp("\/\/(.*)","g");
            return data.replace(re,'');
          }
          modInfo.gimm = stripJSONComments(modInfo.gimm)
          let gimm = JSON.parse(modInfo.gimm)
          // modInfoOut.character = gimm.character.toLowerCase();
          modInfoOut.gimm = gimm
        }
        if(!modList[modInfoOut.character]) modList[modInfoOut.character] = []
        modList[modInfo.character].push(modInfoOut)
      }
    });
  } catch (err) {
    console.log('mod folder missing, resetting folder')
    if(settings.get('modFolder')) settings.delete('modFolder')
  }
    // ModList Filters 
    // "characters to ignore
    let charIgnore = ['charactershaders']
    const removeFromList = () =>{
      Object.keys(modList).forEach(n=>{

        // deal with 'mod.ini" files
        if(n.toLowerCase().endsWith('mod')){
          if (modList[n.substring(0,n.length-3)]){
            modList[n].forEach(nm => {
              nm.character = n.substring(0,n.length-3)
              modList[n.substring(0,n.length-3)].push(nm)
            })
            delete modList[n]
          } 
          //ignore LSMods
          else if(n.toLowerCase() != 'lsmod' ){
            modList[n].forEach(nm => {
              nm.character = n.substring(0,n.length-3)
              modList[n.substring(0,n.length-3)]= [nm]
            })
            delete modList[n]
          }
        }
        // combine royal longsword and Sacrifical sword
        // they share a hash that conflicts
        if(n.toLowerCase() == 'sacrificialsword' || n.toLowerCase() == 'royallongsword'){
          if(!modList['Royal & Sacrificial Swords']) modList['Royal & Sacrificial Swords'] = []
          modList[n].forEach(nm => {
            modList['Royal & Sacrificial Swords'].push(nm)
          })
          delete modList[n]
        }
        if(charIgnore.indexOf(n) >= 0 ) delete modList[n]
        // sort mods with disabled ini files
        if( n.toLowerCase().startsWith('disabled')) {
          // console.log(n);
          let getName = n.substring(8,n.length).replace(/\s/g,'')
          // console.log(getName);
          if (modList[getName]) {
            modList[n].forEach(nm => {
              modList[getName].push(nm)
            })
            delete modList[n]
          }
        }
      })
    }
    removeFromList()
    // capitalize / rename
    let finalList = {}
    Object.keys(modList).forEach(n => {
      let nn = nameSwapper(n)
      finalList[nn.charAt(0).toUpperCase() + nn.slice(1)] = modList[n]
    })
    console.log('getMods')
    console.log(finalList)
    return finalList
  }
export {getMods}