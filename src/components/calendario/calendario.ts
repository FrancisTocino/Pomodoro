import { LitElement, html, css} from 'lit';
import { customElement, property  } from 'lit/decorators.js';

import '@fortawesome/fontawesome-free/css/all.css';

@customElement('calendario-componente')
export class CalendarioComponente extends LitElement {
  @property({ type: Number }) mes: number = new Date().getMonth();
  @property({ type: Number }) anio: number = new Date().getFullYear();
  @property({ type: Number }) diaActual: number = new Date().getDate(); 


  connectedCallback() {
    super.connectedCallback();
    this.actualizarFecha();
  }

  actualizarFecha() {
    // Se utiliza el primer día del mes actual para obtener el día de la semana y la cantidad de días en el mes.
    const primerDiaMes = new Date(this.anio, this.mes, 1);
    const diasEnMes = new Date(this.anio, this.mes + 1, 0).getDate();
    const primerDiaSemana = primerDiaMes.getDay()-1; // 0 (domingo) a 6 (sábado)

    // Lógica para crear la cuadrícula del calendario
    const cuadricula: number[][] = [];
    let dia = 1;

    for (let i = 0; i < 6; i++) {
      cuadricula[i] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < primerDiaSemana) {
          cuadricula[i][j] = 0; // Espacios vacíos antes del primer día del mes
        } else if (dia <= diasEnMes) {
          cuadricula[i][j] = dia; // Días del mes
          dia++;
        }
      }
    }

    return cuadricula;
  }

  mesAnterior() {
    this.mes = (this.mes - 1 + 12) % 12;
    if (this.mes === 11) {
      this.anio--;
    }
    this.requestUpdate();
  }

  mesSiguiente() {
    this.mes = (this.mes + 1) % 12;
    if (this.mes === 0) {
      this.anio++;
    }
    this.requestUpdate();
  }

  static styles = css`
  :host {
    display: block;
    --bkg-dark: #232946;
    --bkg-white: #fffffe;
    --dark: #121629;
    --purple: #b8c1ec;
    --pink: #eebbc3;
    --white:#fffffe;
    --dirty:#fafafa;
  }

  .component-wrapper {
    margin: 20px auto;

  }

  .calendario {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    text-align: center;
    margin-bottom:30px;
    font-weight: bold;
  }


  .dias-semana {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    font-weight: bold;
    text-align:center;
    border-bottom:1px solid var(--dark, #121629 );
    margin-bottom:10px;
  }

  .mes-anio {
    font-size: 20px;
    margin-bottom: 16px;
    text-align:center;
    font-weight: bold;
  }

  .botones {
    margin-top: 16px;
    display: flex;
    justify-content: center;
  }

.botones .anterior, .botones .siguiente {
  background:transparent;
  margin-right:20px;
  border:none;
}
  .domingo {
    color: red;
  }

  .sabado {
    border-left: 1px solid var(--bkg-dark, #121629);
  }

  .anterior-icon {
    content:'';
    width:40px;
    height:40px;
    background-image: url('/src/images/icon/left_arrow_icon_purple.svg');
    background-position: center center;
    background-size: cover;
  }

  .siguiente-icon {
    content:'';
    width:40px;
    height:40px;
    background:transparent;
    background-image: url('/src/images/icon/right_arrow_icon_purple.svg');
    background-position: center center;
    background-size: cover;
  }
  

  @media (prefers-color-scheme: light){

    .component-wrapper {
      background: var(--bkg-white);
      filter: drop-shadow(2px 10px 10px var(--dark, #121629));
      padding:20px 0px;
  }

    .dias-semana {
      border-bottom:1px solid var(--dark, #121629 );
    }
  
   
    
    .domingo {
      color: red;
    }
  
    .sabado {
      border-left: 1px solid var(--bkg-dark, #121629);
    }
  
    .botones.anterior:before {
      color: var(--white, #fffffe);

    }  


    .dia-actual {
      border: 1px solid var(--dark, #121629 );
      border-radius:5px;
    }

  }

  @media (prefers-color-scheme: dark){

    .component-wrapper {
        background: var(--bkg-dark);
        filter: drop-shadow(2px 10px 10px var(--dark, #121629));
        padding:20px 0px;
    }
    
    .dias-semana {
      border-bottom:1px solid var(--white, #fafafac );
    }
  


    
    .domingo {
      color: red;
    }
  
    .sabado {
      border-left: 1px solid var(--white, #121629);
    }
  
    .botones.anterior:before {
      color: var(--dark, #fffffe);

    }  
    .botones.siguiente:before {
      color: var(--dark, #fffffe);
    }
    .dia-actual {
      border: 1px solid var(--dirty, #121629 );
      border-radius:5px;
    }

  }



`;


  render() {
    const cuadricula = this.actualizarFecha();

    return html`
    <div class="component-wrapper">
        <div class="mes-anio">${this.obtenerNombreMes()} ${this.anio}</div>
        <div class="dias-semana">
          <div>L</div>
          <div>M</div>
          <div>X</div>
          <div>J</div>
          <div>V</div>
          <div>S</div>
          <div>D</div>
        </div>
        <div class="calendario">
          ${cuadricula.map(
            (semana) =>
              html`
                ${semana.map(
                  (dia,index) =>
                    html`
                    <div class="${dia !== 0 ? 
                      (index === 5 ? 'sabado' : '') + (this.esDomingo(dia) ? ' domingo' : '') + (dia === this.diaActual ? ' dia-actual' : '')
                      : ''}">
                          ${dia !== 0 ? dia : ''}
                    `
                )}
              `
          )}
        </div>
        <div class="botones">
          <button class="botones anterior" @click=${this.mesAnterior}><span class="anterior-icon"></span></button>
          <button class="botones siguiente" @click=${this.mesSiguiente}><span class="siguiente-icon"></span></button>
        </div>
     </div>     
  `;

}

esDomingo(dia: number) {
  const primerDiaMes = new Date(this.anio, this.mes, 1);
  const primerDiaSemana = primerDiaMes.getDay()-1;
  return (dia + primerDiaSemana - 1) % 7 === 6;
}


  obtenerNombreMes() {
    const nombresMeses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return nombresMeses[this.mes];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'calendario-componente': CalendarioComponente;
  }
}
