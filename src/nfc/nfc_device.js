const { ipcRenderer } = window.require('electron');

export let on = false;
export let error = false;

ipcRenderer.on('dev.nfc.on', (ev) => {
  on = true;
});

ipcRenderer.on('dev.nfc.off', (ev) => {
  on = false;
});

ipcRenderer.on('dev.nfc.error', (ev) => {
  error = true;
  setTimeout(() => {
    error = false;
  }, 5000);
});
