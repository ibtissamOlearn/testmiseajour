import {app, BrowserWindow, screen, dialog} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'ibtissamOlearn',
  repo: 'https://github.com/ibtissamOlearn/testmiseajour.git',
  token: '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'
});


let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '/preload.js'),
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    //let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/angular-electron/index.html'))) {
       // Path when running electron in local folder
      //pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, '../dist/angular-electron/index.html'));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready',
   () => {
    setTimeout(createWindow, 400),
    autoUpdater.checkForUpdatesAndNotify()
    //dialog.showMessageBox('A new update is available. Downloading now...' )
   });

  autoUpdater.on('update-downloaded', (event) => {
      autoUpdater.quitAndInstall();
    });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

    log.transports.file.resolvePath = () => path.join(__dirname,'logs/main.log')
    log.info('App starting...')
    autoUpdater.logger = log

    autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
    })

    autoUpdater.on('update-available', (info) => {
    log.info('Update available.')
    })

    autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available.')
    })

    autoUpdater.on('error', (err) => {
    log.info('Error in auto-updater. ' + err)
    })

    autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = "Download speed: " + progressObj.bytesPerSecond
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
    logMessage = logMessage + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    log.info(logMessage)
    })

    autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded')
    autoUpdater.quitAndInstall()
    })


} catch (e) {
  // Catch Error
  // throw e;
}
