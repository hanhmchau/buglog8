export default class ChatLogLoader {
	renderer;

	constructor() {
		// this.renderer = new ChatLogRenderer();
	}

	init() {
		const context = this;
		libWrapper.register('buglog8', 'ChatLog.prototype._onScrollLog', async function (wrapped, event) {
			if (this.popOut) {
				if (!this.rendered) return;
				const log = event.target;
				const isScrollingDown = log.scrollTop > this._lastScrollTop;
				this._lastScrollTop = log.scrollTop;
				const renderer = ChatLogRenderer.create();
				renderer.log = log;
				renderer.size = CONFIG.ChatMessage.batchSize;
				if (context._approachingTop(log, isScrollingDown)) {
					await renderer._renderBatchUp(log, CONFIG.ChatMessage.batchSize);
				} else if (context._approachingBottom(log, isScrollingDown)) {
					await renderer._renderBatchDown(log, CONFIG.ChatMessage.batchSize);
				}
			} else {
				wrapped(event);
			}
		});
	}

	_approachingTop(log, isScrollingDown) {
		return log.scrollTop / log.scrollHeight < 0.05 && !isScrollingDown;
	}

	_approachingBottom(log, isScrollingDown) {
		return log.scrollTop >= log.scrollHeight - log.offsetHeight - 50 && isScrollingDown;
	}
}

export class ChatLogRenderer {
	_topmostId;
	_bottommostId;

	static renderer;

	static create() {
		if (this.renderer) {
			return this.renderer;
		} else {
			this.renderer = new ChatLogRenderer();
			return this.renderer;
		}
	}

	async _renderBatchUp() {
		this._initializeIdsIfAbsent();
		const messages = game.messages.contents.filter((m) => m.visible);
		const topmostIndex = messages.findIndex((m) => m.id === this._topmostId);
		if (topmostIndex > 0) {
			const newTopmostIndex = Math.max(0, topmostIndex - this.size);
			const batch = await this._render(messages, newTopmostIndex, topmostIndex);
			this._topmostId = messages[newTopmostIndex].id;
			$(this.log).prepend(batch);
		}
	}

	async _renderBatchDown() {
		this._initializeIdsIfAbsent();
		const messages = game.messages.contents.filter((m) => m.visible);
		const bottommostIndex = messages.findIndex((m) => m.id === this._bottommostId);
		if (bottommostIndex < messages.length - 1) {
			const newBottommostIndex = Math.min(bottommostIndex + this.size, messages.length - 1);
			const batch = await this._render(messages, bottommostIndex + 1, newBottommostIndex + 1);
			this._bottommostId = messages[newBottommostIndex].id;
			$(this.log).append(batch);
		}
	}

	_initializeIdsIfAbsent() {
		const topmostId = $(this.log).find('.chat-message').first().attr('data-message-id');
		const bottommostId = $(this.log).find('.chat-message').last().attr('data-message-id');
		if (!this._topmostId) {
			this._topmostId = topmostId;
		}
		if (!this._bottommostId) {
			this._bottommostId = bottommostId;
		}
	}

	async _render(messages, start, end) {
		const batch = messages.slice(start, end);
		const html = [];
		for (const msg of batch) {
			html.push(await msg.getHTML());
		}
		return html;
	}

	_getMessagesCenteredAround(messageId) {
		const messages = game.messages.contents.filter((m) => m.visible);
		const index = messages.indexOf(game.messages.get(messageId));
		const lowerBound = Math.max(0, index - Math.floor(CONFIG.ChatMessage.batchSize / 2));
		const upperBound = Math.min(messages.length, index + Math.floor(CONFIG.ChatMessage.batchSize / 2));
		return messages.slice(lowerBound, upperBound);
	}

	async renderBatchCenteredAround(messageId) {
		const messagesAround = this._getMessagesCenteredAround(messageId);
		$(this.log).html(await this._render(messagesAround, 0, messagesAround.length));
		this._topmostId = messagesAround[0].id;
		this._bottommostId = messagesAround[messagesAround.length - 1].id;
		this._scrollTo(messageId);
	}

	_scrollTo(messageId) {
		const target = $(this.log).find(`[data-message-id=${messageId}]`);
		this._scrollToTargetElement(target);
		this._highlight(target);
	}

	_scrollToTargetElement(target) {
		if (target.length) {
			const $chatLog = $(this.log);
			const msg = target[0];
			const scrollTop = msg.offsetTop - $chatLog[0].clientHeight / 2 + msg.clientHeight / 2;
			$chatLog.scrollTop(scrollTop);
		}
	}

	_highlight(target) {
		target.addClass('highlight');
		// setTimeout(() => target.removeClass('highlight'), 2000);
	}
}
