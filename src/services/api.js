import axios from 'axios'

const api = axios.create({
    baseURL: 'https://afternoon-anchorage-15995.herokuapp.com'
})

export default api