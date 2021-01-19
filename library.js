'use strict';

const { DeckEncoder } = require('runeterra');
const CardsData = require('./static/cards.json');

const LoRDeckPlugin = {};


LoRDeckPlugin.composerFormatting = function (data, callback) {
  data.options.push({
    name: 'lor-deck',
    className: 'fa fa-gamepad',
    title: 'LoR Deck',
  });
  callback(null, data);
};

function getCardImageURL(code, full = false) {
  return `https://cdn.portal.ariastel.com/lor/cards/${code}${full ? '-full' : ''}.png`;
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