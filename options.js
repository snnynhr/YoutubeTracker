// Saves options to chrome.storage
function save_options() {
  localStorage.setItem("storedDSS", document.getElementById('dss').value);
  localStorage.setItem("storedMin", document.getElementById('min').value);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  document.getElementById('dss').value = localStorage.getItem("storedDSS");
  document.getElementById('min').value = localStorage.getItem("storedMin");
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);