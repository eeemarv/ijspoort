const download = (data, filename, type) => {
  let file = new Blob([data], {type: type});
  let a = document.createElement('a');
  let url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

export { download };