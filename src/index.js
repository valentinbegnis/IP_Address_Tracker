const API_KEY = 'at_cck08Uor06K7AzGwuE2YUB8IxOgn0';

const clientIp = document.querySelector('.ip-address');
const clientLocation = document.querySelector('.location');
const clientTimezone = document.querySelector('.timezone');
const clientIsp = document.querySelector('.isp');

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
        API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
    } else {
        API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${defaultIp}`;
    }
    
    try {
        const request = await fetch(API_URL);
        const data = await request.json();

        const {ip, isp} = data;
        const {city, country, timezone, lat, lng} = data.location;

        clientIp.textContent = ip;
        clientLocation.textContent = `${city}, ${country}`;
        clientTimezone.textContent = `UTC ${timezone}`;
        clientIsp.textContent = isp;
       
        updateMap([lat, lng]);
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
        clientIsp.textContent = '-';
        console.error('Invalid IP Address');
    }
});











