rmdir build /S /Q
mkdir build
CD build/
mkdir icon
mkdir js
mkdir skin
mkdir util
CD ..
XCOPY icon build\icon /Y
DEL build\icon\icon.xcf
XCOPY util\jquery.min.js build\util
XCOPY skin\fonts build\skin\fonts /I
XCOPY skin\popup.png build\skin
XCOPY background.html build
XCOPY manifest.json build
XCOPY options.html build
XCOPY popup.html build
XCOPY README.md build
call compile\minifycss.bat
call compile\minifyjs.bat
call compile\update_crx.bat
call compile\zip.bat