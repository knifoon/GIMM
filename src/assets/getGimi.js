import { nameSwapper } from './tools';
const {readdirSync, readFileSync} = require('fs')
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
        } else {
          console.log('invalid folder');
          console.log(modInfo);
          modInfo.character = "undefined";
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
        if(readdirSync(modInfo.modFolderPath).find(file => file.startsWith('GIMM.json'))){
          const stripJSONComments = (data) => {
            var re = new RegExp("\/\/(.*)","g");
            return data.replace(re,'');
          }
          let gimmFile = readdirSync(modInfo.modFolderPath).find(file => file.startsWith('GIMM.json'))
          modInfo.gimm = readFileSync(`${modInfo.modFolderPath}/${gimmFile}`,'utf8')
          modInfo.gimm = stripJSONComments(modInfo.gimm)
          let gimm = JSON.parse(modInfo.gimm)
          modInfo.character = gimm.character
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
        const roySacMerge = (w) => {
          let w2 = w == "fragments" ? "grimoire" 
                 : w == "sword" ? "longsword"
                 : w
          let w3 = w2 == "longsword"? "sword" : w2

          if(n.toLowerCase() == `sacrificial${w}` || n.toLowerCase() == `royal${w2}`){
            if(!characterMods[`royalsacrificial${w3}s`]) characterMods[`royalsacrificial${w3}s`] = []
            characterMods[n].forEach(nm => {
              characterMods[`royalsacrificial${w3}s`] = [nm]
            })
            delete characterMods[n]
          }
        }
        roySacMerge('sword')
        roySacMerge('greatsword')
        roySacMerge('bow')

      })
    }
    removeFromList()
    
    let finalList = {}
    Object.keys(characterMods).forEach(n => {
      let nn = nameSwapper(n)
      finalList[nn.charAt(0).toUpperCase() + nn.slice(1)] = characterMods[n]
    })
    // console.log('gimi mods');
    // console.log(finalList);
    return finalList
  }
export {getGimi}