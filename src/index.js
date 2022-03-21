const API_KEY = 'd6deccfc-afbf-49e0-94ab-cb9636a5559b';

const clientIp = document.querySelector('.ip-address');
const clientLocation = document.querySelector('.location');
const clientTimezone = document.querySelector('.timezone');
const clientCurrency = document.querySelector('.isp');

const searchBar = document.querySelector('.search-bar');
const inputIp = document.getElementById('ip-input');
const button = document.getElementById('submit-ip');

const map = L.map('display_map', {
    'center': [0, 0],
    'zoom': 0,
    'zoomControl': false,
    'layers': [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    ] 
});

const blackIcon = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize: [32, 38]
});

const updateMap = (coordinates = [-40, 40]) => {
    map.setView(coordinates, 16);
    L.marker(coordinates, {icon: blackIcon}).addTo(map);
};

const fetchData = async (defaultIp) => {
    let API_URL;

    if (defaultIp === undefined) {
        API_URL = `https://api.ipfind.com/me?auth=${API_KEY}`;
    } else {
        API_URL = `https://api.ipfind.com?ip=${defaultIp}&auth=${API_KEY}`;
    }
    
    try {
        const request = await fetch(API_URL);
        const data = await request.json();
        console.log(data)

        const {ip_address, city, country_code, timezone, currency, latitude, longitude} = data;

        clientIp.textContent = ip_address;
        clientLocation.textContent = `${city}, ${country_code}`;
        clientTimezone.textContent = timezone;
        clientCurrency.textContent = currency;
       
        updateMap([latitude, longitude]);
    } catch(err) {
        console.error(err);
    }
}

const checkInputValue = (value) => { 
    let error = 0;
    let byte;

    const bytesArr = value.split('.'); 

    for (let i = 0; i < bytesArr.length; i++) {
        byte = bytesArr[i];

        if ((byte.length < 1 || byte.length > 3) ||
            (parseFloat(byte) < 0 || parseFloat(byte) > 255)) {
            error = 1;
            break;
        }
    }
    return error;
}

fetchData();
document.addEventListener('load', updateMap());

button.addEventListener('click', e => {
    e.preventDefault();
    if (inputIp.value != '' && inputIp.value != null && !checkInputValue(inputIp.value)) {
        fetchData(inputIp.value);
    } else {
        clientIp.textContent = 'Invalid IP Address';
        clientLocation.textContent = '-';
        clientTimezone.textContent = '-';
        clientCurrency.textContent = '-';
        console.error('Invalid IP Address');
    }
});











