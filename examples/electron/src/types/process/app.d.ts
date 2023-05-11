declare global {
	interface Window {
		app: IMainProcess;
	}
}

export interface IMainProcess {
	sendMessage: (msg: string) => void;
	addMessageListener: (callback: (msg: string) => void) => void;
	addTouchesListener: (callback: (msg: Array<number>) => void) => void;
}
