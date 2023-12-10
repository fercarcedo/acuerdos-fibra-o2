function getFiberTypeText(coverage_area_id) {
  switch (coverage_area_id) {
    case '501000':
      return 'Fibra propia (Movistar)';
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
  fiberTypeParagraph.textContent = fiber_type_text;
  const alreadyAddedElement = coverageResultContainer.querySelector('p.fiber-type-text');
  if (alreadyAddedElement) {
    coverageResultContainer.replaceChild(fiberTypeParagraph, alreadyAddedElement);
  } else {
    coverageResultContainer.appendChild(fiberTypeParagraph);
  }
}

async function sendTextToTab(tabId, frameId, text) {
  await chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
    func: displayFiberType,
    args: [text]
  });
}

chrome.webRequest.onBeforeRequest.addListener(async (details) => {
  if ((details.initiator && details.initiator.startsWith('http')) || (details.originUrl && details.originUrl.startsWith('http'))) {
    await sendTextToTab(details.tabId, details.frameId, 'Cargando detalles...');
    const response = await fetch(details.url);
    const result = await response.json();
    if (result && result.optical_fiber) {
      await sendTextToTab(details.tabId, details.frameId, getFiberTypeText(result.coverage_area_id));
    }
  }
},  { urls: ["*://o2online.es/api/coverage/telco/coverage/*"], types: ["xmlhttprequest"] });