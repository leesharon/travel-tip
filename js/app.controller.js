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
window.onCopyLink = onCopyLink

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            _setLocationByQueryParams()
            onGetLocs()
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
            const { lat, lng, name } = res
            onAddLocation(name, { lat, lng })
            onPanTo(lat, lng)
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

function _setLocationByQueryParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const lat = +queryStringParams.get('lat')
    const lng = +queryStringParams.get('lng')
    if (lat && lng) mapService.placeMarkerAndPanTo(lat, lng)

}

function onCopyLink(lat, lng) {
    const queryStringParams = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    var data = [new ClipboardItem({ "text/plain": new Blob(["Text data"], { type: "text/plain" }) })]
    navigator.clipboard.write(data).then(function () {
        console.log("Copied to clipboard successfully!")
    }, function () {
        console.error("Unable to write to clipboard. :-(")
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
            <button onclick="onCopyLink(${loc.lat}, ${loc.lng})">Copy</button>
        </td>
    </tr>
    `)

    document.querySelector('.locs-body').innerHTML = strHTMLs.join('')
}