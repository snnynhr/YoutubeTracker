// Saves options to chrome.storage
function save_options() {
  localStorage.setItem("dss", document.getElementById('dss').value);
  localStorage.setItem("min", document.getElementById('min').value);
  chrome.runtime.sendMessage({greeting: "updated"}, function(response) {
  console.log(response.farewell);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  document.getElementById('dss').value = localStorage.getItem("dss");
  document.getElementById('min').value = localStorage.getItem("min");
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);