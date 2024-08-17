import axios from 'axios';

const API_KEY = '45138031-c8bb9c798960ac88b58061edc';

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;


const formatUrl = (params) => {
    let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
    if (!params) return url;
    let paramsKeys = Object.keys(params);
    paramsKeys.forEach(key => {
        let value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });
    console.log('final url :', url);
    return url;
};

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params));
       
        return { success: true, data: response.data };
    } catch (err) {
        console.log(err.message);
        return { success: false, msg: err.message };
    }
};
