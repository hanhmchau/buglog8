import ApplicationResizer from './resizer.js';
import ChatLogSearch from './search/index.js';

export default class ChatLogControls {
	resizer;

	init() {
		Hooks.on('getChatLogHeaderButtons', (application, headerButtons) => {
			this.resizer = new ApplicationResizer(application);
			this._addSizingControls(headerButtons);
			this._addSearchControls(headerButtons);
		});

		Hooks.on('renderChatLog', (application) => {
			if (application.popOut) {
				const resizer = new ApplicationResizer(application);
				setTimeout(() => {
					resizer.maximize();
				}, 0);

				this.searcher = new ChatLogSearch(application);

				application.element.find('.window-content').on('click', (event) => {
					const isLogsearch = $(event.target).closest('#logsearch').length > 0;
					if (!isLogsearch) {
						this.searcher?.hide();
					}
				});

				application.element.find('header').on('dblclick', () => {
					this.searcher?.hide();
				});
			}
		});
	}

	_addSearchControls(headerButtons) {
		headerButtons.unshift({
			class: 'search',
			icon: 'fas fa-search',
			label: 'Search',
			onclick: () => {
				this.searcher?.show();
			}
		});
	}

	_addSizingControls(headerButtons) {
		headerButtons.unshift(
			{
				class: 'theater',
				icon: 'fas fa-window-restore',
				label: 'Theater mode',
				onclick: () => this.resizer.theaterModeResize()
			},
			{
				class: 'maximize',
				icon: 'fas fa-window-maximize',
				label: 'Maximize',
				onclick: () => this.resizer.maximize()
			}
		);
	}
}
