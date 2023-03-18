// main.js
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, shell,Menu , MenuItem, webContents } = require('electron')
const path = require('path')
const Store = require('electron-store')
const log = require('electron-log')

Store.initRenderer()

log.initialize({ preload: true });

log.info('Log from the main process')
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true, // <--- flag
      nodeIntegrationInWorker: true, // <---  for web workers
      enableRemoteModule: true,
      contextIsolation: false,
      preload: 'preload.js'
    },
    resizable: false
  })
  // and load the index.html of the app.
  mainWindow.loadFile('dist/index.html')

  // Menu Setup
const template = [
  {
  label: app.name.toUpperCase(),
      submenu: [
        {role: 'reload'},
         {role: 'quit'},
         {role: 'toggleDevTools'}
      ]
  },
  {
    label: "Help",
      submenu: [
        { label: 'GameBanana',
          click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://gamebanana.com/tools/12471')}
        },
        { label: 'Reset Folders',
          click: () => {
          mainWindow.webContents.send('resetFolders',true)
          }
        }
      ]
    }
]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin')
   app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('selectModFolder',(e) => {
  dialog.showOpenDialog({
    title: "Select Mod Folder",
    properties:['openFile', 'openDirectory']
  }).then(file => {
    console.log(file.canceled);
    if (!file.canceled) {
    const filepath = file.filePaths[0].toString();
    console.log(filepath);
    e.reply('modFolder',filepath)
  ``}  
``}).catch(err => {
    console.log(err)
  })
})

ipcMain.on('selectGimiFolder',(e) => {
  dialog.showOpenDialog({
    title: "Select Gimi Mod Folder",
    properties:['openFile', 'openDirectory']
  }).then(file => {
    console.log(file.canceled);
    if (!file.canceled) {
    const filepath = file.filePaths[0].toString();
    console.log(filepath);
    e.reply('gimiFolder',filepath)
  ``}  
``}).catch(err => {
    console.log(err)
  })
})
// deep links
let mainWindow;
let deeplinkingUrl;
if (!app.isDefaultProtocolClient('GIMM')) {
  app.setAsDefaultProtocolClient('GIMM');
}

// Force single application instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
} else {
  app.on('second-instance', (e, argv) => {
    if (process.platform !== 'darwin') {
      // Find the arg that is our custom protocol url and store it
      deeplinkingUrl = argv.find((arg) => arg.startsWith('GIMM://'));
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
  let modLink;
app.on("open-url", async (event, url) => {
  modLink = url;
  event.preventDefault();
  let mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    mainWindow.focus();
  } else {
    await createWindow();
    mainWindow = BrowserWindow.getAllWindows()[0];
  }
  webContents.send("handle-deep-link", url);
});

//right click
ipcMain.on('show-context-menu', (event,args) => {
  console.log(args);
  const template = [
    {
      label: 'Edit Info',
      click: () => { event.sender.send('context-menu-command', 'edit') }
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})