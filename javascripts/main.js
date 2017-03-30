var rotation_speed = ((Math.PI/180)/300);

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

var cancelRequestAnimFrame = (function() {
  return window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    window.clearTimeout;
})();

/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestInterval = function(fn, delay) {
  if( !window.requestAnimationFrame       &&
    !window.webkitRequestAnimationFrame &&
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame      &&
    !window.msRequestAnimationFrame)
      return window.setInterval(fn, delay);
  var start = new Date().getTime(),
    handle = new Object();
  function loop() {
    var current = new Date().getTime(),
      delta = current - start;
    if(delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
    handle.value = requestAnimFrame(loop);
  };
  handle.value = requestAnimFrame(loop);
  return handle;
}
/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestInterval = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
};
/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestTimeout = function(fn, delay) {
  if( !window.requestAnimationFrame       &&
    !window.webkitRequestAnimationFrame &&
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame      &&
    !window.msRequestAnimationFrame)
      return window.setTimeout(fn, delay);
  var start = new Date().getTime(),
    handle = new Object();
  function loop(){
    var current = new Date().getTime(),
      delta = current - start;
    delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
  };
  handle.value = requestAnimFrame(loop);
  return handle;
};
/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearTimeout(handle);
};

var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}
if ((is_chrome)&&(is_opera)) {is_chrome=false;}


var $window = $(window);

var width = $window.width();
var height = $window.height();
var no_scroll_events = false;
var touch_events = false;
var too_small = false;
var graph_active = true;

