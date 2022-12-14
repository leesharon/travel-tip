import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    placeMarkerAndPanTo
}


// Var that is used throughout this Module (not global)
let gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            addMapListener()
        })
}

function addMapListener() {
    gMap.addListener('click', (mapsMouseEvent) => {

        Swal.fire({
            input: 'text',
            icon: 'question',
            title: 'Enter the name location',
            inputPlaceholder: 'My favorite sunset spot',
            showCloseButton: true
        }).then((res) => {
            if (res.isConfirmed) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Location Saved',
                    showConfirmButton: false,
                    timer: 1000
                })
              return res.value
            }
            return null
        }).then((locationName)=>{
            if (!locationName) return
            const lat = mapsMouseEvent.latLng.lat()
            const lng = mapsMouseEvent.latLng.lng()
            const pos = {lat, lng}
            appController.onAddLocation(locationName,pos)
            placeMarkerAndPanTo(lat,lng)
        })

    })
}

function placeMarkerAndPanTo(lat,lng){
    console.log(lat,lng)
    panTo(lat,lng)
    addMarker({lat,lng})

}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDJOS8Lw2pOyAk7dwu1HRePE9DHKTIiAE4' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

