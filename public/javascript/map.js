

	// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.come
  let mapToken ="<%=process.env.MAP_TOKEN%>"
  console.log(mapToken);
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: [77.2090, 26.6139] // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });
