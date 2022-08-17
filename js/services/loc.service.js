import { utilService } from './utils.services.js'
import { storageService } from './storage.services.js'

export const locService = {
    getLocs,
    addLocation,
    removeLoc
}

const STORAGE_KEY = 'locsDB'

const locs = _loadLocsFromStorage() || []

function getLocs() {
    return Promise.resolve(locs)
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(locs)
    //     }, 2000)
    // })
}

function addLocation(name, pos) {
    const location = _createLocation(name, pos)
    locs.push(location)
    //TODO save to storage
    _saveLocsSaveToStorage()
}

function removeLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId)
    locs.splice(locIdx, 1)
}

function _createLocation(name, { lat, lng }) {
    return {
        id: utilService.makeId(4),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}

function _saveLocsSaveToStorage() {
    storageService.saveToStorage(STORAGE_KEY, locs)
}

function _loadLocsFromStorage() {
    return storageService.loadFromStorage(STORAGE_KEY)
}


