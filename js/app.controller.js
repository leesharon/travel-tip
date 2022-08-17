import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const appController = {
    onAddLocation
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.onSearchLocation = onSearchLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat, lng) {
    mapService.addMarker({ lat, lng })
}

function onSearchLocation(ev, elForm) {
    ev.preventDefault()
    const locationName = elForm.querySelector('[name=locations-input]').value
    locService.searchLocation(locationName)
        .then(res => {
            const{lat,lng,name} = res
            onAddLocation(name,{lat,lng})
            onPanTo(lat,lng)
        })
}

function onGetLocs() {
    locService.getLocs()
        .then(_renderLocs)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            const { latitude, longitude } = pos.coords
            onPanTo(latitude, longitude)
            onAddMarker(latitude, longitude)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
    onAddMarker(lat, lng)
}

function onAddLocation(locationName, pos) {
    locService.addLocation(locationName, pos)
    locService.getLocs()
        .then(_renderLocs)
}

function onRemoveLoc(locId) {
    locService.removeLoc(locId)
    locService.getLocs()
        .then(_renderLocs)
}

function _renderLocs(locs) {
    const strHTMLs = locs.map(loc => `
    <tr>
        <td>${loc.name}</td>
        <td>${loc.lat.toFixed(3)}</td>
        <td>${loc.lng.toFixed(3)}</td>
        <td>${loc.createdAt}</td>
        <td>${loc.updatedAt}</td>
        <td>
            <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
            <button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
        </td>
    </tr>
    `)

    document.querySelector('.locs-body').innerHTML = strHTMLs.join('')
}