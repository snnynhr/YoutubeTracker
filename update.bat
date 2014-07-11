set ext=%CD%
set key=%CD%.pem 
set src=%CD%.crx
DEL YouTubeTracker.crx
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --pack-extension="%ext%" --pack-extension-key="%key%"
COPY "%src%" YouTubeTracker.crx /y