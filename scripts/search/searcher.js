import memoize from '../../libs/lodash-memoize.js';
import normalize from '../../libs/remove-whitespace.js';

export const SORT_MODE = {
	NEWEST: 'newest',
	OLDEST: 'oldest'
};

export default class ChatLogSearcher {
	_searchMatching = memoize(MessagesSearcher.searchMatching);

	constructor() {}

	getMessagesMatching(searchTerm, sortMode = SORT_MODE.NEWEST) {
		if (searchTerm) {
			const messages = this._searchMatching(searchTerm);
			return MessagesSorter.sort(messages, sortMode);
		}
	}
}

export class MessagesPaginator {
	static paginate(messages, page, pageSize) {
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		return {
			messages: messages.slice(start, end),
			totalPage: Math.ceil(messages.length / pageSize)
		};
	}
}

class MessagesSorter {
	static sort(messages, sortMode) {
		switch (sortMode) {
			case SORT_MODE.NEWEST:
				return messages.sort((a, b) => b.data.timestamp - a.data.timestamp);
			case SORT_MODE.OLDEST:
				return messages.sort((a, b) => a.data.timestamp - b.data.timestamp);
			default:
				return messages;
		}
	}
}

class MessagesSearcher {
	static searchMatching(searchTerm) {
		const matcher = new MessageMatcher();
		const messages = game.messages.contents.filter((m) => m.visible);
		return messages.filter((m) => matcher.matches(m, searchTerm));
	}
}

class MessageMatcher {
	constructor() {
		this._div = document.createElement('div');
	}

	matches(message, searchTerm) {
		const normalizedSearchTerm = normalize(searchTerm.trim().toLowerCase());
		const content = message.data.content;
		this._div.innerHTML = content;
		const textContent = this._div.textContent || this._div.innerText || '';
		const normalizedContent = normalize(textContent.trim().toLowerCase());
		return normalizedContent.includes(normalizedSearchTerm);
	}
}
