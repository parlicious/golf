const digestMessage = async (message) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return window.crypto.subtle.digest('SHA-256', data);
};

// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
const bufferToHex = (buffer) => {
  let s = '';
  const h = '0123456789ABCDEF';
  // eslint-disable-next-line no-bitwise
  (new Uint8Array(buffer)).forEach((v) => { s += h[v >> 4] + h[v & 15]; });
  return s;
};

const sha256 = async (key) => {
  const keyBuffer = await digestMessage(key);
  return bufferToHex(keyBuffer);
};

export default sha256;
