const stormlibWasm = require("./dist/slibjs");

let wasm;

function prepare(inBuffer) {
  return new Uint8Array(
    inBuffer.buffer.slice(
      inBuffer.byteOffset,
      inBuffer.byteOffset + inBuffer.byteLength
    )
  );
}

function implode(inBuffer) {
  const srcArray = prepare(inBuffer);
  var inBuff = wasm._malloc(srcArray.byteLength);

  const dstArray = new Uint8Array(0x2000);
  var outBuff = wasm._malloc(dstArray.byteLength);

  const dstSizeArray = new Int32Array([0x2000]);
  var outSizeBuff = wasm._malloc(dstSizeArray.byteLength);

  wasm.HEAPU8.set(srcArray, inBuff);
  wasm.HEAPU8.set(dstArray, outBuff);
  wasm.HEAP32.set(dstSizeArray, outSizeBuff >> 2);
  wasm._Compress_PKLIB(outBuff, outSizeBuff, inBuff, srcArray.byteLength);

  const finalSize = wasm.getValue(outSizeBuff, "i32");
  const finalBuffer = new Uint8Array(
    wasm.HEAPU8.subarray(outBuff, outBuff + finalSize)
  );
  wasm._free(inBuff);
  wasm._free(outSizeBuff);
  wasm._free(outBuff);

  return finalBuffer;
}

function explode(inBuffer) {
  const srcArray = prepare(inBuffer);
  var inBuff = wasm._malloc(srcArray.byteLength);

  const dstArray = new Uint8Array(0x2000);
  var outBuff = wasm._malloc(dstArray.byteLength);

  const dstSizeArray = new Int32Array([0x2000]);
  var outSizeBuff = wasm._malloc(dstSizeArray.byteLength);

  wasm.HEAPU8.set(srcArray, inBuff);
  wasm.HEAPU8.set(dstArray, outBuff);
  wasm.HEAP32.set(dstSizeArray, outSizeBuff >> 2);

  const result = wasm._Decompress_PKLIB(
    outBuff,
    outSizeBuff,
    inBuff,
    srcArray.byteLength
  );
  if (result === 0) {
    wasm._free(inBuff);
    wasm._free(outSizeBuff);
    wasm._free(outBuff);
    throw new Error("could not decompress data");
  }

  const finalSize = wasm.getValue(outSizeBuff, "i32");
  const finalBuffer = new Uint8Array(
    wasm.HEAPU8.subarray(outBuff, outBuff + finalSize)
  );
  wasm._free(inBuff);
  wasm._free(outSizeBuff);
  wasm._free(outBuff);

  return finalBuffer;
}

const loaded = new Promise((res, rej) => {
  stormlibWasm()
    .then((loadedModule) => {
      wasm = loadedModule;
      res();
    })
    .catch(rej);
});

module.exports = {
  implode,
  explode,
  loaded,
};
