/* global mapboxgl: true */

import $ from 'jquery';
import './furniture';

$(document).ready(() => {
  /*
  ******************************************************************************
  GETTING INTO THIS PROJECT (AKA, SPLASH SCREEN)
  ******************************************************************************
  */

  // hides the cover screen and allows the user to enter into the interactive
  $('#cover__enter').click(() => {
    $('.cover').fadeOut(1000);
    $('html, body').removeClass('no-scroll');
  });

  // ***************************************************************************


  /*
  ******************************************************************************
  LABEL SETUP
  ******************************************************************************
  */

  // array of labels that will get applied to the map. Since we're working with
  // landsat satellite images for tiles, we need to apply some city and state/country
  // labels to pertinent locations

  const labels = [
    {
      type: 'map__label city',
      content: 'Hachita',
      coord: [-108.292584, 31.8662218],
      mcoord: [-107.948805, 31.790043],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Presidio',
      coord: [-104.376493, 29.562273],
      mcoord: [-104.376493, 29.562273],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Lake Amistad',
      coord: [-101.058174, 29.449884],
      mcoord: [-101.058174, 29.449884],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Laredo',
      coord: [-99.536872, 27.597660],
      mcoord: [-99.536872, 27.597660],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'McAllen',
      coord: [-98.239140, 26.194342],
      mcoord: [-98.292448, 26.120063],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Reynosa',
      coord: [-98.3664146, 26.0525675],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'El Paso',
      coord: [-106.487386, 31.752576],
      mcoord: [-106.487386, 31.752576],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Brooks County',
      coord: [-98.193096, 27.090503],
      mcoord: [-98.193096, 27.090503],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label country label__texas', // el paso
      content: 'Texas',
      coord: [-106.48961, 31.950074],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // el paso
      content: 'Mexico',
      coord: [-106.565385, 31.679182],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // presidio
      content: 'Mexico',
      coord: [-104.66493, 29.602273],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // presidio
      content: 'Texas',
      coord: [-104.430093, 29.752273],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // lake amistad
      content: 'Mexico',
      coord: [-101.338174, 29.459884],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // lake amistad
      content: 'Texas',
      coord: [-101.028174, 29.649884],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // laredo
      content: 'Mexico',
      coord: [-99.756419, 27.563932],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // laredo
      content: 'Texas',
      coord: [-99.496419, 27.743932],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // brooks county
      content: 'Texas',
      coord: [-98.383096, 26.990503],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // mcallen-reynosa
      content: 'Mexico',
      coord: [-98.4568518, 25.9859649],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // mcallen-reynosa
      content: 'Texas',
      coord: [-98.2268518, 26.3259649],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // hachita
      content: 'Mexico',
      coord: [-108.022584, 31.7562218],
      el: 'h2',
    },
    {
      type: 'map__label country label__newmexico', // hachita
      content: 'N. Mexico',
      coord: [-108.052584, 31.9262218],
      el: 'h2',
    },
  ];

  // ***************************************************************************


  /*
  ******************************************************************************
  SETTING UP THE MAP(S)
  ******************************************************************************
  */

  // creating our new map object. this is the larger map, that uses specially created
  // landsat images for the tiles (thanks Andrew Chavez!)
  const map = new mapboxgl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        'aerial-images': {
          type: 'raster',
          tiles: [
            'https://interactives.dallasnews.com/2017/borderland-project/tiles-v2/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          scheme: 'tms',
          minzoom: 0,
          maxzoom: 11,
        },
      },
      layers: [{
        id: 'aerial-images',
        type: 'raster',
        source: 'aerial-images',
      }],
    },
    center: [-107.948805, 31.790043],
    zoom: 9,
    minZoom: 4,
    maxZoom: 11,
    renderWorldCopies: false,
  });

  // this is our minimap. 1/10th the size, twice as mappy
  const minimap = new mapboxgl.Map({
    container: 'minimap',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-101.548805, 31.790043],
    zoom: 2.5,
  });

  // setting an empty variable that will be our mini map locator marker
  let miniLocator;

  // locking the map and minimap down. no soup for you
  map.scrollZoom.disable();
  map.dragPan.disable();
  map.dragRotate.disable();
  map.doubleClickZoom.disable();
  map.touchZoomRotate.disable();
  map.keyboard.disable();

  minimap.scrollZoom.disable();
  minimap.dragPan.disable();
  minimap.dragRotate.disable();
  minimap.doubleClickZoom.disable();
  minimap.touchZoomRotate.disable();
  minimap.keyboard.disable();

  // when our map is done loading, we're going to add the geojson for the texas
  // and new mexico borders

  map.on('load', () => {
    map.addSource('texas', {
      type: 'geojson',
      data: 'assets/tx.json',
    });

    map.addLayer({
      id: 'texas border',
      source: 'texas',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ddca86',
        'line-width': 5,
        'line-opacity': 1,
      },
    });

    map.addSource('nm', {
      type: 'geojson',
      data: 'assets/nm.json',
    });

    map.addLayer({
      id: 'nm border',
      source: 'nm',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ddca86',
        'line-width': 5,
        'line-opacity': 1,
      },
    });


    /*
    ****************************************************************************
    APPLYING CUSTOM LABELS AND MARKERS TO THE MAP
    ****************************************************************************
    */

    function applyLabels(element) {
      // create an html element for each element passed into the fucntion
      const el = document.createElement(element.el);

      // give that element the appropriate class types
      el.className = `marker ${element.type}`;

      // create a text node based on the content of the element passed and append
      // it to the created element
      const text = document.createTextNode(element.content);
      el.appendChild(text);

      // add that element to the map at the coordinates specified on the element object
      new mapboxgl.Marker(el)
        .setLngLat(element.coord)
        .addTo(map);
    }

    // run through the labels array, creating an html element for each object and
    // add it to the map
    labels.forEach(applyLabels);


    // applying the markers to the map for our different locations
    function applyMarkers(element) {

      // if the element has an mcoord, which is a coordinate specific to the location
      // of the video ...
      if (element.mcoord) {
        // create an div element with the marker and pin classes
        const el = document.createElement('div');
        el.className = 'marker pin';

        // create a new Marker object for that element and use the mcoord to add it
        // to the map
        new mapboxgl.Marker(el, { offset: [-10, -28] })
          .setLngLat(element.mcoord)
          .addTo(map);
      }
    }

    // run through the labels array and apply marker pins when appropriate
    labels.forEach(applyMarkers);
  });

  // ***************************************************************************


  /*
  ******************************************************************************
  ADJUSTING ZOOM LEVEL OF MAPS FOR SCREEN SIZE
  ******************************************************************************
  */

  // based on the window width, our map takes on different dimmensions. when the map
  // is smaller, we need a wider zoom level
  function adjustZoomLevels(newWidth) {
    if (newWidth <= 800) {
      minimap.setZoom(1.75);
      map.setZoom(8);
    } else {
      map.setZoom(9);
      minimap.setZoom(2.5);
    }
  }

  // ***************************************************************************


  /*
  ******************************************************************************
  MINIMAP SETUP
  ******************************************************************************
  */

  // when the minimap loads, set the zoom level for the two maps, then add the
  // border geojson for tex s and new mexico
  minimap.on('load', () => {
    adjustZoomLevels($(window).width());

    minimap.addSource('mini-texas', {
      type: 'geojson',
      data: 'assets/tx.json',
    });

    minimap.addLayer({
      id: 'texas border',
      source: 'mini-texas',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ddca86',
        'line-width': 2,
        'line-opacity': 1,
      },
    });

    minimap.addSource('mini-nm', {
      type: 'geojson',
      data: 'assets/nm.json',
    });

    minimap.addLayer({
      id: 'nm border',
      source: 'mini-nm',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ddca86',
        'line-width': 2,
        'line-opacity': 1,
      },
    });

    // create an html element for the locator square
    const locator = document.createElement('div');

    // give that element the locator class
    locator.className = 'locator';

    // add that element to the minimap at the coordinates specified on the element object
    // we're offsetting 7px horizontally and vertically to account for the locator box size
    miniLocator = new mapboxgl.Marker(locator, { offset: [-7, -7] });
    miniLocator.setLngLat([-107.948805, 31.790043]);
    miniLocator.addTo(minimap);
  });

  // ***************************************************************************


  /*
  ******************************************************************************
  SETTING UP THE MAP ANIMATIONS ON SCROLL
  ******************************************************************************
  */

  // setting the variables we'll be measuring against: the old window scroll position
  // the new window scroll position, and the window's height
  let oldP = 0;
  let newP = 0;

  // marking the window width and height
  let wHeight = $(window).height();
  let wWidth = $(window).width();


  // SETTING THE OFFSETS OF THE LOCATION DIVS
  // ---------------------------------------------------------------------------

  // creating a new offsets array to hold the offset positions of each 'location'
  let offsets = [];

  function setOffsets() {
    // clear the offsets array
    offsets = [];

    // iterate over every location div and push it's offset from the top of the window
    // to the offsets div
    $.each($('.location'), function () {
      offsets.push($(this).offset().top);
    });
  }

  // ---------------------------------------------------------------------------


  // MOVING THE MAP
  // ---------------------------------------------------------------------------

  function moveMap(lnglat) {
    map.panTo(lnglat);
  }

  // ---------------------------------------------------------------------------


  // TRACKING THE SCROLL
  // ---------------------------------------------------------------------------

  // as the user scrolls, iterate over the offsets array and check to see if
  // at that moment, the offset is greater than the old window scroll position +
  // the height of the window, but less than the new position + the height of the window
  // if it is, we're going to animate the map to the position stored in data attributes
  // on that location div

  let currentLocation;

  function trackScroll({ direction, oldY, height, waypoints, currentLoc }) {
    // define a variable that will be the index value of the last waypoint past
    let target;

    // assign our currentLoc to a variable
    let cl = currentLoc;
    const passed = [];

    // iterate over our waypoints, taking into account direction. Assign the index
    // value of all locations that have passed the waypoint to the passed div,
    // and select the first or last index value in the array, depending on scroll direction
    waypoints.forEach((value, i) => {
      if (direction === 'down' && value < (oldY + (height - 200))) {
        passed.push(i);
        target = passed[(passed.length - 1)];
      } else if (direction === 'up' && value > (oldY + 50)) {
        passed.push(i);
        target = passed[0];
      }
    });

    // set a variable equal to that waypoints corresponding lat long
    let location = [];
    location[1] = $('.location').eq(target).attr('data-lat');
    location[0] = $('.location').eq(target).attr('data-long');

    // if there is no location that matches, and location is undefined, redefine
    // that variable with a lat long of 0, 0
    if (location[0] === undefined) {
      location = [0, 0];
    }

    // if our location lat long differs from the current locations's lat long,
    // change the map, update the minimap, and reassign cl to the new location
    console.log(cl, location);
    if (cl !== location && location[0] !== 0) {
      moveMap(location);
      miniLocator.setLngLat(location);
      cl = location;
    }

    // then return the new location's value
    return cl;
  }

  // as the user scrolls, update the height of the window and the newP
  // if the new position is greater than the old position, we know we're scrolling
  // down, if not, we're scrolling up. Then we're going to call the updateMap function
  // passing in the direction of the scroll

  $(window).scroll(() => {
    // if the offsets array is empty, get the offsets
    if (offsets.length === 0) {
      setOffsets();
    }

    // update the window height and the new position
    wHeight = $(window).height();
    newP = $(window).scrollTop();

    // set up a parameters object to hand off to the trackScroll function with the
    // direction of scroll, the old position, the height of the window, the offsets and
    // the current location
    const params = {
      direction: '',
      oldY: oldP,
      height: wHeight,
      waypoints: offsets,
      currentLoc: currentLocation,
    };

    // determine which direction we're scrolling, update the direction parameter,
    // then pass that off to the trackScroll event, which will determine which location
    // we should be viewing and update the currentLocation variable
    if (newP > oldP) {
      params.direction = 'down';
      currentLocation = trackScroll(params);
    } else {
      params.direction = 'up';
      currentLocation = trackScroll(params);
    }

    // then we're going to update the oldP with the value of the newP for the next
    // scroll event
    oldP = newP;
  });

  // ***************************************************************************


  /*
  ******************************************************************************
  ACCOUNT FOR WINDOW RESIZE HAVOC
  ******************************************************************************
  */

  // if the window resizes, it could effect our waypoint positions, so we need to update those
  $(window).resize(() => {
    // when the window is resized, set the newWidth of the window
    const newWidth = $(window).width();

    // if the newWidth doesn't equal the old windowWidth, reset the offsets and
    // update the old window width with the new width for the next resize event
    if (newWidth !== wWidth) {
      offsets = [];
      wWidth = newWidth;
    }

    adjustZoomLevels(newWidth);
  });

  // ***************************************************************************
});