$(document).ready(function() {

  var $body = $('body');

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $body.addClass('mobiley');
    no_scroll_events = true;
    touch_events = true;
  }

  if (width < 340 && height < 540) {
    too_small = true;
    $body.addClass('no-graph');
  }

  var $content = $('#content');
  var $intro = $('#intro');
  $content.css('top',height);
  var content_height = $content.height();
  var $learn_more_holder = $('#learn-more-holder');
  requestTimeout(function() {
    if (no_scroll_events) {
      $learn_more_holder.css('top',$intro.height());
    }
  },0);

  // Report Row Sizing
  var box_width = 450;
  var box_height = 367;
  var row_width = 820;
  var text_height = 160;
  var box_ratio = box_height/box_width;
  var height_ratio = box_height/row_width;

  var $report_row = $('.report-row');
  var $report_side = $('.report-side');

  function setBoxes() {
    var width = $(window).width();
    if (width < 820) {
      var box_height = ((width-40) * height_ratio);
      var row_height = box_height + text_height;
      if (width > 640) {
        $report_row
          .not('.coming-soon')
          .removeClass('stack')
          .css('height', row_height + 'px');
        $report_side.css('height', box_height + 'px');
      } else {
        var box_height = (width * height_ratio);
        $report_row
          .not('.coming-soon')
          .addClass('stack')
          .css('height', 'auto');
        var margin_adjuster = 84;
        if (width < 341) {
          margin_adjuster = 40;
        }
        var box_height = (width - margin_adjuster) * box_ratio;
        $report_side.css('height', box_height + 'px');
      }
    } else {
      $report_row
        .removeClass('stack')
        .attr('style','')
      $report_side.attr('style','');
    }
  }
  setBoxes();

  // Hover page turn on books
  var $base_hoverer = $('.report-image-hoverer');
  $base_hoverer.each(function() {
    if (!$(this).hasClass('disabled')) {
      if (!touch_events) {
        $this = $(this);
        var section_width = $this.width()/5;
        var $report_images = $this.children();
        $this.on("mousemove",function(e) {
          var $this = $(this);
          var mouse_x = e.pageX - $this.offset().left;
          if (mouse_x < section_width) {
            $report_images.removeClass('active')
            $report_images.eq(0).addClass('active');
          } else if (mouse_x < section_width * 2) {
            $report_images.removeClass('active')
            $report_images.eq(1).addClass('active');
          } else if (mouse_x < section_width * 3) {
            $report_images.removeClass('active')
            $report_images.eq(2).addClass('active');
          } else if (mouse_x < section_width * 4) {
            $report_images.removeClass('active')
            $report_images.eq(3).addClass('active');
          } else {
            $report_images.removeClass('active')
            $report_images.eq(4).addClass('active');
          }
        });
        $this.on("mouseleave",function() {
          requestTimeout(function() {
            $report_images.removeClass('active')
            $report_images.eq(0).addClass('active');
          },200);
        })
      }
    }
  });

  // Hover play video
  var $video_holder = $('.video-holder')
  $video_holder.mouseenter(function() {
    $(this).find('video').get(0).play();
  });
  $video_holder.mouseleave(function() {
    $(this).find('video').get(0).pause();
  });

  var $content_canvas = $('#content-canvas');

  // Canvas for Connecting Lines
  function setContentCanvas() {
    var $content = $('#content');
    var width = $content.width();
    var height = $content.height();
    $content_canvas.attr('width',width);
    $content_canvas.attr('height',height);
  }

  var context = $content_canvas.get(0).getContext('2d');
  var $report_rows = $('.report-row');
  var canvas_offset = height;

  function connectProduct() {
    var $product = $('#product');
    var $connecting_anchor = $('.report-underline');
    var $report_num = $('.report-num');
    var $first_content = $product.find('.content-block').first();
    var $blocker = $('.blocker');
    var anchor_bottom = $connecting_anchor.offset().top + $connecting_anchor.height() + 1;
    var anchor_center = $connecting_anchor.offset().left + ($connecting_anchor.width()/2);
    // If anchor spreads to two-lines use backup
    if ($connecting_anchor.height() > 36) {
      var $backup = $connecting_anchor.find('.backup-connector');
      anchor_center = $backup.offset().left + ($backup.width()/2);
    }
    var start_x = anchor_center;
    var start_y = anchor_bottom - canvas_offset;
    var y_1 = $first_content.offset().top + $first_content.height() - canvas_offset + 18;
    var x_1 = $report_num.eq(0).offset().left + ($report_num.eq(0).width()/2);
    var y_2 = $report_num.eq(0).offset().top - canvas_offset;
    var y_3 = $report_num.eq(1).offset().top - canvas_offset;
    var y_4 = $report_rows.eq(1).offset().top + $report_rows.eq(1).height() - canvas_offset + 34;
    var x_2 = width/2
    var x_3 = $report_num.eq(2).offset().left + ($report_num.eq(0).width()/2);;
    var y_5 = $report_num.eq(2).offset().top - canvas_offset + 10;
    var y_5 = $report_row.eq(2).offset().top + $report_row.eq(2).height() - canvas_offset + 24;
    var x_4 = width/2;
    var y_6 = $blocker.offset().top - canvas_offset + 10;
    context.beginPath();
    context.moveTo(start_x,start_y);
    context.lineTo(start_x,y_1);
    context.lineTo(start_x,y_1);
    context.lineTo(x_1,y_1);
    context.lineTo(x_1,y_2);
    context.lineTo(x_1,y_3);
    context.lineTo(x_1,y_4);
    context.lineTo(x_3,y_4);
    context.lineTo(x_3,y_5);
    context.lineTo(x_3,y_5);
    context.lineTo(x_4,y_5);
    context.lineTo(x_4,y_6);
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.strokeStyle = '#eaeaea';
    context.stroke();
    context.beginPath();
  };

  function connectContact() {
    var $contact = $('#contact');
    var $connecting_anchor = $('.contact-underline');
    var $contact_box = $('.contact-form-holder');
    var $first_content = $contact.find('.content-block').first();
    var anchor_bottom = $connecting_anchor.offset().top + $connecting_anchor.height() + 3;
    var anchor_center = $connecting_anchor.offset().left + ($connecting_anchor.width()/2);
    // If anchor spreads to two-lines use backup
    if ($connecting_anchor.height() > 36) {
      var $backup = $connecting_anchor.find('.backup-connector');
      anchor_center = $backup.offset().left + ($backup.width()/2);
    }
    var start_x = anchor_center;
    var start_y = anchor_bottom - canvas_offset;
    var y_1 = $first_content.offset().top + $first_content.height() - canvas_offset + 20;
    var x_1 = $contact_box.offset().left + ($contact_box.outerWidth()/2);
    var y_2 = $contact_box.offset().top - canvas_offset;
    context.beginPath();
    context.moveTo(start_x,start_y);
    context.lineTo(start_x,y_1);
    context.lineTo(start_x,y_1);
    context.lineTo(x_1,y_1);
    context.lineTo(x_1,y_2);
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.strokeStyle = '#eaeaea';
    context.stroke();
  };

  function connectTeam() {
    var $team = $('#team');
    var $connecting_anchor = $('.team-underline');
    var $hilary_box = $('.hilary-third');
    var $first_content = $team.find('.content-block').first();
    var anchor_bottom = $connecting_anchor.offset().top + $connecting_anchor.height() + 3;
    var anchor_center = $connecting_anchor.offset().left + ($connecting_anchor.width()/2);
    // If anchor spreads to two-lines use backup
    if ($connecting_anchor.height() > 36) {
      var $backup = $connecting_anchor.find('.backup-connector');
      anchor_center = $backup.offset().left + ($backup.width()/2);
    }
    var start_x = anchor_center;
    var start_y = anchor_bottom - canvas_offset;
    var x_1 = $hilary_box.offset().left + $hilary_box.outerWidth();
    var y_1 = $first_content.offset().top + $first_content.height() - canvas_offset + 8;
    var x_2 = $hilary_box.offset().left + ($hilary_box.outerWidth()/2);
    var y_3 = $hilary_box.offset().top - canvas_offset + 10;
    var hilary_distance = y_3 - start_y;
    context.beginPath();
    context.moveTo(start_x,start_y);
    context.lineTo(start_x,y_1);
    if (hilary_distance > 200) {
      var ny_2 = $hilary_box.offset().top - canvas_offset - (parseInt($hilary_box.children().css('margin-bottom')) + 10)/2;
      context.lineTo(x_1,y_1);
      context.lineTo(x_1,ny_2);
      context.lineTo(x_2,ny_2);
      context.lineTo(x_2,y_3);
    } else {
      context.lineTo(x_2,y_1);
      context.lineTo(x_2,y_3);
    }
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.strokeStyle = '#eaeaea';
    context.stroke();
  };

  function connectDots() {
    setContentCanvas();
    connectProduct();
    connectContact();
    connectTeam();
  }

  // Do not run canvas setup until after load
  $window.bind("load", function() {
    connectDots()
  });

  $(window).resize(function() {
    // If mobile donot change on height change
    if (no_scroll_events) {
      if ($window.width() != width) {
        width = $window.width();
        height = $window.height();
        content_height = $content.height();
        $content.css('top',height);
        sizeOverlay();
        squareUp();
        setBoxes();
        connectDots();
        widthGraph();
      }
    } else {
      width = $window.width();
      height = $window.height();
      content_height = $content.height();
      $content.css('top',height);
      sizeOverlay();
      squareUp();
      setBoxes();
      connectDots();
      widthGraph();
    }
  });

  var $sections = $('.section');
  var $nav = $('#nav');
  var $nav_links = $('#nav a');
  var $section_titles = $('.section-title');
  var active_section = 0;
  var scrolling = false;

  var $section_links = $('.section-link');

  $section_links.on("click",function() {
    scrolling = true;
    var href = $(this).attr('href');
    var $target = $(href);
    if (href == "#intro") {
      var target_index = 0;
      if (width>500) {
        var target_top = 0;
      } else {
        var target_top = 0;
      }
      $nav.removeClass('scrolled');
      if (!graph_paused) {
        revolveGraph();
        graph_active = true;
      }
    } else {
      var target_index = $target.index();
      var target_top = $target.offset().top;
      $nav.addClass('scrolled');
      graph_active = false;
    }
    if (!no_scroll_events) {
      $nav_links.removeClass('active');
      $nav_links.eq(target_index).addClass('active');
    }
    if (width>500) {
      $('html, body').animate({
        scrollTop: target_top
      }, 200);
    } else {
      $('html, body').animate({
        scrollTop: target_top
      }, 200);
    }
    requestTimeout(function(){
      scrolling = false
    }, 300);
    return false;
  });

  // Contact Form Submit
  var $contact_form = $('#contact-form');
  $contact_form.on("submit",function(e) {
    var data = $contact_form.serialize();

    $contact_form.parent().addClass('submitted');

    $.ajax({
      type: 'POST',
      url: $contact_form.attr('action'),
      data: data
    })
    .done(function(response) {
      $contact_form.parent().removeClass('error');
      $contact_form.parent().addClass('success');
    })
    .fail(function(data) {
      $contact_form.parent().removeClass('success');
      $contact_form.parent().addClass('error');
    });

    e.preventDefault();
  });

  $('#new-message').on("click",function(e){
    $contact_form.find("input[type=text], input[type=email], textarea").val("")
    $contact_form.parent().removeClass('submitted');
    e.preventDefault();
  });

  $('#try-again').on("click", function(e){
    $contact_form.parent().removeClass('submitted');
    e.preventDefault();
  });

  if (!no_scroll_events) {
    $nav_links.first().addClass('active');
  }

  var graphing = true;

  // Scroll cod from https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c
  var didScroll;
  var active_scroll = false;
  // on scroll, let the interval function know the user has scrolled
  $(window).scroll(function(event){
    didScroll = true;
  });
  // run hasScrolled() and reset didScroll status
  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  var last_scroll_top = 0;
  var delta = 1;
  var show_nav = true;
  var naving_up = false;
  var naving_down = false;
  var naving_set = false;
  var naving_top = 0;
  var nav_height = $nav.outerHeight();

  function hasScrolled() {
    if (!scrolling && !no_scroll_events) {
      var scroll_top = $window.scrollTop();
      if (scroll_top+(height/3) > $sections.first().offset().top) {
        $($sections.get().reverse()).each(function(i) {
          var $this = $(this);
          var section_top = $this.offset().top;
          if (scroll_top+(height/3) > section_top) {
            var adjusted_index = $sections.length - i;
            if (active_section != adjusted_index) {
              $nav_links.removeClass('active');
              $nav_links.eq(adjusted_index).addClass('active');
              active_section = adjusted_index;
              $nav.addClass('scrolled');
            }
            return false;
          }
        });
      } else {
        if (active_section != 0) {
          $nav_links.removeClass('active');
          $nav_links.first().addClass('active');
          $nav.removeClass('scrolled');
          active_section = 0;
        }
      }
      if (!too_small) {
        if (scroll_top > (height * 1.25) && scroll_top < content_height) {
          if (graphing) {
            // Toggle graph revolve off
            graph_active = false;
            graphing = false;
          }
        } else {
          if (!graphing) {
            // Toggle graph revolve on
            if (!graph_paused) {
              graph_active = true;
              revolveGraph();
              graphing = true;
            }
          }
        }
      }
      last_scroll_top = scroll_top;
    }
  }

  // Mailchimp form
  var $mc_form = $('#mc-form');
  $mc_form.on("submit",function(e) {
    $mc_form.parent().addClass('submitted');
    $mc_form.parent().addClass('success');
    $mc_form.parent().removeClass('error');
  });

  var $whiteboard_box = $('#whiteboard-box');
  var $shadow = $('#shadow');
  $whiteboard_box.on("click", function() {
    $intro.toggleClass('explaining');
  });
  var $mobile_closer = $('#mobile_closer');
  $mobile_closer.on("click", function() {
    $intro.removeClass('explaining');
  });

  function sizeOverlay() {
    var width = $window.width();
    var height = $window.height();
    var adjusted_height = height * 0.9;
    if (width > 1080) {
      var sidebar = 360;
    } else if (width > 940) {
      var sidebar = 280;
    } else {
      sidebar = 0;
      adjusted_height = (height * 0.8) * 0.9;
    }
    var side_ratio = 0.816;
    if (width < 941) {
      overlay_width = width;
      overlay_height = (width * side_ratio)/0.92;
      $overlay_content.css({
        'width': overlay_width,
        'height': overlay_height
      });
      $overlay_centerer.css({
        'width': overlay_width,
        'height': overlay_height
      });
    } else {
      var overlay_height = adjusted_height;
      var overlay_width = (overlay_height * 0.92)/side_ratio;
      var max_width = (width - sidebar) * 0.9;
      if (overlay_width > max_width) {
        var new_height = (max_width * side_ratio)/0.92;
        $overlay_centerer.css({
          'width': max_width,
          'height': new_height
        });
      } else {
        $overlay_centerer.css({
          'height': overlay_height,
          'width': overlay_width
        });
      }
    }
  }

  function squareUp() {
    var $squares = $('.square');
    var height = $squares.height();
    $squares.css('width', height + 'px');
  }

  var overlay_scroll = 0;

  // Overlay
  var $body = $('body');
  var $overlay_centerer = $('#overlay-centerer');
  var $overlay_content = $('#overlay-content');
  var $caption_content = $('#caption-content');
  var $close_overlay = $('#close-overlay');
  $report_side.on("click",function() {
    overlay_scroll = $window.scrollTop();
    var $this = $(this);
    var html_content = $this.html();
    var caption_content = $this.find('.side-content').attr('data-info');
    var num = $this.parents('.report-row').attr('data-num');
    if ($this.hasClass('left')) {
      // It is a report
      var type = "Report";
    } else {
      // It is a prototype
      var type = "Prototype";
    }
    var title = $this.find('.side-content').attr('data-title');
    $body.addClass('overlayed');
    sizeOverlay();
    if (no_scroll_events) {
      $window.scrollTop(0);
    }
    // Has to be longer than scroll check interval
    requestTimeout(function() {
      $nav.addClass('scrolled');
      graph_active = false;
    },350);
    var caption_html = '<div class="caption-num ff' + num + '">FF' + num + '</div>';
    caption_html += '<h4 class="caption-type">' + type + '</h4>';
    caption_html += '<div class="caption-title"> ' + title + '</div>';
    if ($this.hasClass('pictograph-special')) {
      caption_content = '<a href="http://pictograph.us" target="_blank">Pictograph</a>' + caption_content;
    }
    caption_html += '<div class="caption-info">' + caption_content + '</div>';
    $overlay_centerer.html(html_content);
    if ( !$this.find('.report-image-hoverer').hasClass('disabled')) {
      if (type == "Report") {
        var pager = '<div class="pager-holder">';
        pager += '<div class="pager-centerer">'
        pager += '<div class="pager square"></div>'
        pager += '<div class="pager square"></div>'
        pager += '<div class="pager square"></div>'
        pager += '<div class="pager square"></div>'
        pager += '<div class="pager square"></div>'
        pager += '</div>';
        pager += '</div>';
        $overlay_centerer.append(pager);
      } else {
        var seeker = '<div class="seeker-holder">';
        seeker += '<div class="play-pause-holder"><div class="play-pause"></div></div>';
        seeker += '<div class="seeker-bar">';
        seeker += '<div class="seeker-progress"></div>';
        seeker += '</div>';
        seeker += '</div>';
        $overlay_centerer.append(seeker);
      }
    }
    if (type == "Report") {
      var $hoverer = $overlay_centerer.find('.report-image-hoverer');
      var $pagers = $overlay_centerer.find('.pager');
      var section_width = $hoverer.width()/5;
      var $report_images = $hoverer.children();
      var active_pane = 0;
      var hoverer_width = $hoverer.width();
      function setActive(index) {
        if (!$this.find('.report-image-hoverer').hasClass('disabled')) {
          $pagers.removeClass('active');
          $report_images.removeClass('active');
          $report_images.eq(index).addClass('active');
          $pagers.eq(index).addClass('active');
          if (touch_events) {
            active_pane = index;
            pane_number = $report_images.length;
            $hoverer.addClass('animate');
            if (is_safari) {
              $hoverer.css('-webkit-transform','translate3d(' + -((active_pane/pane_number) * 100) + '%,0,0)');
            } else {
              $hoverer.css('transform','translate3d(' + -((active_pane/pane_number) * 100) + '%,0,0)');
            }
            requestTimeout(function(){
              $hoverer.removeClass('animate');
            },150);
          }
        }
      }
      if (!touch_events) {
        $hoverer.on("mousemove",function(e) {
          var $this = $(this);
          var mouse_x = e.pageX - $this.offset().left;
          if (mouse_x < section_width) {
            setActive(0);
          } else if (mouse_x < section_width * 2) {
            setActive(1);
          } else if (mouse_x < section_width * 3) {
            setActive(2);
          } else if (mouse_x < section_width * 4) {
            setActive(3);
          } else {
            setActive(4);
          }
        });
        $pagers.on("mouseenter",function(e) {
          var index = $(this).index();
          setActive(index);
        });
        var current_active = $overlay_centerer.find('img.active').index();
        $pagers.eq(current_active).addClass('active');
      } else {
        setActive(0);
        // Modified from http://codepen.io/berkin/pen/HKgnF?editors=101
        function setContainerOffset(offset) {
          if (is_safari) {
            $hoverer.css('-webkit-transform','translate3d(' + offset + '%,0,0)');
          } else {
            $hoverer.css('transform','translate3d(' + offset + '%,0,0)');
          }
        }

        var overlay_toucher = new Hammer($overlay_centerer.get(0));
        var swiping = false;
        function handleSwipe(ev) {
          if (ev.type == "panstart") {
            swiping = false;
          }
          if (ev.type == "swipe") {
            if(ev.deltaX > 0) {
              if (active_pane == 0) {
                setActive(active_pane);
              } else {
                setActive(active_pane-1);
              }
            } else {
              if (active_pane == $report_images.length - 1) {
                setActive(active_pane);
              } else {
                setActive(active_pane+1);
              }
            }
            swiping = true;
          } else if (ev.type == "pan") {
            if (!swiping) {
              var current_left = -(active_pane/pane_number) * 100;
              var offset = ((parseInt(ev.deltaX)/hoverer_width) * 100);
              if ((active_pane == 0 && ev.direction == 4) || (active_pane == $report_images.length - 1 && ev.direction == 2)) {
                offset = offset * 0.5;
              }
              var new_left = current_left + offset;
              setContainerOffset(new_left);
            }
          } else if (ev.type == 'panend') {
            if (!swiping) {
              if(Math.abs(ev.deltaX) > width/2) {
                if(ev.deltaX > 0) {
                  if (active_pane == 0) {
                    setActive(active_pane);
                  } else {
                    setActive(active_pane-1);
                  }
                } else {
                  if (active_pane == $report_images.length - 1) {
                    setActive(active_pane);
                  } else {
                    setActive(active_pane+1);
                  }
                }
              } else {
                setActive(active_pane);
              }
            }
          }
        };
        overlay_toucher.on('pan swipe panstart panend', handleSwipe);
        overlay_toucher.get('swipe').set({ velocity: 0.01 });
      }
    } else {
      var $video = $overlay_centerer.find('video');
      var video = $video.get(0);
      var $progress_holder = $('.seeker-bar');
      var $progress_indicator = $('.seeker-progress');

      var $body_video = $(this).find('video').get(0);
      // Reset body video to 0
      $body_video.currentTime = 0;

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

      $video.parent().on("click", function() {
        if (video.paused) {
          $overlay_centerer.addClass('playing');
          video.play();
        } else {
          $overlay_centerer.removeClass('playing');
          video.pause();
        }
      });

      var $play_pause = $('.play-pause');
      $play_pause.on('click', function(e) {
        if (video.paused) {
          $overlay_centerer.addClass('playing');
          video.play();
        } else {
          $overlay_centerer.removeClass('playing');
          video.pause();
        };
      });

      requestTimeout(function(){
        $video.addClass('ready');
      },200);
      $overlay_centerer.addClass('playing');
      video.play();
    }
    squareUp();
    $caption_content.html(caption_html);
    $overlay_centerer.addClass('ff' + num);
  });
  $close_overlay.on("click",function() {
    $overlay_centerer.html('');
    $caption_content.html('');
    $overlay_centerer.removeClass('ff01 ff02 playing');
    $body.removeClass('overlayed');
    $window.scrollTop(overlay_scroll);
  });

  if (!too_small) {
    startTopicGraph();
  }

  var KEYCODE_ESC = 27;

  $(document).keyup(function(e) {
    if (e.keyCode == KEYCODE_ESC) {
      $intro.removeClass('explaining');
      if ($body.hasClass('overlayed')) {
        $close_overlay.click();
      }
    }
  });

  var $whiteboard_control = $('#whiteboard-control');
  $whiteboard_control.on("click", function() {
    if ($whiteboard_control.hasClass('paused')) {
      $whiteboard_control.removeClass('paused');
      revolveGraph();
      graph_paused = false;
      graph_active = true;
    } else {
      $whiteboard_control.addClass('paused');
      force.alpha(0);
      graph_paused = true;
      graph_active = false;
    }
  });

  if (is_firefox) {
    $body.addClass('firefox');
  }

  function widthGraph() {
    if (width < 500) {
      graph_active = false;
      graph_paused = true;
      $whiteboard_control.addClass('paused');
    } else {
      graph_paused = false;
      graph_active = true;
      $whiteboard_control.removeClass('paused');
      revolveGraph();
    }
  }

  widthGraph();

});

