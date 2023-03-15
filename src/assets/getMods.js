const {readFileSync, readdirSync} = require('fs')

const getMods = (f) => {
    let characterMods = {};
    console.log('got folder:',f);
    readdirSync(f,{withFileTypes: true}).forEach((mod)=>{
      if(mod.isDirectory()) {
        let modInfo = {
        folderName: mod.name,
        path: `${f}/${mod.name}`,
        modFolderPath: `${f}/${mod.name}`
        } 
        //find ini
        let readmeFile = readdirSync(modInfo.path).find(file => file.toLowerCase().startsWith('readme')) || null;
        if(readmeFile) modInfo.readme = `${modInfo.path}/${readmeFile}`
        let iniFile = readdirSync(modInfo.path).find(file => file.endsWith('.ini')) || null;
        if(iniFile) {
          modInfo.character = iniFile.substring(0,iniFile.length-4)
        } else {
          //check inner folders
          readdirSync(modInfo.path,{withFileTypes: true})
          .every(dirent => {
          if(dirent.isDirectory()) iniFile = readdirSync(`${modInfo.path}/${dirent.name}`).find(file => file.endsWith('.ini')) || null;
          if(iniFile) {
            modInfo.character = iniFile.substring(0,iniFile.length-4)
            modInfo.modFolderPath = `${modInfo.path}/${dirent.name}`;
            return false
          } else return true
          })
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
          readme: modInfo.readme || null
        })
      }
    });
    // "characters to ignore
    let charIgnore = ['CharacterShaders', 'undefined']
    const removeFromList = () =>{
      Object.keys(characterMods).forEach(n=>{
        if(n.toLowerCase().endsWith('mod')){
          characterMods[n.substring(0,n.length-3)].push(characterMods[n][0])
          delete characterMods[n]
        }
        if(charIgnore.indexOf(n) >= 0 || n.startsWith('DISABLED')) delete characterMods[n]
      })
    }
    removeFromList()
    console.log(Object.keys(characterMods))
    return characterMods
  }
export {getMods}