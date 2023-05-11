import { BrowserWindow, app, ipcMain, IpcMainInvokeEvent } from 'electron'
import path from "path";

const mainURL = `file://${__dirname}/render/index.html`

/**
 * OSC Setup
 */
const OSC = require('osc-js')
const options = {
	type: 'udp4',         // @param {string} 'udp4' or 'udp6'
	open: {
		host: 'localhost',    // @param {string} Hostname of udp server to bind to
		port: 10000,          // @param {number} Port of udp server to bind to
		exclusive: false      // @param {boolean} Exclusive flag
	},
	send: {
		host: 'localhost',    // @param {string} Hostname of udp client for messaging
		port: 10001           // @param {number} Port of udp client for messaging
	}
}
const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) });


/**
 * create window
 */
function createWindow() {
	const win = new BrowserWindow({
		width: 1920,
		height: 1080,
		kiosk: true,
		frame: false,
		autoHideMenuBar: true,
		title: "",
		titleBarStyle: "hidden",
		useContentSize: true,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		}
	});
	win.loadURL(mainURL);
	win.on('ready-to-show', () => {

		// start osc
		osc.on('/touches', (message: any) => {
			win.webContents.send('receive:touches', message.args);
		})
		osc.open()
	});
	// win.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();
});

app.on("activate", function () {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("will-quit", (_: Electron.Event) => {
	osc.close();
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		osc.close();
	}
});

ipcMain.handle('send:message', (_: IpcMainInvokeEvent, msg: string) => {
	console.log(`ipcMain on : ${msg}`);
});
