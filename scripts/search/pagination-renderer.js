export default class ChatLogPaginationRenderer {
	constructor(masterElement, onJumpCallback) {
		this._paginator = masterElement.find('.pagination');
		this._onJumpCallback = onJumpCallback;
		this._activateListeners();
		this._hide();
	}

	_hide() {
		this._paginator.addClass('none');
	}

	_show() {
		this._paginator.removeClass('none');
	}

	_activateListeners() {
		this._paginator.on('click', '.paginator', (ev) => {
			const page = parseInt($(ev.target).closest('[data-page]').attr('data-page'));
			this._onJumpCallback(page);
		});
	}

	update(currentPage, totalPage) {
		if (totalPage <= 1) {
			this._hide();
		} else {
			this._show();
			this._updatePrev(currentPage == 1, Math.max(currentPage - 1, 1));
			this._updateNext(currentPage == totalPage, Math.min(currentPage + 1, totalPage));
			this._renderPageInfo(currentPage, totalPage);
		}
	}

	_renderPageInfo(currentPage, totalPage) {
		this._paginator.find('.current-page').text(currentPage);
		this._paginator.find('.total-page').text(totalPage);
	}

	_updatePrev(isDisabled, prevPage) {
		this._paginator.find('.paginator.prev').attr('disabled', isDisabled).attr('data-page', prevPage).toggleClass('disabled', isDisabled);
	}

	_updateNext(isDisabled, nextPage) {
		this._paginator.find('.paginator.next').attr('disabled', isDisabled).attr('data-page', nextPage).toggleClass('disabled', isDisabled);
	}
}
