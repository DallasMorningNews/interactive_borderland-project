/* global $:true */

export default ({ direction, oldY, height, offsets, currentLocation }) => {
  let target;
  let cl = currentLocation;
  offsets.forEach((value, i) => {
    if (direction === 'down' && value < (oldY + height)) {
      target = i;
    }
  });

  const location = $('.location').eq(target).attr('data-lat');

  if (cl !== location) {
    console.log(location);
    cl = location;
  }

  return cl;
};
