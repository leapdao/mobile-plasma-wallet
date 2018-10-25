export const NFT_COLOR_BASE = 32769; // 2^15 + 1

export const shortenHex = hex =>
  hex && [hex.slice(0, 8), '...', hex.slice(hex.length - 6)].join('');
