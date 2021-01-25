'use strict';

const meta = require.main.require('./src/meta');
const { renderLoRDeck } = require('./render');


const LoRDeckPlugin = {
  settings: null
};

LoRDeckPlugin.init = function (data, callback) {
  function render(_, res) {
    res.render('admin/plugins/lor-deck', {});
  }

  data.router.get('/admin/plugins/lor-deck', data.middleware.admin.buildHeader, render);
  data.router.get('/api/admin/plugins/lor-deck', render);

  meta.settings.get('lor-deck', function (_, settings) {
    LoRDeckPlugin.settings = settings;
    callback();
  });
}

LoRDeckPlugin.addMenuItem = function (custom_header, callback) {
  custom_header.plugins.push({
    'route': '/plugins/lor-deck',
    "name": 'LoR Deck'
  });
  callback(null, custom_header);
};

LoRDeckPlugin.composerFormatting = function (data, callback) {
  data.options.push({
    name: 'lor-deck',
    className: 'fa fa-gamepad',
    title: 'LoR Deck',
  });
  callback(null, data);
};

function replaceTagContent(content) {
  const regex = new RegExp(/\[lor-deck\]([\w\d]+)\[\/lor-deck\]/g);
  return content.replace(regex, (_, deckCode) => {
    try {
      return renderLoRDeck(LoRDeckPlugin.settings, deckCode);
    } catch (e) {
      console.error(e);
      return 'Invalid LoR deck code';
    }
  });
}

LoRDeckPlugin.parsePost = function (data, callback) {
  const newData = { ...data };
  newData.postData.content = replaceTagContent(data.postData.content);
  callback(null, newData);
};

LoRDeckPlugin.parseRaw = function (data, callback) {
  callback(null, replaceTagContent(data));
};

module.exports = LoRDeckPlugin;