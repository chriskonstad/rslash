function clear_subreddits() {
  chrome.storage.sync.clear(function() { loadData(); });
}

function remove_subreddits() {
  var items = document.getElementById("subreddit_list").childNodes;
  var toRemove = [];

  for(var i=0; i< items.length; i++) {
    var cb = items[i].childNodes[0];
    if(cb.checked) {
      toRemove.push(cb.value);
    }
  }

  chrome.storage.sync.remove(toRemove);

  // Refresh the listing
  loadData();
}

document.getElementById("clear_subreddits").addEventListener("click",
  clear_subreddits);

document.getElementById("remove_subreddits").addEventListener("click",
  remove_subreddits);

function loadData() {
  var div = document.getElementById("subreddit_list");

  // Empty the div
  while(div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Load the stored subreddits
  chrome.storage.sync.get(null, function(items) {
    var subs = [];
    for(var key in items) {
      subs.push(key);
    }

    subs.sort();

    subs.forEach(function(key) {
      var item = document.createElement("div");
      item.className = "subreddit_item";
      var id = "subreddit_" + key;
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.name = "subreddit";
      cb.value = key;
      cb.id = id;

      var label = document.createElement("label");
      label.htmlFor = id;
      label.appendChild(document.createTextNode(key));

      item.appendChild(cb);
      item.appendChild(label);
      div.appendChild(item);
    });
  });
}

loadData();
