function clear_subreddits() {
  chrome.storage.sync.clear();
}

document.getElementById("clear_subreddits").addEventListener("click",
  clear_subreddits);
