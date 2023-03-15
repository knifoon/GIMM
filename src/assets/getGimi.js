const {readdirSync} = require('fs')

const getGimi = (f) => {
    let characterMods = {};
    console.log('GIMI Folder:',f);
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
          modInfo.character = iniFile.substring(0,iniFile.length-4)
        }
        //get character name from toggle mods
        if(modInfo.character == "merged"){
          readdirSync(modInfo.modFolderPath,{withFileTypes: true})
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .every(dirent => {
            let findINI = readdirSync(`${modInfo.modFolderPath}/${dirent}`).find(file => file.endsWith('.ini')) || null;
            if(findINI) {
              modInfo.character = findINI.substring(8,findINI.length-4)
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
    // adjust list
    let charIgnore = ['CharacterShaders','bomb','chibi']
    const removeFromList = () =>{
      Object.keys(characterMods).forEach(n=>{
        if(n.toLowerCase().endsWith('mod')){
          characterMods[n.substring(0,n.length-3)]= characterMods[n]
          delete characterMods[n]
        }
        // if(charIgnore.indexOf(n) >= 0 || n.startsWith('DISABLED')) delete characterMods[n]
      })
    }
    removeFromList()
    console.log(characterMods)
    return characterMods
  }
export {getGimi}