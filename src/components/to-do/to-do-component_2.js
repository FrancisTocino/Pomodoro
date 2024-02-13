import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { openDB } from 'idb';


export class ToDoList extends LitElement {

  static get properties() {
    return {
      data: { type: Array },
    };
  }

  constructor() {
    super();
    this.data = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.connectToIDB();
  }

    static styles = css`
    /* Estilos para tu componente */

    :host {
      --bkg-dark: #232946;
      --bkg-white: #fffffe;
      --dark: #121629;
      --purple: #b8c1ec;
      --pink: #eebbc3;
      --white:#fffffe;
      --red: #d56767;
      --green: #5d9660;
      --albero:#f8f6de;
      --dark-transparent: rgba(18, 22, 41, 0.3);
      --purple-transparent: rgba(82, 123, 255, 0.3);
    
    }


    .component-title {
      font-size: 20px;
      margin-bottom: 16px;
      text-align: center;
      font-weight: bold;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      width:90%;
      padding:5px 5px;
      border: 1px solid #ccc;
      list-style-type: none;
      display:flex;
      justify-content:space-between;
      align-items: center;
      margin: 5px auto;
    }

    li:hover {
      cursor: grab;
    }

    .text-zone{
      width:100%;
      text-align: left;
    }

    .button-zone {
      text-align:right;
      min-width:160px;
    }

    .completed .task-name{
      text-decoration: line-through;
    }

    .task-name{
      padding: 5px;
    }
    .task-name:hover{
      cursor: text;
    }
    .task-name:focus{
      border:1px solid black;
      background-color: var(--albero);
      font-weight:bold;
    }



    .button-completed {
      color:var(--white);
      background-color:var(--green);
    }

    .button-todo {
      background-color:var(--red);
      color:var(--white);
    }

    .marker-icon {
      margin-right: 10px;
      width:15px;
      min-width: 15px;
      height: 15px;
      background-image:url('/src/images/icon/line_vertical_fill_icon.svg');
      background-size:cover;
      background-position:center center;
    }

    .fecha-task {
      display:block;
      font-size: 0.8rem;
      margin:3px;
    }

    .fecha-task.terminacion.visible {
      display:block;
    }

    .fecha-task.terminacion.hidden {
      display:none;
    }


    .erase-task-button {
      width:15px;
      height: 15px;
      margin-left:3px;
      border:none;
      background-color: transparent;
      background-image:url('/src/images/icon/trash_icon.svg');
      background-size:cover;
      background-position:center center;
      cursor :pointer;
    }

    .add-task-button{
      margin: 20px 0px;
      border:none;
      border-radius:50%;
      width:30px;
      height:30px;
      background-color: var(--purple);
      color:var(--white);
      font-weight:bolder;
      font-size:1.2rem;
      margin-right:10px;
      filter: drop-shadow(1px 2px 5px var(--dark));
    }

    .boton-add-wrapper{
      display:inline-flex;
      height: 30px;
      align-items: center;
      flex-wrap: nowrap;
      margin-bottom:10px;
    }

    .list-wrapper{
      width:100%;
      height:400px;
      min-height:100px;
      max-height:400px;
      background-color: var(--white);
      margin: 0 auto;
      overflow: auto;
      filter: drop-shadow(2px 10px 10px var(--dark));
    }

    .input-name{
      display:none;
    }
    .input-name.visible{
      display:inline;
      height: 20px;
      width: 375px;
      border-radius: 5px;
      background-color: var(--bkg-white);
      color: var(--dark);
      animation: apareceInput 1s ease 0s 1 normal none;
    }
    @keyframes apareceInput {
      0% {
        opacity: 0;
        transform: translateY(-10px);
      }
    
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }


    @media (prefers-color-scheme: dark) {
      .add-task-button{
        margin: 20px 0px;
        border:none;
        border-radius:50%;
        width:30px;
        height:30px;
        background-color: var(--purple);
        color:var(--dark);
        font-weight:bolder;
        font-size:1.2rem;
        margin-right:10px;
        filter: drop-shadow(1px 2px 5px var(--dark));
      }
      .list-wrapper {
        background-color: var(--bkg-dark);
      }
      .marker-icon {
        margin-right: 10px;
        width:15px;
        height: 15px;
        background-image:url('/src/images/icon/line_vertical_fill_icon_white.svg');
        background-size:cover;
        background-position:center center;
      }
      .task-name:focus{
        border:1px solid black;
        background-color: var(--albero);
        font-weight:bold;
        color:var(--dark);
      }
    }

  `;

