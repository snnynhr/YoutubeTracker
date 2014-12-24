cd skin
DEL "..\build\skin\*.css"
for /r %%i in (*.css) do java -jar "C:\Users\Sunny Nahar\Desktop\Computer Science\Optimization\yuicompressor-2.4.8.jar" "%%i" -o "..\build\skin\%%~ni.css"
cd ..