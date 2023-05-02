const { ipcRenderer } = require('electron')

ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.send('app_version', { version: arg.version })
})

ipcRenderer.on('update_available', () => {
  ipcRenderer.send('update_available')
})

ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.send('update_downloaded')
})
