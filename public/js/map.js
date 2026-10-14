
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
});

const popupContent = document.createElement("div");

const heading = document.createElement("h4");
heading.textContent = listingTitle;

const message = document.createElement("p");
message.textContent = "Exact Location will be provided after booking";

popupContent.appendChild(heading);
popupContent.appendChild(message);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setDOMContent(popupContent)
    )
    .addTo(map);