class JFModal {
  // Variable estática para guardar la referencia del modal abierto en pantalla
  static currentModal = null;

  static fire(options = {}) {
    // 1. Parámetros predeterminados (Valores por defecto)
    const defaults = {
      title: '',
      text: '',
      html: null,
      icon: 'info', // 'success', 'error', 'warning', 'info'
      
      // Visibilidad de botones (true para mostrar, false para ocultar)
      showOKButton: true,      // Aceptar por defecto viene activado
      showCancelButton: false,
      showYesButton: false,
      showNoButton: false,

      // Colores personalizados (null usa el color de tu CSS)
      okButtonColor: null,
      cancelButtonColor: null,
      yesButtonColor: null,
      noButtonColor: null,

      // Texto personalizado para los botones
      okTextButton: 'OK',
      cancelTextButton: 'Cancel',
      yesTextButton: 'Yes',
      noTextButton: 'No',

      // Color de fondo personalizado para el encabezado (título)
      headerColor: null,

      // Callbacks de ciclo de vida y configuración de carga
      didOpen: null, // Función que se ejecuta al abrir
      loaderType: 'spinner' // Opciones: 'hourglass', 'spinner', 'dual-ring'
    };

    // Fusionar opciones del usuario con los valores por defecto
    const config = { ...defaults, ...options };

    // Retornamos una Promesa para poder usar .then()
    return new Promise((resolve) => {
      
      // Crear el contenedor principal del modal
      const modalElement = document.createElement('div');
      modalElement.className = 'jfmodal';

      // Guardar la referencia globalmente para poder usar JFModal.close() o showLoading()
      JFModal.currentModal = modalElement;

      // Generar los botones dinámicamente según los parámetros true/false
      let buttonsHTML = '';
      
      if (config.showOKButton) {
        const style = config.okButtonColor ? `style="--btn-color: ${config.okButtonColor}; border-color: ${config.okButtonColor};"` : '';
        buttonsHTML += `<button type="button" class="jfmodal-btn jfmodal-btn-success btn-jf-ok" ${style}>${config.okTextButton}</button>`;
      }
      if (config.showYesButton) {
        const style = config.yesButtonColor ? `style="--btn-color: ${config.yesButtonColor}; border-color: ${config.yesButtonColor};"` : '';
        buttonsHTML += `<button type="button" class="jfmodal-btn jfmodal-btn-success btn-jf-yes" ${style}>${config.yesTextButton}</button>`;
      }
      if (config.showNoButton) {
        const style = config.noButtonColor ? `style="--btn-color: ${config.noButtonColor}; border-color: ${config.noButtonColor};"` : '';
        buttonsHTML += `<button type="button" class="jfmodal-btn jfmodal-btn-danger btn-jf-no" ${style}>${config.noTextButton}</button>`;
      }
      if (config.showCancelButton) {
        const style = config.cancelButtonColor ? `style="--btn-color: ${config.cancelButtonColor}; border-color: ${config.cancelButtonColor};"` : '';
        buttonsHTML += `<button type="button" class="jfmodal-btn jfmodal-btn-danger btn-jf-cancel" ${style}>${config.cancelTextButton}</button>`;
      }

      // Aplicar color dinámico al encabezado usando Variables CSS
      const headerStyle = config.headerColor ? `style="--header-bg: ${config.headerColor};"` : '';
      // Si config.html existe, usa ese HTML. Si no, usa el <p> con config.text
      const bodyContentHTML = config.html ? config.html : `<p>${config.text}</p>`;

      // Inyectar tu estructura HTML exacta usando la función del SVG
      modalElement.innerHTML = `
        <div class="jfmodal-inner">
            <div class="jfmodal-header ${headerStyle}">
                <span>${config.title}</span>
                <div class="close-icon"><svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M626.723881 334.476841 512 449.200722 397.275095 334.476841l-62.799278 62.799278 114.724905 114.724905L334.475817 626.723881l62.799278 62.799278 114.724905-114.724905 114.724905 114.724905 62.799278-62.799278L574.798255 512l114.724905-114.724905L626.723881 334.476841zM512 68.191078c-245.204631 0-443.808922 198.60429-443.808922 443.808922s198.60429 443.808922 443.808922 443.808922 443.808922-198.60429 443.808922-443.808922S757.203608 68.191078 512 68.191078zM512 867.046319c-195.71959 0-355.047342-159.327752-355.047342-355.047342s159.327752-355.047342 355.047342-355.047342 355.047342 159.327752 355.047342 355.047342S707.71959 867.046319 512 867.046319z"  /></svg></div>
            </div>
            <div class="jfmodal-body">
                <div class="jfmodal-body-inner">
                    <div class="jfmodal-icon">                        
                        ${this._getIconSymbol(config.icon)}
                    </div>
                    <div class="jfmodal-loader" style="display: none;">
                        ${this._getLoaderHTML(config.loaderType)}
                    </div>
                    <div class="jfmodal-text">
                        ${bodyContentHTML}
                    </div>
                </div>
            </div>
            <div class="jfmodal-footer">
                ${buttonsHTML}
            </div>
        </div>
      `;

      // Agregar el modal al documento para mostrarlo
      document.body.appendChild(modalElement);

      // Función interna para remover el modal de la pantalla
      const closeModal = () => {
        modalElement.classList.add('fade-out');
        setTimeout(() => { modalElement.remove(); }, 250);
      };

      // Asignar eventos de clic y retornar la respuesta en el .then()
      
      if (config.showOKButton) {
        modalElement.querySelector('.btn-jf-ok').addEventListener('click', () => {
          closeModal();
          resolve({ isConfirmed: true, value: 'ok' });
        });
      }

      if (config.showYesButton) {
        modalElement.querySelector('.btn-jf-yes').addEventListener('click', () => {
          closeModal();
          resolve({ isConfirmed: true, value: 'yes' });
        });
      }

      if (config.showNoButton) {
        modalElement.querySelector('.btn-jf-no').addEventListener('click', () => {
          closeModal();
          resolve({ isConfirmed: false, value: 'no' });
        });
      }

      if (config.showCancelButton) {
        modalElement.querySelector('.btn-jf-cancel').addEventListener('click', () => {
          closeModal();
          resolve({ isConfirmed: false, value: 'cancel' });
        });
      }

      modalElement.querySelector('.close-icon').addEventListener('click', () => {
        closeModal();
        resolve({ isConfirmed: false, value: 'cancel' });
      });

      if (typeof config.didOpen === 'function') {
        config.didOpen();
      }
    });
  }

