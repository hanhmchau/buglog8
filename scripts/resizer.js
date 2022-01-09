export default class ApplicationResizer {
	application;

	constructor(application) {
		this.application = application;
	}

	resize(boundaries) {
		this.application.setPosition(boundaries);
	}

	maximize() {
		this.resize({
			height: window.innerHeight,
			width: window.innerWidth
		});
		this.resize({
			left: 0,
			top: 0
		});
	}

	theaterModeResize() {
		const sidebar = document.getElementById('sidebar');
		const players = document.getElementById('players');
		const margin = 8;
		// has to be separate, otherwise it won't work
		// (see how top value is reset while setting height in setPosition() in Foundry.js)
		this.resize({
			height: window.innerHeight - players.offsetHeight - margin,
			width: window.innerWidth - sidebar.offsetWidth - margin
		});
		this.resize({
			top: 0,
			left: 0
		});
	}
}
