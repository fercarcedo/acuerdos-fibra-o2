function changeBackgroundColor() {
  const coverageResultContainer = document.getElementById('coverAlert');
  const fiberTypeParagraph = document.createElement('p');
  fiberTypeParagraph.style.fontSize = '16px';
  fiberTypeParagraph.style.color = '#000';
  fiberTypeParagraph.style.marginBottom = 0;
  fiberTypeParagraph.innerHTML = 'A través de Adamo';
  coverageResultContainer.appendChild(fiberTypeParagraph);
}

chrome.webRequest.onCompleted.addListener(async (details) => {
  if (details.initiator.startsWith('http')) {
    console.log(JSON.stringify(details));
    const response = await fetch(details.url);
    const result = await response.json();
    if (result && result.optical_fiber) {
      console.log(result.coverage_area_id);
      await chrome.scripting.executeScript({
        target: { tabId: details.tabId, frameIds: [details.frameId] },
        func: changeBackgroundColor,
      });
    }
  }
},  { urls: ["*://o2online.es/api/coverage/telco/coverage/*"], types: ["xmlhttprequest"] });