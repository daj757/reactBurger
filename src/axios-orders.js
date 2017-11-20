import axios from 'axios'

const instance = axios.create({ 
    baseURL: 'https://hamburgerbuilder.firebaseio.com/'
})

export default instance;