import { LitElement, html } from 'lit';

class ToDoList extends LitElement {
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
    this.openDatabaseConnection();
  }

  async openDatabaseConnection() {
    try {
      const db = await window.indexedDB.open('myDatabase', 1);
      const transaction = db.transaction('myStore', 'readonly');
      const store = transaction.objectStore('myStore');
      const request = store.getAll();
      request.onsuccess = (event) => {
        this.data = event.target.result;
        this.requestUpdate();
      };
    } catch (error) {
      console.error('Error opening database:', error);
    }
  }

  render() {
    return html`
      <ul>
        ${this.data.map((item) => html`<li>${item.name}</li>`)}
      </ul>
    `;
  }
}

customElements.define('my-database-component', MyDatabaseComponent);
