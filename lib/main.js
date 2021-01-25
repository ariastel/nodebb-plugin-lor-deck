'use strict';
/* global $ */

$(window).on('action:composer.enhanced', function () {
	require([
		'composer/formatting',
		'composer/controls',
	], function (formatting, controls) {
		if (formatting && controls) {
			formatting.addButtonDispatch('lor-deck', function (textarea, selectionStart, selectionEnd) {
				if (selectionStart === selectionEnd) {
          const block = controls.getBlockData(textarea, '[/lor-deck]', selectionStart);
          const position = selectionStart + 10;
					if (block.in && block.atEnd) {
						controls.updateTextareaSelection(textarea, position, position);
					} else {
						controls.insertIntoTextarea(textarea, '[lor-deck][/lor-deck]');
						controls.updateTextareaSelection(textarea, position, position);
					}
				} else {
					const wrapDelta = controls.wrapSelectionInTextareaWith(textarea, '[lor-deck]', '[/lor-deck]');
					controls.updateTextareaSelection(textarea, selectionStart + 10 + wrapDelta[0], selectionEnd + 10 - wrapDelta[1]);
				}
			});
		}
	});
	
	$('[component="composer"]').on("mouseover", '.lor-card', function () {
		showFullCard($(this));
	});
	
	$('[component="composer"]').on("mouseout", '.lor-card', function () {
		hideFullCard($(this));
	});
});

$(window).on('action:topic.loading', function () {
	$('[component="topic"]').on("mouseover", '.lor-card', function () {
		showFullCard($(this));
	});
	$('[component="topic"]').on("mouseout", '.lor-card', function () {
		hideFullCard($(this));
	});
});

function showFullCard(el) {
	const fullCard = el.children('.lor-card__full');
	el.parents('.topic .content').css('overflow', 'visible');
	if (!fullCard.length) {
		el.append(`<img src="${el.attr("data-card-url")}" class="lor-card__full lor-card__full--visible" />`)
	} else {
		fullCard.addClass("lor-card__full--visible");
	}
}

function hideFullCard(el) {
	const fullCard = el.children('.lor-card__full');
	if (!fullCard.length) {
		return;
	}
	el.parents('.topic .content').css('overflow', 'hidden');
	fullCard.removeClass("lor-card__full--visible");
}