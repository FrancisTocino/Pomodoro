// cronometro-componente.js
import { LitElement, html, css } from 'lit';

class CronometroComponente extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      font-size: 24px;
      margin: 20px;

      --bkg-dark: #232946;
      --bkg-white: #fffffe;
      --dark: #121629;
      --purple: #b8c1ec;
      --pink: #eebbc3;
      --white:#fffffe;
  
    }

    button {
      font-size: 18px;
      margin: 5px;
      padding: 10px;
      cursor: pointer;
    }
    .drop-zone-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .drop-zone {
      width: 50%;
      height: 50px;
      margin-top:30px;
      background: rgba(110, 110, 110, .8);
      border: 2px dashed #ccc;
      padding: 5px;
      font-size:0.8rem;
    }

    .draggable-item {
      width: 100%;
      padding: 5px 5px;
      border: 1px solid #ccc;
      list-style-type: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 5px auto;
      fontFamily: Verdana;
      font-size:12px;
      margin-top:10px;
  
    }
    .erase-task-button {
      width: 15px;
      height: 15px;
      margin-left: 3px;
      border: none;
      background-color: transparent;
      background-image: url(/src/images/icon/trash_icon.svg);
      background-size: 15px 15px;
      background-position: center;
      cursor: pointer;
      background-repeat: no-repeat;
  }

  `;

  static properties = {
    segundos: { type: Number },
    running: { type: Boolean },
    tiempoTranscurrido: { type: Number },
  };

  static get properties() {
    return {
      data: { type: Array },
    };
  }

  constructor() {
    super();
    this.segundos = 0;
    this.running = false;
    this.tiempoTranscurrido = 0; 
    this.sumaTiempos = 0;
    this.data = [];
  }

  connectedCallback() {
    super.connectedCallback();
    // Conexión Base de Datos
    this.connectToIDB();
    // Event listeners for drag and drop
    this.addEventListener('dragstart', this.handleDragStart);
    this.addEventListener('dragover', this.handleDragOver);
    this.addEventListener('drop', this.handleDrop);
  }

  render() {
    return html`
      <div>${this.formatTiempo()}</div>
      <button @click="${this.toggleCronometro}">${this.running ? 'Pausar' : 'Iniciar'}</button>
      <button @click="${this.resetCronometro}">Reiniciar</button>
      <div class="drop-zone-wrapper">
          <div class="drop-zone" @dragover="${this.handleDragOver}">
            <p>Arrastra una tarea aquí</p>
          </div>
      </div>
      <div id="timeSpent">Tiempo transcurrido: </div>
      
    `;
  }


  connectToIDB() {
    const dbName = 'todoListBD';
    const dbVersion = 1;
    const storeName = 'tasks';
  
    const request = indexedDB.open(dbName, dbVersion);
  
    request.onerror = (event) => {
      //console.error('Error opening IndexedDB:', event.target.error);
    };
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      transaction.oncomplete = (event) => {
        //console.log ('La transacción ha sido correcta');
      };
      const getAllRequest = store.getAll();
  
      getAllRequest.onsuccess = (event) => {
        const tasks = event.target.result;
        //console.log("tasks_____ de Croometro: ", tasks);
        this.data = tasks
      };
  
      getAllRequest.onerror = (event) => {
        //console.error('Error getting tasks from IndexedDB:', event.target.error);
      };
    };
  }

  formatTiempo() {
    const horas = Math.floor(this.segundos / 3600);
    const minutos = Math.floor(this.segundos / 60);
    const segundos = this.segundos % 60;
    const tiempoTranscurrido = `${horas< 10 ? '0' : ''}${horas} : ${minutos< 10 ? '0' : ''}${minutos} : ${segundos < 10 ? '0' : ''}${segundos}`
    return tiempoTranscurrido;
  }

  formatTiempoTranscurrido(tiempo) {
    const horas = Math.floor(tiempo / 3600);
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    const tiempoTranscurrido = `${horas< 10 ? '0' : ''}${horas} : ${minutos< 10 ? '0' : ''}${minutos} : ${segundos < 10 ? '0' : ''}${segundos}`
    //console.log("tiempoTranscurrido: ", tiempoTranscurrido);
    return tiempoTranscurrido;
  }

  toggleCronometro() {
    if (this.running) {
      this.stopCronometro();
    } else {
      this.startCronometro();
    }
  }

  startCronometro() {
    const dropZone = this.shadowRoot.querySelector('.drop-zone-wrapper');
    const elementosActuales = dropZone.getElementsByClassName('draggable-item');
    //console.log("elementInDropZone: ", elementosActuales);
    if (elementosActuales.length === 0) {
        alert ('No hay ninguna tarea arrastrada a la zona del Cronómetro');
    }else {
      this.running = true;
      this.intervalId = setInterval(() => {
        this.segundos++;
        }, 1000);
    }
  }

  stopCronometro() {
    this.running = false;
    clearInterval(this.intervalId);
  }

  resetCronometro() {
    // recojo el tiempo transcurrido
    this.sumaTiempos = this.sumaTiempos + this.segundos
    //console.log("tiempoTranscurrido: ", this.tiempoTranscurrido);
    //console.log("this.segundos: ", this.segundos);
    //console.log("sumaTiempos: ", this.sumaTiempos);
   
    // Formaciín de un nuevo div con la informaciín del tiempo transcurrido
    const divtimeSpent = this.shadowRoot.querySelector('#timeSpent');
    if(this.segundos === 0){
      alert ('Tiempo 0 . No se Registra');
    }else{
      divtimeSpent.innerText = this.formatTiempoTranscurrido(this.sumaTiempos);
    }

  
    // Sigo con la lógica del Cronómetro
    this.stopCronometro();
    this.segundos = 0;
    this.requestUpdate();
  }

  deletetaskInDropZone(newItem){
    const divtimeSpent = this.shadowRoot.querySelector('#timeSpent');
    newItem.addEventListener('click', () => {
      this.toggleCronometro();
      divtimeSpent.innerText = this.formatTiempoTranscurrido(0);
      newItem.remove();
      this.stopCronometro();
      this.segundos = 0;
      this.sumaTiempos = 0;
      this.requestUpdate();
    });

  }


  handleDragStart(event) {
    event.dataTransfer.setData('text/plain', 'Dragged Item');
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    const idDelRegistroArrastrado = event.dataTransfer.getData('text/plain');
    const tareaArrastrada = this.data.find(data => data.id === parseInt(idDelRegistroArrastrado));
  
    // Verificar si ya hay un elemento en la drop-zone
    const dropZone = this.shadowRoot.querySelector('.drop-zone-wrapper');
    const elementosActuales = dropZone.getElementsByClassName('draggable-item');
  
    // Si no hay elementos actuales, crear uno nuevo
    if (elementosActuales.length === 0) {
      const newItem = document.createElement('div');
      const contexto = `<span class="draggable-item" >${tareaArrastrada.nombre}  ${tareaArrastrada.fechaCreacion}<button class="erase-task-button"></button></span>`;
      const divtimeSpent = this.shadowRoot.querySelector('#timeSpent');
      newItem.innerHTML = contexto;
      dropZone.appendChild(newItem);
      //console.log('Elemento soltado justo aquí:', newItem);
      newItem.querySelector('.erase-task-button')
      this.deletetaskInDropZone(newItem);
    } else {
      alert('Ya hay un elemento en la drop-zone. No se puede agregar otro.');
    };
  }
  



}// DEL COMPONENTE

customElements.define('cronometro-componente', CronometroComponente);
