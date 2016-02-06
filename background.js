// Chris Konstad, 2016
// TODO remove alerts for production?

// important variables
var storage = chrome.storage.sync;
var subs = [];  // list of all subreddits
var counts = {};  // subreddit => visit count

// Mark subreddit as visited
function saveSubreddit(subreddit) {
  // Add if not already in subreddit list
  if(-1 == subs.indexOf(subreddit)) {
    subs.push(subreddit);
  }

  // Get the current visit count for the subreddit
  storage.get(subreddit, function(items) {
    var count = items[subreddit];
    if(undefined === count) {
      count = 0;
    }

    count++;

    // Save the incremented visit count for the subreddit
    counts[subreddit] = count;
    var data = {};
    data[subreddit] = count;
    storage.set(data, function() {
      if(chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        alert(chrome.runtime.lastError);
      }
    });
  });
}

function loadData() {
  console.log("loading data");
  storage.get(null, function(items) {
    subs = [];
    for(var key in items) {
        counts = items;
        subs.push(key);
    }
    //console.log(JSON.stringify(items));
    //console.log(JSON.stringify(subs));
    //console.log(JSON.stringify(counts));
  });
}

// Load the data at startup
chrome.omnibox.onInputStarted.addListener(
  function() {
    loadData();
  }
);

// Filter a list using substrings
function filterSubreddits(text, subs) {
  var ret = [];
  subs.forEach(function(sub) {
    if(-1 != sub.indexOf(text)) {
      ret.push(sub);
    }
  });
  return ret;
}

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    console.log('inputChanged: ' + text);
    // TODO add smart suggestions
    // TODO match fuzzy substrings
    // TODO sort by closeness

    // Get visited subreddits that contain the text as a substring
    var subsToSuggest = filterSubreddits(text, subs);

    // Build suggestions to display
    var suggestions = [];
    subsToSuggest.forEach(function(sub) {
      suggestions.push({
        content: sub,
        description: sub + "(" + counts[sub] + ")"
      });
    });

    // Sort by visit count
    suggestions.sort(function(a,b) {
      if(counts[a.content] < counts[b.content])
        return 1;
      else if(counts[a.content] > counts[b.content])
        return -1;
      else
        return 0;
    });
    suggest(suggestions);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(subreddit) {
    chrome.tabs.getSelected(null, function(tab){
      var url = "https://reddit.com/r/" + subreddit;
      console.log("Redirecting to: " + url);
      chrome.tabs.update(tab.id, {url: url});

      // Add subreddit to visited-subreddit list
      saveSubreddit(subreddit);
    })
  });
