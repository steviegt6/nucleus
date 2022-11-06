module.exports = (o, n) => {
  const settings = vibe?.enabled === true ? {
    backgroundColor: '#00000000',
    show: n === 'config',
    // menubar: false,
  } : {
    backgroundColor: '#2f3136',
  };
  const w = new (require('electron').BrowserWindow)({
    frame: false,
    resizable: false,
    center: true,
    webPreferences: {
      preload: require('path').join(__dirname, '..', n, 'preload.js')
    },
    ...settings,
    ...o
  });

  const c = w.webContents;
  c.once('dom-ready', () => {
    if (oaConfig.themeSync !== false) try {
      c.insertCSS(JSON.parse(require('fs').readFileSync(require('path').join(require('../paths').getUserData(), 'userDataCache.json'), 'utf8')).openasarSplashCSS);
    } catch { }
  });

  // TODO: some way to configure this like in appConfig.js
  w.loadURL('https://cdn.nucleus.tomat.dev/' + n + '?v=' + oaVersion);

  if (vibe?.enabled === true) {
    w.webContents.insertCSS(`html, body { background: transparent !important; }`);
    vibe.applyEffect(w, 'acrylic');
  }
  return w;
};