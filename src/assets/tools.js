const Store = require('electron-store');
const settings = new Store();

const nameSwapper = (nc) => {
    let nameSwaps = {
      "raidenshogun": "Raiden Shogun",
      "lsmod": "Loading Screen",
      "barbarasummertime": "Barbara - Summer Time",
      "dilucflamme": "Diluc - Red Dead of Night",
      "fischlhighness": "Fischl - Highness",
      "keqingopulent": "Keqing - Opulent",
      "ningguangorchid": "Ningguang - Orchid",
      "jeansea": "Jean - Sea Breeze"
    }
    if(!settings.get('overrides')) settings.set('overrides',nameSwaps)
    else nameSwaps = settings.get('overrides')
    let nn,ran = false
    Object.keys(nameSwaps).forEach(swap => {
      if(!ran){
        if(nc == swap.toLowerCase()) {
          nn = nameSwaps[swap]
          ran = true
        } else nn = nc
      }
    })
    if(nn.endsWith('cn'))nn = nn.substring(0,nn.length-2) + "CN"
    return nn
  }

  export {nameSwapper}