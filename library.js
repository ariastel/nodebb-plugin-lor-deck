'use strict';

const meta = require.main.require('./src/meta');
const { renderLoRDeck } = require('./render');


const LoRDeckPlugin = {
  settings: null
};

LoRDeckPlugin.init = async function (data) {
  function render(_, res) {
    res.render('admin/plugins/lor-deck', {});
  }

  data.router.get('/admin/plugins/lor-deck', data.middleware.admin.buildHeader, render);
  data.router.get('/api/admin/plugins/lor-deck', render);

  LoRDeckPlugin.settings = await meta.settings.get('lor-deck');

  return;
}

LoRDeckPlugin.addMenuItem = async function (custom_header) {
  custom_header.plugins.push({
    'route': '/plugins/lor-deck',
    'name': '[[lor-deck:lor-deck]]'
  });
  return custom_header;
};

LoRDeckPlugin.composerFormatting = async function (data) {
  data.options.push({
    name: 'lor-deck',
    className: 'fa fa-gamepad',
    title: '[[lor-deck:lor-deck]]',
  });
  return data;
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

LoRDeckPlugin.parsePost = async function (data) {
  const newData = { ...data };
  newData.postData.content = replaceTagContent(data.postData.content);
  return newData;
};

LoRDeckPlugin.parseRaw = async function (data) {
  return replaceTagContent(data);
};

module.exports = LoRDeckPlugin;