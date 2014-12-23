rmdir build
mkdir build
CD build/
mkdir icon
mkdir js
mkdir skin
mkdir util
COPY icon/*.png build/icon
::call minifycss.bat
::call minifyjs.bat
::call update_crx.bat
::call zip.bat