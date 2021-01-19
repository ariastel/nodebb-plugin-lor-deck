const rawCards = []
  .concat(require('./set1.json'))
  .concat(require('./set2.json'))
  .concat(require('./set3.json'));

const cards = {};

for (const rawCard of rawCards) {
  cards[rawCard.cardCode] = {
    id: rawCard.cardCode,
    region: rawCard.regionRef.toLowerCase(),
    cost: rawCard.cost,
    name: rawCard.name,
    type: rawCard.supertype || rawCard.type
  };
}

module.exports = cards;