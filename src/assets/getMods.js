const {readFileSync, readdirSync} = require('fs')

const getMods = (f) => {
    let modList = {};
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
          modInfoOut.character = gimm.character;
          modInfoOut.gimm = gimm
        }
        if(!modList[modInfoOut.character]) modList[modInfoOut.character] = []
        modList[modInfo.character].push(modInfoOut)
      }
    });
    // ModList Filters
    // "characters to ignore
    let charIgnore = ['CharacterShaders', 'undefined']
    const removeFromList = () =>{
      Object.keys(modList).forEach(n=>{
        if(n.toLowerCase().endsWith('mod')){
          if (modList[n.substring(0,n.length-3)]) {
            modList[n].forEach(nm => {
              nm.character = n.substring(0,n.length-3)
              modList[n.substring(0,n.length-3)].push(nm)
            })
            delete modList[n]
          }
        }
        if(charIgnore.indexOf(n) >= 0 ) delete modList[n]
        if( n.startsWith('DISABLED')) {
          // sort mods with disabled ini files
          let getName = n.substring(8,n.length).replace(/\s/g,'')
          let fLet = getName.charAt(0).toUpperCase()
          getName = fLet + getName.slice(1)
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
    return modList
  }
export {getMods}