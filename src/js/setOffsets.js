/* global $: true */

// SETTING THE OFFSETS OF THE LOCATION DIVS
// ----------------------------------------

export default () => {
  // clear the offsets array
  const offsets = [];

  // iterate over every location div and push it's offset from the top of the window
  // to the offsets div
  $.each($('.location'), function () {
    offsets.push($(this).offset().top);
  });

  return offsets;
};
