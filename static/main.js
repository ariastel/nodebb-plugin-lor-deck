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
});