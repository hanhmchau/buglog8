import { ChatLogRenderer } from '../load.js';
import ChatLogPaginationRenderer from './pagination-renderer.js';
import SearchResultRenderer from './search-result-renderer.js';
import ChatLogSearcher, { MessagesPaginator, SORT_MODE } from './searcher.js';

export default class ChatLogSearch {
	_lastSavedSearchResults;
	_lastSearchTerm;
	_currentPage;
	_sortMode = SORT_MODE.NEWEST;

	CONFIG = {
		SEARCH_BATCH_SIZE: 10
	};

	constructor(application) {
		this.application = application;
		this.chatLogRenderer = ChatLogRenderer.create();
		this.messagesSearcher = new ChatLogSearcher();
		this.render();
	}

	async render() {
		const template = 'modules/buglog8/templates/log_search.hbs';
		const html = await renderTemplate(template);
		const $html = $(html);
		this._html = $html;
		this.activateListeners($html);
		this.hide();
		this.application.element.prepend($html);
		this.paginationRenderer = new ChatLogPaginationRenderer(this.application.element, (page) => this.goToPage(page));
		this.searchResultRenderer = new SearchResultRenderer(this.application.element);
	}

	show() {
		this._html.removeClass('none');
		this.application.element.find('#search-input').focus();
	}

	hide() {
		this._html.addClass('none');
	}

	activateListeners(html) {
		html.on('click', '.jump', (event) => {
			const id = $(event.currentTarget).attr('data-message-id');
			if (id && typeof id === 'string') this.chatLogRenderer.renderBatchCenteredAround(id);
		});

		html.find('#search-input').on('keyup', (event) => {
			if (event.key === 'Enter') {
				const searchTerm = event.target.value.trim().toLowerCase();
				this.searchInput(searchTerm);
			}
		});

		html.find('.search-button').on('click', (event) => {
			const searchTerm = $(event.target).closest('.search-container').find('#search-input').val().trim().toLowerCase();
			this.searchInput(searchTerm);
		});

		html.find('.close-button').on('click', () => {
			this.clearSearch();
		});

		html.on('click', '.controls .sort button', (event) => {
			const sortMode = $(event.target).attr('data-sort');
			this.changeSortMode(sortMode);
		});
	}

	clearSearch() {
		this._currentPage = 1;
		this._lastSavedSearchResults = null;
		this._lastSearchTerm = null;
		this.searchResultRenderer.reset();
		this.paginationRenderer.update(this._currentPage, 0);
	}

	changeSortMode(sortMode) {
		this._sortMode = sortMode;
		this.searchResultRenderer.changeSortMode(sortMode);
		this.searchInput(this._lastSearchTerm);
	}

	searchInput(searchTerm) {
		if (searchTerm) {
			const allResults = this.messagesSearcher.getMessagesMatching(searchTerm, this._sortMode);
			const paginatedResults = MessagesPaginator.paginate(allResults, 1, this.CONFIG.SEARCH_BATCH_SIZE);
			this._lastSavedSearchResults = allResults;
			this._currentPage = 1;
			this._lastSearchTerm = searchTerm;
			this.searchResultRenderer.renderResults(paginatedResults, allResults.length);
			this.paginationRenderer.update(this._currentPage, paginatedResults.totalPage);
		}
	}

	goToPage(page) {
		if (this._lastSavedSearchResults) {
			this._currentPage = page;
			const paginatedResults = MessagesPaginator.paginate(this._lastSavedSearchResults, this._currentPage, this.CONFIG.SEARCH_BATCH_SIZE);
			this.searchResultRenderer.renderResults(paginatedResults, this._lastSavedSearchResults.length);
			this.paginationRenderer.update(this._currentPage, paginatedResults.totalPage);
		}
	}
}
