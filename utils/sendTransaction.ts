import Web3 from 'web3';
import { TransactionObject, Account } from 'web3/types';

type TxParams = {
  method?: TransactionObject<any>;
  to: string;
  value?: number;
  account: Account;
  data?: string;
};

export default function sendTransaction(
  web3: Web3,
  { method, to, account, value = 0, data }: TxParams
) {
  return (value || !method
    ? Promise.resolve(21000)
    : method
        .estimateGas({ from: account.address })
        .then(gas => Math.round(gas * 1.21))
  ).then(gas => {
    const tx = {
      to,
      data: value || !method ? data : method.encodeABI(),
      gas,
      value,
    };

    return (web3.eth.accounts.signTransaction(
      tx,
      account.privateKey
    ) as any).then((signedTx: any) => {
      const futureReceipt = web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return { futureReceipt };
    });
  });
}