  // Método estático público para mostrar el estado de carga
  static showLoading() {
    const modal = JFModal.currentModal;
    if (!modal) return;

    const iconContainer = modal.querySelector('.jfmodal-icon');
    const loaderContainer = modal.querySelector('.jfmodal-loader');
    const footerContainer = modal.querySelector('.jfmodal-footer');
    const closeIconContainer = modal.querySelector('.close-icon');

    // Ocultar ícono y pie de página con botones
    if (iconContainer) iconContainer.style.display = 'none';
    if (footerContainer) footerContainer.style.display = 'none';
    if (closeIconContainer) closeIconContainer.style.display = 'none';
    
    // Mostrar la animación del cargador de manera centrada
    if (loaderContainer) loaderContainer.style.display = 'block';
  }

  // Método estático público para cerrar el modal con efecto Fade Out
  static close() {
    const modal = JFModal.currentModal;
    if (!modal) return;

    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.remove();
      JFModal.currentModal = null; // Limpiar referencia
    }, 250);
  }

  // Renderizador interno de la estructura del cargador seleccionado
  static _getLoaderHTML(type) {
    switch (type) {
      case 'hourglass':
        return `<div class="jf-lds-hourglass"></div>`;
      case 'dual-ring':
        return `<div class="jf-lds-dual-ring"></div>`;
      case 'spinner':
      default:
        return `<div class="jf-lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    }
  }

  // Mapeo dinámico de SVGs según el tipo de ícono elegido
  static _getIconSymbol(icon) {
    const icons = {
      error: `
        <svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m44.245333-469.333333l159.914667-159.914667a31.274667 31.274667 0 1 0-44.245333-44.245333L512 467.754667 352.085333 307.84a31.274667 31.274667 0 1 0-44.245333 44.245333L467.754667 512l-159.914667 159.914667a31.274667 31.274667 0 1 0 44.245333 44.245333L512 556.245333l159.914667 159.914667a31.274667 31.274667 0 1 0 44.245333-44.245333L556.245333 512z" fill="#F5222D" /></svg>
      `,
      success: `
        <svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m-50.432-326.101333L310.613333 504.32a32 32 0 0 0-45.226666 45.226667l174.72 174.762666a32.341333 32.341333 0 0 0 0.341333 0.341334l0.256 0.213333a32 32 0 0 0 50.048-6.144l337.450667-379.605333a32 32 0 1 0-47.872-42.496l-318.762667 358.613333z" fill="#52C41A" /></svg>
      `,
      warning: `
        <svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1001.661867 796.544c48.896 84.906667 7.68 157.013333-87.552 157.013333H110.781867c-97.834667 0-139.050667-69.504-90.112-157.013333l401.664-666.88c48.896-87.552 128.725333-87.552 177.664 0l401.664 666.88zM479.165867 296.533333v341.333334a32 32 0 1 0 64 0v-341.333334a32 32 0 1 0-64 0z m0 469.333334v42.666666a32 32 0 1 0 64 0v-42.666666a32 32 0 1 0-64 0z" fill="#FAAD14" /></svg>
      `,
      info: `
        <svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 310.277 310.277" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M155.139,0C69.592,0,0,69.598,0,155.139c0,85.547,69.598,155.139,155.139,155.139 s155.139-69.592,155.139-155.139S240.686,0,155.139,0z M167.454,248.502h-24.363V114.48h24.363V248.502z M154.721,91.77 c-8.58,0-14.678-6.647-14.678-14.953c0-8.58,6.373-15.227,15.227-15.227c9.141,0,14.965,6.647,14.965,15.227 C170.497,85.123,164.411,91.77,154.721,91.77z" fill="#3b58c7"/></svg>
      `
    };

    return icons[icon] || icons.info;
  }
}
