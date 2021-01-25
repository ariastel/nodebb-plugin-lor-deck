'use strict';
/* globals $, app, socket, define */

define('admin/plugins/lor-deck', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('lor-deck', $('.lor-deck-settings'));

		$('#save').on('click', function() {
			Settings.save('lor-deck', $('.lor-deck-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'lor-deck-saved',
					title: 'Settings Saved',
					message: 'Please rebuild and restart your NodeBB to apply these settings, or click on this alert to do so.',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});