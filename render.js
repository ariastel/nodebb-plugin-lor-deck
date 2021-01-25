const { DeckEncoder } = require('runeterra');
const CardsData = require('./static/cards.json');


function getCardImageURL(host, code, full = false) {
  return `${host || ''}/${code}${full ? '-full' : ''}.png`;
}

function sortLoRCards(first, second) {
  if (first.cost !== second.cost) {
    return first.cost - second.cost;
  }
  return first.count - second.count;
}

function renderLoRCard(card) {
  return `<li class="lor-card lor-card--region-${card.region}" style="background-image: url(${card.full_url})" data-card-url="${card.url}">
<span class="lor-card__cost flex-center">${card.cost}</span>
<span class="lor-card__name">${card.name}</span>
<span class="lor-card__count flex-center">x${card.count}</span>
</li>`;
}

function sortLoRSections(first, second) {
  const sectionSort = Object.freeze({ 'Чемпион': 1, 'Боец': 2, 'Заклинание': 3, 'Место силы': 4 });
  return (sectionSort[first] || 999) - (sectionSort[second] || 999);
}

function renderLoRSection(sectionName, sectionCards) {
  const sectionCodes = Object.freeze({ 'Чемпион': 'champion', 'Боец': 'follower', 'Заклинание': 'spell', 'Место силы': 'landmark' });
  return `<li class="lor-deck__section lor-deck__section--type-${sectionCodes[sectionName]}"><div class="lor-deck__section__name">${sectionName}</div><ul class="lor-cards">${sectionCards.map(renderLoRCard).join('')}</ul></li>`;
}

function renderLoRDeck(settings, deckCode) {

  const deckCards = DeckEncoder.decode(deckCode)
    .map(card => ({
      ...card,
      ...CardsData[card.code],
      url: getCardImageURL(settings.host, card.code),
      full_url: getCardImageURL(settings.host, card.code, true)
    }))
    .sort(sortLoRCards);

  const sections = deckCards.reduce(function (acc, card) {
    (acc[card.type] = acc[card.type] || []).push(card);
    return acc;
  }, {});

  const sectionsHTML = Object.keys(sections).sort(sortLoRSections).map(section => renderLoRSection(section, sections[section])).join('');
  return `<div class="lor-code">Код колоды: ${deckCode}</div><ul class="lor-deck">${sectionsHTML}</ul>`;
}

module.exports = { renderLoRDeck };