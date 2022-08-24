//Importaciones de NODE...
const fs = require('fs')
//Importaciones de terceros...
const axios = require('axios');


class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {

        // TODO: leer DB si exsite
        this.leerDB();

    }

    get historialCapitalizado(){
        // Capitalizar cada palabra
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ')

        });
    }


    get paramsMapbox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }

    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }


    async ciudad(lugar = '') {

        try {
            // peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {

            return [];
        }
    }

    async climaLugar(lat, lon) {

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;


            return {
                desc: weather[0].description,  // weather es un array de objetos, no un objeto directamente, por eso se pone la primer posicion.
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }

    }

    agregarHistorial( lugar = '' ){

        if( this.historial.includes(lugar.toLocaleLowerCase()) ){
            return;
        }
        this.historial = this.historial.splice(0,5);

        // TODO: prevenir duplicados
        this.historial.unshift( lugar.toLocaleLowerCase() );
        // El método unshift() agrega uno o más elementos al inicio del array, y devuelve la nueva longitud del array, a diferencia del push que los añade al final del array...

        // Grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));

    }
    leerDB(){

        if( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );
        // El método JSON.parse() analiza una cadena de texto como JSON, transformando opcionalmente el valor producido por el análisis.

        this.historial = data.historial;
    }

}



module.exports = Busquedas;