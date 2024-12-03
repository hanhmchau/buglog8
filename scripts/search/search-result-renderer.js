export default class SearchResultRenderer {
	constructor(element) {
		this._element = element;
	}

	_toggleControls(isVisible) {
		const controls = this._element.find('.controls');
		controls.toggleClass('none', !isVisible);
	}

	_toggleSearchIcon(isSearch) {
		this._element.find('.close-button').toggleClass('none', !isSearch);
		this._element.find('.search-button').toggleClass('none', isSearch);
	}

	_updateResultCount(totalResults) {
		if (totalResults > 0) {
			this._element.find('.result-count').text(`${totalResults} ${totalResults > 1 ? 'Results' : 'Result'}`);
		} else {
			this._element.find('.result-count').text('No results.');
		}
	}

	changeSortMode(mode) {
		this._element.find(`[data-sort]`).removeClass('selected');
		this._element.find(`[data-sort=${mode}]`).addClass('selected');
	}

	_toggleSortMode(isVisible) {
		this._element.find('.sort').toggleClass('none', !isVisible);
	}

	renderResults(searchResults, totalResults) {
		const hasResults = searchResults.messages.length > 0;
		this._toggleSearchIcon(hasResults);
		this._toggleControls(true);
		this._toggleSortMode(hasResults);
		this._updateResultCount(totalResults);
		this._renderMessages(searchResults.messages);
		this._toggleChatResults(hasResults);
	}

	reset() {
		this._toggleSearchIcon(true);
		this._toggleControls(false);
		this._toggleChatResults(false);
		this._renderMessages([]);
	}

	async _renderMessages(messages) {
		const html = [];
		for (const msg of messages) {
			html.push(await this._renderOneMessage(msg));
		}
		this._element.find('#chat-results .results-container').html(html);
	}

	async _renderOneMessage(message) {
		const node = $('<div class="result"></div>');
		node.append(await message.getHTML());
		node.find('.message').removeClass('continued').addClass('leading').append(`<button class="jump" data-message-id=${message.id}>Jump</button>`);
		return node;
	}

	_toggleChatResults(isVisible) {
		this._element.find('#chat-results').toggleClass('none', !isVisible);
	}
}
