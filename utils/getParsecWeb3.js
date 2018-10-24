import Web3 from 'web3';
import { helpers } from 'parsec-lib';

let web3;
export default () => {
  if (!web3) {
    const node = 'https://testnet-1.parseclabs.org';
    web3 = helpers.extendWeb3(new Web3(new Web3.providers.HttpProvider(node)));
  }
  return web3;
};
