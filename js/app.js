const critoMonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptos()
    formulario.reset()
    formulario.addEventListener('submit', enviarFormulario);
     critoMonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor); 

})

function consultarCriptos(){
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptos => selectCriptos(criptos))
}


// Crear un promise
function obtenerCriptomonedas(criptos){
    return new Promise ( resolve => {
        resolve(criptos)
    });
}
function selectCriptos(criptos) {
    criptos.forEach(cripto => {
        const { FullName, Name} = cripto.CoinInfo

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        critoMonedasSelect.appendChild(option)
    });
}
const leerValor = (e) => {
    // Asigna valor a cada propieda de acuerdo al name del input
    objBusqueda[e.target.name] = e.target.value

}
const enviarFormulario = (e) => {
    e.preventDefault()
    const  {
        moneda,
        criptomoneda
    } = objBusqueda
    if( moneda === '' || criptomoneda === '') {
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }
    // consultar api
    consultarApi();
}

const mostrarAlerta = ( msg ) => {
    const error = document.querySelector('.error');
    if(!error){
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('error')
        divAlerta.textContent = msg;
        formulario.appendChild(divAlerta);
        setTimeout(() => {
            divAlerta.remove()
        }, 2000)
    }

    
}
const consultarApi = () => {
    const  {
        moneda,
        criptomoneda
    } = objBusqueda
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner();
    fetch(url)
    .then(resultado => resultado.json())
    .then(cotizacion => {
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]  )
    })

}

const mostrarCotizacion = (cotizacion) => {
    limpiarHTML(resultado)
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
    El precio es : <span>${PRICE}</span>
    `;
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del dia <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del dia <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('p');
    precioBajo.innerHTML = `Variación ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`

   const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualización <span>${LASTUPDATE}</span>`


    resultado.append(precio, precioAlto, precioBajo, ultimasHoras, ultimaActualizacion)
}
const limpiarHTML = (campo) => {
    while(campo.firstChild) {
        campo.removeChild(campo.firstChild);
    }
}

const mostrarSpinner = () => {
    limpiarHTML(resultado);
    const spinner = document.createElement("div");
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner)
}