// cronometro-componente.js
import { LitElement, html, css } from 'lit';

class CronometroComponente extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      font-size: 24px;
      margin: 20px;
    }

    button {
      font-size: 18px;
      margin: 5px;
      padding: 10px;
      cursor: pointer;
    }

    .drop-zone {
      width: 300px;
      height: 100px;
      border: 2px dashed #ccc;
      padding: 20px;
    }

    .draggable-item {
      width: 100px;
      height: 100px;
      background-color: blue;
      border: 1px solid #999;
      cursor: move;
    }
  `;

  static properties = {
    segundos: { type: Number },
    running: { type: Boolean },
  };

  constructor() {
    super();
    this.segundos = 0;
    this.running = false;
  }

  connectedCallback() {
    super.connectedCallback();

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
    `;
  }

  formatTiempo() {
    const minutos = Math.floor(this.segundos / 60);
    const segundos = this.segundos % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }

  toggleCronometro() {
    if (this.running) {
      this.stopCronometro();
    } else {
      this.startCronometro();
    }
  }

  startCronometro() {
    this.running = true;
    this.intervalId = setInterval(() => {
      this.segundos++;
      this.requestUpdate();
    }, 1000);
  }

  stopCronometro() {
    this.running = false;
    clearInterval(this.intervalId);
  }

  resetCronometro() {
    this.stopCronometro();
    this.segundos = 0;
  }


  handleDragStart(event) {
    event.dataTransfer.setData('text/plain', 'Dragged Item');
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    //event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');

    // Crear un nuevo elemento en la drop-zone
    const dropZone = this.shadowRoot.querySelector('.drop-zone-wrapper');
    const newItem = document.createElement('div');
    newItem.textContent = data;
    newItem.className = 'draggable-item';
    dropZone.appendChild(newItem);


    console.log('Elemento soltado justo aqui:', data);
  }






}

customElements.define('cronometro-componente', CronometroComponente);
