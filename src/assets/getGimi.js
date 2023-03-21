const {readdirSync} = require('fs')

const getGimi = (f) => {
    let characterMods = {};
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
        if(modInfo.character == "merged"){
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
        if(!characterMods[modInfo.character]) characterMods[modInfo.character] = []
        characterMods[modInfo.character].push({
          name : modInfo.folderName,
          path : modInfo.modFolderPath,
        })
      }
    });
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
          let getName = n.substring(8,n.length).replace(/\s/g,'')
          console.log(getName);
          characterMods[getName] = characterMods[n]
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
      const nameSwapper = (nc) => {
        let nameSwaps = {
          "raidenshogun": "Raiden Shogun",
          "lsmod": "LSMod",
          "barbarasummertime": "Barbara - Summer Time"
        }
        let newName,ran = false
        Object.keys(nameSwaps).forEach(swap => {
          if(!ran){
            if(nc == swap) {
              newName = nameSwaps[swap]
              ran = true
            } else newName = nc
          }
        })
        return newName
      }
      let nn = nameSwapper(n)
      finalList[nn.charAt(0).toUpperCase() + nn.slice(1)] = characterMods[n]
    })
    // console.log('gimi mods');
    // console.log(finalList);
    return finalList
  }
export {getGimi}