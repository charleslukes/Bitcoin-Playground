export const isHex = (str: string) => {
  return /^[A-F0-9]+$/i.test(str);
};

export const isPublicKeyInvalid = (publicKey: string) => {
  return !isHex(publicKey) || publicKey.length !== 66;
};
