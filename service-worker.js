chrome.webRequest.onCompleted.addListener((details) => {
  if (details.initiator.startsWith('http')) {
    fetch(details.url)
      .then(res => res.json())
      .then(res => console.log(res));
  }
},  { urls: ["*://o2online.es/api/coverage/telco/coverage/*"], types: ["xmlhttprequest"] });