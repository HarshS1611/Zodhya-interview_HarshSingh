import axios from "axios";

const options = {
    method: 'GET',
    url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
    params: {
        aggregateHours: '1',
        location: '11/120, Krishna Nagar, Kanpur, Uttar Pradesh 208007',
        contentType: 'csv',
        unitGroup: 'us',
        shortColumnNames: '0'
    },
    headers: {
        'X-RapidAPI-Key': '10f5a7d960msh40e2e7969730568p144897jsnf744803b36e7',
        'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
    }
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});