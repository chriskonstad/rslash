// TODO store all visited subreddits as strings in an array
// TODO store { subreddit: visit count } dictionary for sorting


// Load the data at startup
chrome.omnibox.onInputStarted.addListener(
  function() {
    console.log("Extension loaded");
  }
);

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(subreddit) {
    chrome.tabs.getSelected(null, function(tab){
      var url = "https://reddit.com/r/" + subreddit;
      console.log("Redirecting to: " + url);
      chrome.tabs.update(tab.id, {url: url});
    })
  });
