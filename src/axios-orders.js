import axios from 'axios';

const x = axios.create({
    baseURL: 'https://accounting-8bcba.firebaseio.com'
});
export default x;