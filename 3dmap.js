const map = L.map('map', {
    center: [0, 0],
    zoom: 2,
    cesium: true  // Enable Cesium integration
});

// Add a marker for a specific location (New York City)
L.marker([40.7128, -74.006]).addTo(map).bindPopup('New York City');
