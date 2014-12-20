chrome.extension.sendMessage({msg: "track"});
var target = document.querySelector('head > title');
var observer = new window.WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
		chrome.extension.sendMessage({msg: "track"});
        //console.log('new title:', mutation.target.textContent);
    });
});
observer.observe(target, { subtree: true, characterData: true, childList: true });