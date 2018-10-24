import Web3 from 'web3';

let web3;
export default () => {
  if (!web3) {
    const node = 'https://rinkeby.infura.io';
    web3 = new Web3(new Web3.providers.HttpProvider(node));
  }
  return web3;
};
