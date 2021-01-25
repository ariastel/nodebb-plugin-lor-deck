'use strict';

const meta = require.main.require('./src/meta');

const { DeckEncoder } = require('runeterra');
const CardsData = require('./static/cards.json');


const LoRDeckPlugin = {
  settings: null
};

LoRDeckPlugin.init = function (data, callback) {
  function render(_, res) {
    res.render('admin/plugins/lor-deck', {});
  }

  data.router.get('/admin/plugins/lor-deck', data.middleware.admin.buildHeader, render);
  data.router.get('/api/admin/plugins/lor-deck', render);

  meta.settings.get('lor-deck', function(_, settings) {
    LoRDeckPlugin.settings = settings;
    callback();
  });
}

LoRDeckPlugin.addMenuItem = function(custom_header, callback) {
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

function getCardImageURL(code, full = false) {
  return `${LoRDeckPlugin.settings.host || ''}/${code}${full ? '-full' : ''}.png`;
}


function formatLoRCard(card) {
  return `<li class="lor-card lor-card--region-${card.region}" style="background-image: url(${getCardImageURL(card.code, true)})">
<span class="lor-card__cost flex-center">${card.cost}</span>
<span class="lor-card__name">${card.name}</span>
<span class="lor-card__count flex-center">x${card.count}</span>
</li>`;
}

function sortLoRCards(first, second) {
  if (first.cost !== second.cost) {
    return first.cost - second.cost;
  }
  return first.count - second.count;
}

function formatLoRSection(sectionName, sectionCards) {
  return `<li class="lor-deck__section"><div>${sectionName}</div><ul class="lor-cards">${sectionCards.sort(sortLoRCards).map(formatLoRCard).join('')}</ul></li>`;
}

function sortLoRSections(first, second) {
  const sectionSort = { 'Чемпион': 1, 'Боец': 2, 'Заклинание': 3, 'Место силы': 4 };
  return (sectionSort[first] || 999) - (sectionSort[second] || 999);
}

function formatLoRDeck(deck) {
  const sections = deck.reduce(function(acc, card) {
    const cardData = CardsData[card.code];
    (acc[cardData.type] = acc[cardData.type] || []).push({ ...card, ...CardsData[card.code] });
    return acc;
  }, {});
  const sectionsHTML = Object.keys(sections).sort(sortLoRSections).map(section => formatLoRSection(section, sections[section])).join('');
  return `<ul class="lor-deck">${sectionsHTML}</ul>`;
}

function replaceTagContent(content) {
  const regex = new RegExp(/\[lor-deck\]([\w\d]+)\[\/lor-deck\]/g);
  return content.replace(regex, (_, p1) => {
    try {
      return formatLoRDeck(DeckEncoder.decode(p1));
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