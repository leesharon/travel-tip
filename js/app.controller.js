import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(_renderLocs)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
        console.log('onGetUserPos ~ pos', pos)
            const {latitude, longitude} = pos.coords

            onPanTo(latitude, longitude)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onRemoveLoc(locId) {
    locService.removeLoc(locId)
    locService.getLocs
        .then(_renderLocs)
}

function _renderLocs(locs) {
    console.log('_renderLocs ~ locs', locs)
    const strHTMLs = locs.map( loc => `
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
    console.log('_renderLocs ~ strHTMLs', strHTMLs.join(''))

    document.querySelector('.locs-body').innerHTML = strHTMLs.join('')
}