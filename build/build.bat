@echo OFF
set EMCC_DEBUG=0
Rem -s WASM=0 -fsanitize=undefined  -fsanitize=address -s ALLOW_MEMORY_GROWTH -s INITIAL_MEMORY=278285040
emcc "stormlib.cpp" -I include implode.c -I include explode.c -I include crc32.c -o slib.js -s EXPORTED_FUNCTIONS="['_Compress_PKLIB', '_Decompress_PKLIB', '_implode', '_malloc', '_free']" -s FILESYSTEM=0 -s CASE_INSENSITIVE_FS=1  -s EXPORT_NAME="createStormLib" -s MODULARIZE=1  -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'getValue']" -s WASM=0