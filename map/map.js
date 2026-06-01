// =====================================
// PUERTO PRINCESA SERVICE AREA
// =====================================

const south = 9.30;
const north = 10.15;
const west = 118.20;
const east = 119.10;

function isInsidePuertoPrincesa(lat, lng) {
    return lat >= south && lat <= north && lng >= west && lng <= east;
}

// =====================================
// MAP INITIALIZATION
// =====================================

const map = L.map("map").setView([9.7392, 118.7353], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// BOUNDARY
const bounds = L.latLngBounds(
    [south, west],
    [north, east]
);

map.setMaxBounds(bounds);

map.on("drag", () => {
    map.panInsideBounds(bounds, { animate: false });
});

L.rectangle(
    [[south, west], [north, east]],
    {
        color: "#0f766e",
        weight: 2,
        fillOpacity: 0.05
    }
).addTo(map);

// =====================================
// MARKER
// =====================================

let marker = L.marker([9.7392, 118.7353], {
    draggable: true
}).addTo(map);

// =====================================
// INPUT UPDATES
// =====================================

function updateCoordinates(lat, lng) {
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;
}

// default
updateCoordinates(9.7392, 118.7353);

// =====================================
// REVERSE GEOCODE
// =====================================

async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();

        if (data.display_name) {
            document.getElementById("address").value = data.display_name;
        }
    } catch (err) {
        console.error(err);
    }
}

// =====================================
// MAP CLICK
// =====================================

map.on("click", (e) => {
    const { lat, lng } = e.latlng;

    if (!isInsidePuertoPrincesa(lat, lng)) {
        alert("Service only available in Puerto Princesa.");
        return;
    }

    marker.setLatLng([lat, lng]);
    updateCoordinates(lat, lng);
});

// =====================================
// MARKER DRAG
// =====================================

marker.on("dragend", () => {
    const pos = marker.getLatLng();

    if (!isInsidePuertoPrincesa(pos.lat, pos.lng)) {
        alert("Outside service area!");

        const reset = [9.7392, 118.7353];
        marker.setLatLng(reset);
        updateCoordinates(reset[0], reset[1]);
        return;
    }

    updateCoordinates(pos.lat, pos.lng);
});

// =====================================
// SEARCH ADDRESS
// =====================================

document.getElementById("searchAddress")?.addEventListener("click", async () => {

    const address = document.getElementById("address").value;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${
        encodeURIComponent(address + ", Puerto Princesa City")
    }`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.length) {
        alert("Location not found");
        return;
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    if (!isInsidePuertoPrincesa(lat, lng)) {
        alert("Outside service area");
        return;
    }

    map.setView([lat, lng], 16);
    marker.setLatLng([lat, lng]);
    updateCoordinates(lat, lng);

    await reverseGeocode(lat, lng);
});

// =====================================
// CURRENT LOCATION
// =====================================

document.getElementById("currentLocation")?.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (!isInsidePuertoPrincesa(lat, lng)) {
            alert("Outside service area");
            return;
        }

        map.setView([lat, lng], 16);
        marker.setLatLng([lat, lng]);
        updateCoordinates(lat, lng);

        await reverseGeocode(lat, lng);

    });
});