import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld(
	"app", {
	sendMessage: (msg: string): void => {
		ipcRenderer.invoke('send:message', msg);
	},
	addTouchesListener: (callback: (msg: Array<number>) => void) => {
		ipcRenderer.on('receive:touches', (_: IpcRendererEvent, msg: Array<number>) => {
			callback(msg);
		});
	}
}
);
