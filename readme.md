# pkware-wasm
StormLib Implode and Explode algorithms for node

Based on https://github.com/ladislav-zezula/StormLib

Already compiled and ready to go. Currently a full js implementation in `dist/stormlib-js.js`, or the WASM version by requiring `dist/stormlib-wasm.js` instead. 

See `index.js` for a wrapper around these already prepared for use. Provide a Buffer object to either implode or explode. 

Note there isn't much error checking so use at your own risk! If you're using the WASM version, just make sure loaded has resolved.