    render() {
      return html`
      <p class="component-title">TO DO LIST</p>
      <div class="boton-add-wrapper">
        <button id="botonAdd" class="add-task-button mas" @click="${this.visualizainput}">+</button>
        <input type="text" id="inputNombre" class="input-name" placeholder="Nombre de la tarea" @keydown="${(event) => this.handleKeyDown(event)}">
      </div>
      <div class="list-wrapper">
          <ul>
            ${this.data.map(
              (task, index) => {
                return html`
                <li class="${task.completed ? 'completed' : 'todo'}" draggable="true"  
                  @dragover="${this.handleDragOver}" 
                  @drop="${this.handleDrop}" 
                  @dragstart="${(event) => this.handleDragStart(event, task.id)}">
                  <span class="marker-icon"></span>
                    <div class="text-zone">
                      <span class="task-name" contenteditable="true" @blur="${(event) => this.actualizarDato(task.id, event.target.innerText)}">${task.nombre}</span>
                    </div>
                    <div class="button-zone">
                      <p class="fecha-task creacion">Creada ${task.fechaCreacion}</p>
                      <button class="${task.completed ? 'button-completed' : 'button-todo'}" @click="${() => this.toggleTaskCompletion(task.id)}">${task.completed ? 'Ended' : 'ToDo'}</button>
                      <button class="erase-task-button" @click="${() => this.borrarElemento(task.id)}"></button>
                      <p class="fecha-task terminacion ${task.completed ? 'visible' : 'hidden'}" >Terminada ${task.fechaFin}</p>
                    </div>
                  </div>
                </li>
              `;
              }
            )}
          </ul>
      </div>
      `;
    }

    // ABRIR CONEXION CON LA BD
     connectToIDB() {
      const dbName = 'todoListBD';
      const dbVersion = 1;
      const storeName = 'tasks';
    
      const request = indexedDB.open(dbName, dbVersion);
    
      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
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
          console.log ('La transacción ha sido correcta');
        };
        const getAllRequest = store.getAll();
    
        getAllRequest.onsuccess = (event) => {
          const tasks = event.target.result;
          console.log("tasks_____: ", tasks);
          this.data = tasks
        };
    
