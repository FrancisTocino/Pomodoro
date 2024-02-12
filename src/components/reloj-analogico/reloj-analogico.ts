import { LitElement, html, css} from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('reloj-analogico')
export class RelojAnalogico extends LitElement {

  @property({ type: String }) 
  formattedDate: string = '';


  private actualizarReloj() {
    const ahora = new Date();
    const horas = ahora.getHours() % 12; // Convertir a formato de 12 horas
    const minutos = ahora.getMinutes();
    const segundos = ahora.getSeconds();

    const degHora = (horas * 360) / 12 + (minutos * 360) / 60 / 12;
    const degMinuto = (minutos * 360) / 60 + (segundos * 360) / 60 / 60;
    const degSegundo = (segundos * 360) / 60;

    const manecillaHoras = this.shadowRoot!.querySelector('.hand--hour') as HTMLElement;
    const manecillaMinutos = this.shadowRoot!.querySelector('.hand--minute') as HTMLElement;
    const manecillaSegundos = this.shadowRoot!.querySelector('.hand--second') as HTMLElement;

    if (manecillaHoras && manecillaMinutos && manecillaSegundos) {
      manecillaHoras.style.transform = `rotate(${degHora}deg)`;
      manecillaMinutos.style.transform = `rotate(${degMinuto}deg)`;
      manecillaSegundos.style.transform = `rotate(${degSegundo}deg)`;
    }
  }


  connectedCallback() {
    super.connectedCallback();
    setInterval(() => this.actualizarReloj(), 1000); // Actualizar cada segundo
    this.updateFormattedDate();
  }

  updateFormattedDate() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    
    const fecha = new Date();
    const diaCompleto = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    const diaCompletoUpper =diaCompleto.charAt(0).toUpperCase() + diaCompleto.slice(1);
    this.formattedDate = `${diaCompletoUpper}, ${day} de ${month} de ${year}`;
  }


  static styles = css`
    /* Estilos del reloj */

    *, *::after, *::before {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    :host {
      --bkg-dark: #232946;
      --bkg-white: #fffffe;
      --dark: #121629;
      --purple: #b8c1ec;
      --pink: #eebbc3;
      --white:#fffffe;
    }
 
    .component-wrapper {
      width: fit-content;
      margin: 20px auto;

    }
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4rem;
      margin: 1rem;
    }
    
    .clock--wrapper {
      display: grid;
      place-items: center;
      gap: 2rem;
    }
    
    .clockface {
      filter: drop-shadow(2px 10px 10px var(--dark));
    }
    
    .ring--seconds {
      stroke-width: 5;
      stroke-dasharray:.1 .9; 
      stroke-dashoffset: .05;
    }
    
    .ring--hours {
      stroke-width: 10;
      stroke-dasharray:.05 .95; 
      stroke-dashoffset: .025;
    }
    
    .ring--center {
      stroke-width: 2.5;
    }
    
    .hand {
      stroke-linecap: butt;
    }
    
    .hand--hour {
      transform: rotate(45deg);
      stroke-width: 7;
    }
    
    .hand--minute {
  
      transform: rotate(93deg);
      stroke-width: 5;
    }
    
    .number {
      font-size: 1.5rem;
    }

    .fecha-wrapper{
      margin:30px auto;
      text-align:center;
    }
    .fecha-wrapper p {
      font-size: 1.5rem;
    }

    @media (prefers-color-scheme: light){
      .hand--second {
        stroke: red;
        stroke-linecap: round;
      }
      .hand--minute {
        stroke: var(--dark);
        stroke-linecap: round;
      }
      .hand--hour {
          transform: rotate(45deg);
          stroke-width: 7;
          stroke: var(--purple);
          stroke-linecap: round;
      }

      .ring--center {
        fill: var(--white);
        stroke: red;
      } 

      .ring--hours {
        fill: var(--bkg-white);
        stroke: var(--dark);
      }

      .ring--seconds {
        fill: var(--bkg-white);
        stroke: var(--dark);
      }

      .number {
        fill: var(--dark);
    
    }
  }

    @media (prefers-color-scheme: dark) {

      .hand--second {
        stroke: red;
        stroke-linecap: round;
      }
      .hand--minute {
        stroke: var(--purple);
        stroke-linecap: round;
      }
      .hand--hour {
          transform: rotate(45deg);
          stroke-width: 7;
          stroke: var(--white);
          stroke-linecap: round;
      }

      .ring--center {
        fill: var(--white);
        stroke: red;
      } 

      .ring--hours {
        fill: var(--bkg-dark);
        stroke: var(--white);
      }

      .ring--seconds {
        fill: var(--bkg-dark);
        stroke: var(--white);
      }

      .number {
        fill: var(--white);
    
    }

  }
  `;



  render() {
    return html`
    <div class="component-wrapper"> 
      <svg class="clockface" width="300" height="300" viewBox="-150 -150 300 300">
            <circle class="ring ring--seconds" r="145" pathlength="60" />
            <circle class="ring ring--hours" r="140" pathlength="12" />

            <text x="-12" y="-110" class="number">12</text>
            <text x="115" y="12" class="number">3</text>
            <text x="-10" y="120" class="number">6</text>
            <text x="-120" y="10" class="number">9</text>

            <text x="50" y="-90" class="number">1</text>
            <text x="90" y="-50" class="number">2</text>
            <text x="90" y="70" class="number">4</text>
            <text x="50" y="110" class="number">5</text>

            <text x="-70" y="110" class="number">7</text>
            <text x="-110" y="70" class="number">8</text>
            <text x="-110" y="-50" class="number">10</text>
            <text x="-70" y="-90" class="number">11</text>

            <line class="hand hand--minute" x1="0" y1="2" x2="0" y2="-110" />
            <line class="hand hand--hour" x1="0" y1="2" x2="0" y2="-70" />
            <circle class="ring ring--center" r="3" />
            <line class="hand hand--second" x1="0" y1="12" x2="0" y2="-140" />
      </svg>
      <div class="fecha-wrapper"><p>${this.formattedDate}</p></div>
  </div>
 
 `
  }

}