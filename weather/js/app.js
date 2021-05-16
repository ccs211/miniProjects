const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
  e.preventDefault();


//  validar
const ciudad = document.querySelector('#ciudad').value;
const pais = document.querySelector('#pais').value;

if(ciudad === '' || pais === '') {
  mostrarError('Ambos campos son obligatorios')

  return;
}
// console.log(ciudad)
// console.log(pais)


// consultar API
consultarAPI(ciudad, pais);

}

function mostrarError(msg) {
  const alerta = document.querySelector('.bg-red-100');

  if(!alerta) {
    // crear alerta
    const alerta = document.createElement('div');
  
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
  
    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block">${msg}</span>
    `;
  
    container.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000 )
  }

}

function consultarAPI(ciudad, pais) {
  const appId = '1786f886d9e70523541ef6e2088819af';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  spinner();

  fetch(url)
      .then(res => res.json())
      .then(datos => {
        limpiarHTML(); // limpia el html previo
        if(datos.cod === '404') {
          mostrarError('Ciudad no encontrada')
          return;
        }

        // imprime la respuesta en el html
        mostrarClima(datos);
      })
}

function mostrarClima(datos) {
  const { name, main: {temp, temp_max, temp_min} } = datos;

  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);
  // console.log(temp)

  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add('font-bold', 'text-2xl')

  const actual = document.createElement('p');
  actual.innerHTML = `${centigrados} &#8451;`;
  actual.classList.add('font-bold', 'text-6xl');

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Max: ${max}&#8451;`;
  tempMaxima.classList.add('text-xl');

  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Min: ${min}&#8451;`;
  tempMinima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
  while(resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function spinner() {

  limpiarHTML();

  const divSpinner = document.createElement('div');
  divSpinner.classList.add('sk-folding-cube');

  divSpinner.innerHTML = `
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
  `;

  resultado.appendChild(divSpinner);
}