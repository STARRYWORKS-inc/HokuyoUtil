const WIDTH = 1920;
const HEIGHT = 1080;

window.onload = () => {
	// setup canvas
	const contents = <HTMLDivElement>document.getElementsByClassName('contents')[0];
	const canvas = <HTMLCanvasElement>document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	contents.append(canvas);
	const ctx = canvas.getContext('2d')!

	const touches: { [key: string]: { [key: string]: number } } = {}

	// osc listener
	window.app.addTouchesListener((msg: Array<number>) => {
		const lastTouches = Object.assign({}, touches);
		// clear
		const keys = Object.keys(touches);
		keys.map(key => delete touches[key]);
		for (let i = 1; i < msg.length; i += 4) { // msg[0] is frame number
			const x = msg[i + 0];
			const y = msg[i + 1];
			const id = msg[i + 2];
			const lifeTime = msg[i + 3];
			touches[id] = { x, y, lifeTime }
			// smoothing
			if (lastTouches[id]) {
				touches[id].x = lastTouches[id].x + (x - lastTouches[id].x) * 0.2
				touches[id].y = lastTouches[id].y + (y - lastTouches[id].y) * 0.2
			}
		}
	});

	// draw point and text
	const drawPoint = (x: number, y: number, id: number, lifeTime: number) => {
		// change new point's color
		const b = Math.min(1, lifeTime / 30) * 255
		ctx.fillStyle = `rgba(255, 255, ${b}, 0.1)`;
		// draw circle
		ctx.beginPath();
		ctx.arc(x, y, 2, 0, Math.PI * 2);
		ctx.fill();
		// draw text
		ctx.beginPath();
		ctx.fillText(id.toString(), x + 25, y - 25);
	}

	// update
	const update = () => {
		// clear canvas
		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		// set style
		ctx.font = "240px Helvetica";
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.lineWidth = 1;
		// draw points
		for (const id in touches) {
			drawPoint(touches[id].x, touches[id].y, parseInt(id), touches[id].lifeTime);
		}
		// draw lines
		ctx.beginPath();
		Object.keys(touches).map((id: string, i: number) => {
			if (i == 0) {
				ctx.moveTo(touches[id].x, touches[id].y);
			} else {
				ctx.lineTo(touches[id].x, touches[id].y);
			}
		})
		ctx.closePath();
		ctx.stroke();

		window.requestAnimationFrame(update);
	}
	// start
	update();
}
