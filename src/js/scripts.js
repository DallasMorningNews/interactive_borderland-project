/* global mapboxgl: true */

import $ from 'jquery';
import './furniture';

$(document).ready(() => {
  // hides the cover screen and allows the user to enter into the interactive
  $('#cover__enter').click(() => {
    $('.cover').fadeOut(1000);
    $('body').removeClass('no-scroll');
  });

  // array of labels that will get applied to the map. Since we're working with
  // landsat satellite images for tiles, we need to apply some city and state/country
  // labels to pertinent locations

  const labels = [
    {
      type: 'map__label city',
      content: 'Hachita',
      coord: [-108.292584, 31.8662218],
      el: 'h3',
      marker: true,
    },
    // {
    //   type: 'map__label city',
    //   content: 'Tornillo',
    //   coord: [-106.077330, 31.408324],
    //   el: 'h3',
    //   marker: true,
    // },
    {
      type: 'map__label city',
      content: 'Presidio',
      coord: [-104.376493, 29.562273],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Lake Amistad',
      coord: [-101.058174, 29.449884],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Laredo',
      coord: [-99.496419, 27.543932],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'McAllen',
      coord: [-98.3268518, 26.2259649],
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
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label city',
      content: 'Brooks County',
      coord: [-98.193096, 27.090503],
      el: 'h3',
      marker: true,
    },
    {
      type: 'map__label country label__texas', // el paso
      content: 'Texas',
      coord: [-106.21961, 31.70074],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // el paso
      content: 'Mexico',
      coord: [-106.465385, 31.679182],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // presidio
      content: 'Mexico',
      coord: [-104.46493, 29.462273],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // presidio
      content: 'Texas',
      coord: [-104.260093, 29.712273],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // lake amistad
      content: 'Mexico',
      coord: [-101.038174, 29.249884],
      el: 'h2',
    },
    {
      type: 'map__label country label__texas', // lake amistad
      content: 'Texas',
      coord: [-101.078174, 29.649884],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // laredo
      content: 'Mexico',
      coord: [-99.696419, 27.443932],
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
      coord: [-98.493096, 26.890503],
      el: 'h2',
    },
    {
      type: 'map__label country label__mexico', // mcallen-reynosa
      content: 'Mexico',
      coord: [-98.4268518, 26.0259649],
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
      coord: [-107.892584, 31.7562218],
      el: 'h2',
    },
    {
      type: 'map__label country label__newmexico', // hachita
      content: 'N. Mexico',
      coord: [-108.192584, 31.9662218],
      el: 'h2',
    },
  ];


  /*
  *************************************************
  SETTING UP THE MAP
  *************************************************
  */

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

  const minimap = new mapboxgl.Map({
    container: 'minimap',
    style: 'https://maps.dallasnews.com/styles.json',
    center: [-101.548805, 31.790043],
    zoom: 2.5,
  });

  // setting an empty variable that will be our mini map locator marker
  let miniLocator;

  // locking the map and minimap down
  map.scrollZoom.disable();
  // map.dragPan.disable();
  map.dragRotate.disable();
  map.doubleClickZoom.disable();
  map.touchZoomRotate.disable();

  minimap.scrollZoom.disable();
  // map.dragPan.disable();
  minimap.dragRotate.disable();
  minimap.doubleClickZoom.disable();
  minimap.touchZoomRotate.disable();

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

    // APPLYING THE CUSTOM LABELS
    // ----------------------------------------

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

    function applyMarkers(element) {
      if (element.marker === true) {
        const el = document.createElement('div');
        el.className = 'marker pin';

        new mapboxgl.Marker(el, { offset: [-10, -28] })
          .setLngLat(element.coord)
          .addTo(map);
      }
    }

    labels.forEach(applyMarkers);
  });

  minimap.on('load', () => {
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
    miniLocator = new mapboxgl.Marker(locator, {offset: [-7, -7]});
    miniLocator.setLngLat([-107.948805, 31.790043]);
    miniLocator.addTo(minimap);
  });


  /*
  *************************************************
  SETTING UP THE MAP ANIMATIONS ON SCROLL
  *************************************************
  */

  // setting the variables we'll be measuring against: the old window scroll position
  // the new window scroll position, and the window's height
  let oldP = 0;
  let newP = 0;

  // marking the window width and height
  let wHeight = $(window).height();
  let wWidth = $(window).width();


  // SETTING THE OFFSETS OF THE LOCATION DIVS
  // ----------------------------------------

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

  // END SETTING THE OFFSETS
  // -----------------------


  // MOVING THE MAP
  // --------------

  function moveMap(lnglat) {
    map.panTo(lnglat);
  }

  // TRACKING THE SCROLL
  // ----------------------------------------

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

  /*
  *************************************************
  ACCOUNT FOR WINDOW RESIZE HAVOC
  *************************************************
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
  });
});