        getAllRequest.onerror = (event) => {
          console.error('Error getting tasks from IndexedDB:', event.target.error);
        };
      };
    }

    // Función para agregar un nuevo registro a la base de datos
    agregarRegistro(nuevoDato) {
      console.log("nuevoDato: Pasado al Dar intro", nuevoDato);

    const request = window.indexedDB.open('todoListBD', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');

      const fechaCrea = this.fechaActual();

      // Agrega el nuevo dato
      const nuevoRegistro = {
        nombre: nuevoDato,
        completada: false,
        fechaCreacion: fechaCrea,
        fechaFin: 'null',
        timeSpent: 0,
      }

      store.add(nuevoRegistro);

      transaction.oncomplete = () => {
        this.connectToIDB()
      };

      transaction.onerror = () => {
        console.log('Error al agregar el dato.');
      };
    };
  }
  
    //  BORRAR TAREA
    borrarElemento(id) {
      console.log("index: ", id);
      const request = indexedDB.open('todoListBD', 1); 
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('tasks', 'readwrite'); 
        const store = transaction.objectStore('tasks');
        const deleteRequest = store.delete(id);
    
        deleteRequest.onsuccess = () => {
          console.log('Elemento borrado correctamente');
          this.connectToIDB();

        };
    
        deleteRequest.onerror = (error) => {
          console.error('Error al borrar el elemento:', error);
        };
      };
    }
    
    // ACTUALIZAR TAREA
    actualizarDato(id, nuevoNombre) {
      
      const request = indexedDB.open('todoListBD', 1); // Cambia el nombre y la versión según tu base de datos
    
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('tasks', 'readwrite'); // Cambia el nombre del objeto de almacenamiento
        const store = transaction.objectStore('tasks');
    
        // Obtén el objeto existente por su clave
        const getRequest = store.get(id);
    
        getRequest.onsuccess = (event) => {
          const objetoExistente = event.target.result;
          console.log("objetoExistente: ", objetoExistente);
    
          // Actualiza el nombre en el objeto
          objetoExistente.nombre = nuevoNombre;
          console.log("nuevoNombre Pasado: ", nuevoNombre);
    
          // Guarda el objeto actualizado
          const putRequest = store.put(objetoExistente);
    
          putRequest.onsuccess = () => {
            console.log('Dato actualizado correctamente');
          };
    
          putRequest.onerror = (error) => {
            console.error('Error al actualizar el dato:', error);
          };
        };
      };
    }


    // MANEJO DE EVENTOS
    // MANEJADOR DE DRAG AND DROP

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      const inputNombre = this.shadowRoot.getElementById('inputNombre');
      if (inputNombre) {
        const nombreTarea = inputNombre.value;
        if (nombreTarea) {
          console.log("nombreTarea: ", nombreTarea);
          this.agregarRegistro(nombreTarea);
          inputNombre.value = '';
        }
      }
    }
  }

  toggleTaskCompletion(taskId) {
    const fechaFinalizacion = this.fechaActual();
    this.data = this.data.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed, fechaFin: fechaFinalizacion } : task
    );

  }


  handleDragStart(e, taskId) {
    console.log("taskId: ", taskId);
    // Al comienzo del arrastre, establece el identificador de la tarea en el evento de arrastre
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', taskId.toString());
    }
  }

  handleDragOver(event) {
    // Evita el comportamiento predeterminado para permitir el soltar
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    // Al soltar, obtén el identificador de la tarea y reordena la lista
    if (event.dataTransfer) {
      const taskId = parseInt(event.dataTransfer.getData('text/plain'), 10);
      const fromIndex = this.data.findIndex(task => task.id === taskId);
      const toIndex = this.getDropIndex(event.clientY);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        this.data.splice(toIndex, 0, this.data.splice(fromIndex, 1)[0]);
        this.requestUpdate();
      }
    }
  }

  getDropIndex(y) {
    // Calcula el índice de destino basado en la posición del puntero
    const rect = this.getBoundingClientRect();
    const relativeY = y - rect.top;
    const taskHeight = rect.height / this.data.length;
    return Math.floor(relativeY / taskHeight);
  }



 // OTRAS  FUNCIONES 
  visualizainput(){
    const inputNombre = this.shadowRoot.getElementById('inputNombre');
    if(inputNombre){
      inputNombre.classList.add ('visible');
    }
    const botonAdd = this.shadowRoot.getElementById('botonAdd');  
    if(botonAdd){
      if (botonAdd.classList.contains ('mas')){
        botonAdd.classList.replace ('mas', 'menos');
        botonAdd.innerText = '-';
      }else {
        botonAdd.classList.replace ('menos', 'mas');
        botonAdd.innerText = '+';
        inputNombre.classList.remove ('visible');
      }
    }
  }

  fechaActual(){
    const fechaActual = new Date();
    const dd = String(fechaActual.getDate()).padStart(2, '0');
    const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const yyyy = fechaActual.getFullYear();

    const fechaFormateada = `${dd}/${mm}/${yyyy}`;
    console.log("fechaFormateada: ", fechaFormateada);
      return fechaFormateada;
    
  }


} // DEL COMPONENTE

customElements.define('todo-list-componente', ToDoList);