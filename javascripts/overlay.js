$(document).ready(function() {

  var supportsTouch = !!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
  supportsTouch = true;
  var noTouch = !supportsTouch;

  var $body = $('body');
  var $overlay = false;

  function insertOverlay() {
    $body.append('<div id="overlay"></div>');
  }

  function generateOverlayHtml(info) {
    var head_title = info.head_title;
    var type = info.type;
    var title = info.title;
    var content = info.content;
    var links = info.links;
    var color = info.color;

    var html = '';
    html += '<div class="overlay-container container overlay-color-' + color + '">';
    html += '<div class="overlay-content bg-white px2">';
    html += '<div class="border-bottom clearfix py2 h5 mb2">'
    html += '<div class="left bold head_title">' + head_title + '</div>';
    html += '<div class="right right-nav bold">';
    for (var i=0; i<links.length; i++) {
      html += links[i];
    }
    html += '<div class="overlay-close x-box">';
    html += '<div class="close-line"></div>';
    html += '<div class="close-line"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<h1>' + info.title + '</h1>';
    html += content;
    html += '<div class="clearfix border-top mt3 py2 center h5"><span class="overlay-close bold fake-link">Close This</span></div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function closeOverlay() {
    $overlay.html('');
    $body.removeClass('overlayed');
  }

  function attachPrototypeHandlers($overlay) {
    $overlay.on('click', '.overlay-video', function() {
      if (noTouch) {
        $video_holder = $('.overlay-video');
        $video_holder.removeClass('initial');
        var $video = $video_holder.find('video');
        var video = $video.get(0);
        var $progress_holder = $('.progress-bar-holder ');
        var $progress_indicator = $('.progress-bar-indicator');

        //update HTML5 video current play time
        $video.on('timeupdate', function() {
          var currentPos = video.currentTime; //Get currenttime
          var maxduration = video.duration; //Get video duration
          var percentage = 100 * currentPos / maxduration; //in %
          $progress_indicator.css('width', percentage+'%');
        });

        var timeDrag = false;   /* Drag status */
        $progress_holder.mousedown(function(e) {
          timeDrag = true;
          updatebar(e.pageX);
          return false;
        });
        $(document).mouseup(function(e) {
          if(timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
           }
        });
        $(document).mousemove(function(e) {
          if(timeDrag) {
            updatebar(e.pageX);
          }
        });

        //update Progress Bar control
        var updatebar = function(x) {
           var maxduration = video.duration; //Video duraiton
           var position = x - $progress_holder.offset().left; //Click pos
           var percentage = 100 * position / $progress_holder.width();
           //Check within range
           if(percentage > 100) {
              percentage = 100;
           }
           if(percentage < 0) {
              percentage = 0;
           }
           //Update progress bar and video currenttime
           $progress_indicator.css('width', percentage+'%');
           video.currentTime = maxduration * percentage / 100;
        };

        if (!$video_holder.hasClass('playing')) {
          $video_holder.addClass('playing');
          video.play();
        } else {
          $video_holder.removeClass('playing');
          video.pause();
        }
      } else {
        $video_holder = $('.overlay-video');
        var screenshot_src = $video_holder.find('.video-screenshot').attr('src');
        console.log(screenshot_src);
        var video_source = screenshot_src.replace('png','mp4');
        console.log(video_source);
        console.log('touch click');
        window.location.href = video_source;
      }
    });
  }

  $('.overlayer').click(function() {
    if (!$overlay) {
      insertOverlay();
      $overlay = $('#overlay');
      $overlay.click(function() {
        closeOverlay();
      });
      attachPrototypeHandlers($overlay);
    }
    $body.addClass('overlayed');
    var attr = $(this).attr('data-overlay');
    var info = window.overlay_objects[attr];
    var html = generateOverlayHtml(info);
    $overlay.scrollTop(0);
    $overlay.html(html);

    if (info.type == 'prototype') {
      var $video_holder = $('.overlay-video');
      $video_holder.addClass('initial');
    }

    $overlay.on('click', '.overlay-close', function() {
      closeOverlay();
    });
    $overlay.on('click', '.overlay-content', function(e) {
      e.stopPropagation();
    });

    // For overlay links within the overlay
    $overlay.on('click', '.overlayer', function() {
      var attr = $(this).attr('data-overlay');
      var info = window.overlay_objects[attr];
      var html = generateOverlayHtml(info);
      $overlay.scrollTop(0);
      $overlay.html(html);
    });

  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      closeOverlay();
    }
  });

});