// Top Graph
var graph_active = false;
var graph_paused = false;
var revolving_interval = "";
var force = d3.layout.force();
var nodes = "";

function stopGraph() {
  force.alpha(0);
}

function revolveGraph() {
  if (!is_firefox) {
    force.alpha(0.03);
  }
}

var startTopicGraph = function() {

  $.get('/techgraph/techgraph.yaml', function(data) {
    let json = YAML.parse(data);
    let topics = [];
    let links = [];

    function nodePusher(data, parent) {
      if (typeof data === 'object') {
        if (Array.isArray(data)) {
          data.forEach(function(child, i) {
            nodePusher(child, parent)
          })
        } else {
          Object.keys(data).forEach(function(key, i) {
            topics.push(key);
            if (parent) links.push({source: parent, target: key})
            nodePusher(data[key], key)
          })
        }
      } else {
        if (parent) links.push({source: parent, target: data})
        topics.push(data);
      }
    }

    nodePusher(json, false)
    links.forEach(function(link, i) {
      link.source = topics.indexOf(link.source);
      link.target = topics.indexOf(link.target);
    });

    topics = topics.map(function(n) { return {id: n.toLowerCase()} })

    var clusters = [[]];

    // Basic setup
    var svg_width = width;
    var svg_height = height;

    // Set x and y for topics so they spring out
    for (var i=0; i<topics.length; i++) {
      var topic = topics[i];
      topic.x = (Math.random() * 100) - 100 + svg_width/2;
      topic.y = (Math.random() * 100) - 100 + svg_height/2;
    }

    // Set up SVG
    var svg = d3.select("#techgraph-holder")
      .append("svg")
      .attr('id', "techgraph")
      .attr("width", svg_width)
      .attr("height", svg_height);

    // Set up labels
    var label_sheet = d3.select("#techgraph-holder")
      .append("div")
      .classed("label_sheet", true)

    function drawLinks() {
      link_lines = svg.selectAll(".link").data(links);
      link_lines.enter()
        .append("line")
        .attr('class',"link")
      link_lines.exit().remove();
    }

    function drawNodes() {
      labels = label_sheet.selectAll('.label_holder').data(nodes);
      labels.exit().remove();
      var lEnter = labels.enter()
        .append("div")
        .attr("class", function(d) { if (d.fixed) {
            return "spacer";
          }
        })
        .classed("label_holder",true)
        .attr("id", function(d) { return d.id })
      var circle = lEnter.append("div")
        .classed("circle", true)
      var label = lEnter.append("div")
        .classed("label",true)
        .text(function(d) { return d.id; })
    }

    function setUp() {
      force
        .nodes(nodes)
        .links(links)
        .gravity(0.06)
        .size([svg_width, svg_height])
        .charge(function(d) {
          if (d.fixed) {
            var width = $window.width();
            if (width < 500) {
              return -1000
            } else if (width < 340) {
              return -600
            } else {
              return -2000
            }
          } else {
            return -600
          }
        })
        .linkDistance(120);
    }

    function update() {
      drawLinks();
      drawNodes();
      force.start();
    }

    // Spacer node for logo
    topics.push({
      _id: "logo_spacer_0",
      name: "spacer",
      x: (svg_width/2),
      y: (svg_height/2),
      fixed: true
    });

    nodes = topics;

    setUp();
    update();

    $(window).resize(function() {
      // If mobile donot change on height change
      if (no_scroll_events) {
        if ($window.width() != svg_width) {
          svg_width = $window.width();
          svg_height = $window.height();
          force.size([svg_width, svg_height]);
          svg
            .attr("width", svg_width)
            .attr("height", svg_height);
          // Spacer is last, kind of messy
          var spacer = nodes[nodes.length-1];
          spacer.x = svg_width/2;
          spacer.px = svg_width/2;
          spacer.y = svg_height/2;
          spacer.py = svg_height/2;
          update();
        }
      } else {
        svg_width = $window.width();
        svg_height = $window.height();
        force.size([svg_width, svg_height]);
        svg
          .attr("width", svg_width)
          .attr("height", svg_height);
        // Spacer is last, kind of messy
        var spacer = nodes[nodes.length-1];
        spacer.x = svg_width/2;
        spacer.px = svg_width/2;
        spacer.y = svg_height/2;
        spacer.py = svg_height/2;
        update();
      }
    });

    force.on("tick", function() {
      if (is_safari) {
        labels.style("-webkit-transform", function(d) {
          var node = d;
          if (!node.fixed) {
            var x_origin = width/2;
            var y_origin = height/2;
            var node_x = node.x - x_origin;
            var node_y = node.y - y_origin;
            var node_radius = Math.sqrt((node_x * node_x) + (node_y * node_y));
            var new_x = node_x - node_y * rotation_speed;
            var new_y = node_y + node_x * rotation_speed;
            var x = new_x + x_origin;
            var y = new_y + y_origin;
            node.x = x;
            node.y = y;
          }
          return "translate3D(" + Math.floor(d.x) + "px," + Math.floor(d.y) + "px, 0)";
        });
      } else {
        labels.style("transform", function(d) {
          var node = d;
          if (!node.fixed) {
            var x_origin = width/2;
            var y_origin = height/2;
            var node_x = node.x - x_origin;
            var node_y = node.y - y_origin;
            var node_radius = Math.sqrt((node_x * node_x) + (node_y * node_y));
            var new_x = node_x - node_y * rotation_speed;
            var new_y = node_y + node_x * rotation_speed;
            var x = new_x + x_origin;
            var y = new_y + y_origin;
            node.x = x;
            node.y = y;
          }
          return "translate3D(" + Math.floor(d.x) + "px," + Math.floor(d.y) + "px, 0)";
        });
      }
      link_lines.attr("x1", function(d) { return Math.floor(d.source.x); })
        .attr("y1", function(d) { return Math.floor(d.source.y); })
        .attr("x2", function(d) { return Math.floor(d.target.x); })
        .attr("y2", function(d) { return Math.floor(d.target.y); });
      if (force.alpha() < 0.02) {
        if (graph_active) {
          revolveGraph();
        }
      }
    });
  })

}