const electron = require('electron')

const { app, BrowserWindow } = electron

const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const exec = require('child_process').exec

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferances: {backgroundThrottling: false}
  })
  mainWindow.webContents.closeDevTools()
  mainWindow.setMenu(null)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  exec('npm run electron-start', (error, stdout, stderr) => {
    console.log(error, 'error')
  })
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000/signup'
      : `http://localhost:3000/signup`
  )
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
