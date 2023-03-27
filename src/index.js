const API_KEY = '4e9814d2ef4a0036145693d82ee1f640'
const IPSTACK_BASE_URL = 'http://api.ipstack.com'

const ipAddress = document.querySelector('.ip-address')
const ipType = document.querySelector('.ip-type')
const ispLocation = document.querySelector('.location')
const latitude = document.querySelector('.latitude')
const longitude = document.querySelector('.longitude')

const inputIp = document.getElementById('ip-input')
const button = document.getElementById('submit-ip')

const map = L.map('display_map', {
  center: [0, 0],
  zoom: 0,
  zoomControl: false,
  layers: [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  ]
})

const blackIcon = L.icon({
  iconUrl: '../images/icon-location.svg',
  iconSize: [32, 38]
})

const updateMap = (coordinates = [-40, 40]) => {
  map.setView(coordinates, 16)
  L.marker(coordinates, { icon: blackIcon }).addTo(map)
}

const fetchData = async (clientIp) => {
  try {
    const request = await fetch(`${IPSTACK_BASE_URL}/${clientIp}?access_key=${API_KEY}`)
    const data = await request.json()

    ipAddress.textContent = data.ip
    ipType.textContent = data.type
    ispLocation.textContent = `${data.city}, ${data.country_code}`
    latitude.innerText = data.latitude
    longitude.textContent = data.longitude

    updateMap([data.latitude, data.longitude])
  } catch (err) {
    console.error(err)
  }
}

const checkInputValue = (value) => {
  let error = 0
  let byte

  const bytesArr = value.split('.')

  for (let i = 0; i < bytesArr.length; i++) {
    byte = bytesArr[i]

    if ((byte.length < 1 || byte.length > 3) || (parseFloat(byte) < 0 || parseFloat(byte) > 255)) {
      error = 1
      break
    }
  }
  return error
}

document.addEventListener('load', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      updateMap([latitude, longitude]) 
    })
  }
})

button.addEventListener('click', e => {
  e.preventDefault()

  if (inputIp.value !== '' && inputIp.value !== null && !checkInputValue(inputIp.value)) {
    fetchData(inputIp.value)
  } else {
    ipAddress.textContent = 'Invalid IP Address'
    ipType.textContent = '-'
    ispLocation.textContent = '-'
    latitude.textContent = '-'
    longitude.textContent = '-'
  }
})
