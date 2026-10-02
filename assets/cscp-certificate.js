(function () {
  const trigger = document.querySelector('.certification-preview-trigger');
  const dialog = document.getElementById('cscp-certificate-dialog');
  const closeButton = dialog && dialog.querySelector('.cscp-certificate-dialog-close');

  if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;

  trigger.addEventListener('click', function () {
    dialog.showModal();
  });

  closeButton.addEventListener('click', function () {
    dialog.close();
  });

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
})();
