const { app, BrowserWindow, } = require('electron')

//NT client
const ntClient = require('wpilib-nt-client');
const client = new ntClient.Client()

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // darwin = MacOS
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 640,
        height: 360,
        maximizable: false
    })

    win.loadURL('file://${__dirname}/index.html');

    // When Window Close.
    win.on('closed', () => {
        win = null
    })

}

