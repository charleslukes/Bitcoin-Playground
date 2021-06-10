import { ECPair, payments, bip32, networks } from "bitcoinjs-lib";
import { IBip39WordsEntropyMap } from "./interfaces";

export const bip39WordsEntropyMap: Array<IBip39WordsEntropyMap> = [
  {
    noOfWords: 12,
    entropyBit: 128,
  },
  {
    noOfWords: 15,
    entropyBit: 160,
  },
  {
    noOfWords: 18,
    entropyBit: 192,
  },
  {
    noOfWords: 21,
    entropyBit: 224,
  },
  {
    noOfWords: 24,
    entropyBit: 256,
  },
];

export const hDWalletSegWitBitcoinAddress = (seed: Buffer, path: string) => {
  const testnet = networks.testnet;
  const hdMaster = bip32.fromSeed(seed, testnet);

  const key = hdMaster.derivePath(path);

  const keyPair = ECPair.fromWIF(key.toWIF(), testnet);
  const { address } = payments.p2wpkh({ pubkey: keyPair.publicKey });
  return address;
};

export const generateMultiSignP2SHAddress = (
  n: number,
  _m: number,
  publicKeys: Array<string>
) => {
  const pubkeys = publicKeys.map((hex) => Buffer.from(hex, "hex"));
  const { address } = payments.p2sh({
    redeem: payments.p2ms({ m: n, pubkeys }),
  });

  return address;
};
