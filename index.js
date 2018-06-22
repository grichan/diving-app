const electron = require('electron');

const { app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        height:600,
        width:800,
        webPreferances: { backgroundThrottling: false}
    });
    
    mainWindow.loadURL('http://localhost:3000');
})