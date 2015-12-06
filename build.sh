rm -r build/
mkdir build

cd src

npm prune
npm install

"C:\Program Files\WinRAR\WinRAR.exe" a -r -x*.png app.zip *
mv app.zip ./../build/app.nw

cd ..

cat ./resources/nwjs-v0.12.3-win-ia32/nw.exe build/app.nw > build/DeckShot.exe
cp ./resources/nwjs-v0.12.3-win-ia32/nw.pak build/
cp ./resources/nwjs-v0.12.3-win-ia32/icudtl.dat build/

rm build/app.nw