const { nanoid } = require('nanoid');

exports.simulatePixTransfer = async ({ destination, amountCoins }) => ({
  txId: `PIX-${nanoid(10)}`,
  destination,
  amountCoins,
  status: 'queued'
});
