cd js
DEL "..\build\js\*.js"
for /r %%i in (*.js) do java -jar "C:\Users\Sunny Nahar\Desktop\Computer Science\Optimization\closure_compiler.jar" --js "%%i" --js_output_file "..\build\js\%%~ni.js"
cd ..