
function radianize(degrees) {
  var radians = (degrees/180) * Math.PI;
  return radians;
}

function getCoords(angle) {
  var radians = radianize(angle);
  var x = 50 + Math.cos(radians) * 50;
  var y = 50 + Math.sin(radians) * 50;
  var coords = [x,y];
  return coords;
}

function setCoords($point, coords) {
  $point.css({
    left: coords[0] + '%',
    top: coords[1] + '%'
  });
}

function placeCircles($points, angles) {
  $points.each(function(i, point) {
    var angle = angles[i];
    var coords = getCoords(angle);
    setCoords($(point), coords);
  });
}

var $circle_points = $('.circle-point');
var start_angles = [0,120,240];

function stepAngles(step) {
  var step_adjust = 0.1;
  var angles = start_angles.map(function(angle) {
    return angle + (step * step_adjust);
  });
  return angles;
}

var $window = $(window);
$window.scroll(function() {
  var scroll_top = $window.scrollTop();
  var angles = stepAngles(scroll_top);
  console.log(angles);
  placeCircles($circle_points, angles)
});