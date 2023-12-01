function getFiberTypeText(coverage_area_id) {
  switch (coverage_area_id) {
    case '501000':
      return 'Fibra directa Movistar';
    case '501005':
      return 'A través de Adamo';
    case '501006':
      return 'A través de Orange';
  }
  return 'Acuerdo de fibra desconocido';
}

function displayFiberType(fiber_type_text) {
  const coverageResultContainer = document.getElementById('coverAlert');
  const fiberTypeParagraph = document.createElement('p');
  fiberTypeParagraph.classList.add('fiber-type-text');
  fiberTypeParagraph.style.fontSize = '16px';
  fiberTypeParagraph.style.color = '#000';
  fiberTypeParagraph.style.marginBottom = 0;
  fiberTypeParagraph.innerHTML = fiber_type_text;
  const alreadyAddedElement = coverageResultContainer.querySelector('p.fiber-type-text');
  if (alreadyAddedElement) {
    coverageResultContainer.replaceChild(fiberTypeParagraph, alreadyAddedElement);
  } else {
    coverageResultContainer.appendChild(fiberTypeParagraph);
  }
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
        func: displayFiberType,
        args: [getFiberTypeText(result.coverage_area_id)]
      });
    }
  }
},  { urls: ["*://o2online.es/api/coverage/telco/coverage/*"], types: ["xmlhttprequest"] });