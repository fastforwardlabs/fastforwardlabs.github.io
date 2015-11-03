$(document).ready(function() {

  var $body = $('body');
  var $overlay = false;

  function insertOverlay() {
    $body.append('<div id="overlay"></div>');
  }

  function generateOverlayHtml(info) {
    var head_title = info.head_title;
    var title = info.title;
    var content = info.content;
    var links = info.links;
    var color = info.color;

    var html = '';
    html += '<div class="container px2 overlay-color-' + color + '">';
    html += '<div class="bg-white px2" style="margin: -0.5rem;">';
    html += '<div class="clearfix py2 lh1">';
    html += '<div class="head_title chambers left bold">' + head_title + '</div>';
    html += '<div id="overlay-close" class="right"><img src="resources/images/x.svg" /></div>';
    html += '</div>';
    html += '<div class="nav">';
    for (var i=0; i<links.length; i++) {
      html += links[i] + '&nbsp;';
    }
    html += '</div>';
    html += '<h2>' + info.title + '</h2>';
    html += content;
    html += '</div>';
    html += '</div>';
    return html;
  }

  function closeOverlay() {
    $overlay.html('');
    $body.removeClass('overlayed');
  }

  $('.overlayer').click(function() {
    if (!$overlay) {
      insertOverlay();
      $overlay = $('#overlay');
      $overlay.click(function() {
        closeOverlay();
      });
    }
    $body.addClass('overlayed');
    var attr = $(this).attr('data-overlay')
    var info = window.overlay_objects[attr];
    var html = generateOverlayHtml(info);
    $overlay.scrollTop(0);
    $overlay.html(html);
    $('overlay-close').click(function() {
      closeOverlay();
    });
  });

});