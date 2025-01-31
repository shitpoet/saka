import browser from 'webextension-polyfill';
import 'msg/server.js';
import { tabHistory, recentlyClosed } from './tabHistory.js';

window.tabHistory = tabHistory;
window.recentlyClosed = recentlyClosed;

let lastTabId;

async function toggleSaka(tabId, mode = 'bookmarks') {
  if (SAKA_DEBUG) console.group('toggleSaka');
  // Get the specified tab, or the current tab if none is specified
  const currentTab =
    tabId === undefined
      ? (await browser.tabs.query({
          active: true,
          currentWindow: true
        }))[0]
      : await browser.tabs.get(tabId);
  if (currentTab) {
    // If the current tab is Saka, switch to the previous tab (if it exists) and close the current tab
    if (currentTab.url === browser.runtime.getURL('saka.html')) {
      if (lastTabId) {
        try {
          const lastTab = await browser.tabs.get(lastTabId);
          if (lastTab) {
            try {
              await browser.tabs.update(lastTabId, { active: true });
              if (SAKA_DEBUG) console.log(`Switched to tab ${lastTab.url}`);
            } catch (e) {
              if (SAKA_DEBUG)
                console.error(`Failed to switch to tab ${lastTab.url}`);
            }
          }
          lastTabId = undefined;
        } catch (e) {
          if (SAKA_DEBUG)
            console.error(
              `Cannot return to tab ${lastTabId} because it no longer exists`
            );
        }
      }
      try {
        await browser.tabs.remove(currentTab.id);
        if (SAKA_DEBUG) console.log(`Removed tab ${currentTab.url}`);
      } catch (e) {
        if (SAKA_DEBUG) console.error(`Failed to remove tab ${currentTab.url}`);
      }
    } else {
      // Otherwise, try to load Saka into the current tab
      try {
        await browser.tabs.executeScript(currentTab.id, {
          file: '/toggle_saka_' + mode + '.js',
          runAt: 'document_start',
          matchAboutBlank: true
        });
        if (SAKA_DEBUG) console.log(`Loaded Saka into tab ${currentTab.url}`);
      } catch (e) {
        // If loading Saka into the current tab fails, create a new tab
        try {
          const screenshot = await browser.tabs.captureVisibleTab();
          await browser.storage.local.set({ screenshot });
        } catch (screenshotError) {
          if (SAKA_DEBUG)
            console.error('Failed to capture visible tab: ', screenshotError);
        }
        lastTabId = currentTab.id;
        await browser.tabs.create({
          url: '/saka.html',
          index: currentTab.index,
          active: false
        });
        if (SAKA_DEBUG)
          console.warn(
            `Failed to execute Saka into tab. Instead, created new Saka tab after ${
              currentTab.url
            }`
          );
      }
    }
  } else {
    // If tab couldn't be found (e.g. because query was made from devtools) create a new tab
    await browser.tabs.create({
      url: '/saka.html'
    });
    if (SAKA_DEBUG)
      console.log("Couldn't find tab. Instead, created new Saka tab.");
  }
  const window = await browser.windows.getLastFocused();
  await browser.windows.update(window.id, { focused: true });
  if (SAKA_DEBUG) console.groupEnd();
}

async function closeSaka(tab) {
  if (tab) {
    if (tab.url === browser.runtime.getURL('saka.html')) {
      await browser.tabs.remove(tab.id);
    } else {
      await browser.tabs.executeScript(tab.id, {
        file: '/toggle_saka.js',
        runAt: 'document_start',
        matchAboutBlank: true
      });
    }
  }
}

async function saveSettings(searchHistory) {
  await browser.storage.sync.set({ searchHistory: [...searchHistory] });
}

async function search(searchString) {
  // console.log('search src/background_page/index.js ' + searchString)
  // alert('search for ' + searchString)
  searchString = searchString.trim()

  // feeling lucky search vs. normal search
  let lucky = false
  if (searchString.startsWith('\\') || searchString.endsWith('\\')) {
    if (searchString.startsWith('\\')) searchString = searchString.slice(1).trim()
    if (searchString.endsWith('\\')) searchString = searchString.slice(0, -1).trim()
    lucky = true
  }
  if (searchString.startsWith('>') || searchString.endsWith('>')) {
    if (searchString.startsWith('>')) searchString = searchString.slice(1).trim()
    if (searchString.endsWith('>')) searchString = searchString.slice(0, -1).trim()
  }
  if (searchString.startsWith('<') || searchString.endsWith('<')) {
    if (searchString.startsWith('<')) searchString = searchString.slice(1).trim()
    if (searchString.endsWith('<')) searchString = searchString.slice(0, -1).trim()
  }
  let baseUrl = 'https://www.google.com/search?q=' + encodeURIComponent(searchString)
  let searchUrl = baseUrl + (lucky ? '&btnI=I%27m+Feeling+Lucky' : '')
  /*await browser.tabs.create({
    url: searchUrl,
    active: true
  });*/
  chrome.tabs.query({
    active: true, currentWindow: true
  }, tabs => {
    let index = tabs[0].index;
    chrome.tabs.create({
      url: searchUrl,
      index: index + 1,
      active: true
    });
  });
}

browser.browserAction.onClicked.addListener(() => {
  toggleSaka();
});

browser.commands.onCommand.addListener(command => {
  switch (command) {
    case 'toggleSaka':
      toggleSaka(undefined, 'tabs');
      break;
    case 'toggleSaka2':
    case 'toggleSaka3':
    case 'toggleSaka4':
      toggleSaka();
      break;
    default:
      console.error(`Unknown command: '${command}'`);
  }
});

browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.key) {
    case 'toggleSaka':
      toggleSaka();
      break;
    case 'closeSaka':
      await saveSettings(message.searchHistory);
      closeSaka(sender.tab);
      break;
    case 'search':
      await search(message.searchString);
      //closeSaka(sender.tab);
      break;
    default:
      console.error(`Unknown message: '${message}'`);
  }
});

browser.runtime.onMessageExternal.addListener(message => {
  switch (message) {
    case 'toggleSaka':
      toggleSaka();
      break;
    default:
      console.error(`Unknown message: '${message}'`);
  }
});

/*browser.contextMenus.create({
  title: 'Saka',
  contexts: ['all'],
  onclick: () => toggleSaka()
});*/
