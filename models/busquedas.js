const axios = require('axios');


class Busquedas {

    historial = ['Tegicugalpa', 'Madrid', 'San José'];

    constructor() {
        // TODO: leer DB si exsite

    }

    get paramsMapbox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
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
            console.log(resp.data);

            return []

        } catch (error) {

            return [];
        }

        return []; // retornar los lugares que coincidan con el lugar que paso la funcion...

    }


}



module.exports = Busquedas;