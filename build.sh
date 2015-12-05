rm -r build/
mkdir build

cd src

npm prune
npm install

"C:\Program Files\WinRAR\WinRAR.exe" a -r -x*.png app.zip *
mv app.zip ./../build/app.nw

cd ..

cat ./../nwjs-v0.12.3-win-ia32/nw.exe build/app.nw > build/deckarazzi.exe
cp ./../nwjs-v0.12.3-win-ia32/nw.pak build/
cp ./../nwjs-v0.12.3-win-ia32/icudtl.dat build/

rm build/app.nw