$(document).ready(function() {

  var supportsTouch = !!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
  // supportsTouch = true;
  var noTouch = !supportsTouch;

  var reports = {};

  // FF01 config
  reports.ff01 = {};
  reports.ff01.type = "report";
  reports.ff01.color = "cyan";
  reports.ff01.number = "FF01";
  reports.ff01.title = "Natural Language Generation";
  reports.ff01.image_dir = "nlg";
  reports.ff01.images = ["00.jpg", "01.jpg", "02.jpg", "03.jpg", "04.jpg"];
  reports.ff01.info = "Machines are beginning to speak our language. Through natural language generation, computers can take highly structured data and output human language narrative. This report explores machine systems for natural language generation.";

  // FF02 config
  reports.ff02 = {};
  reports.ff02.type = "report";
  reports.ff02.color = "magenta";
  reports.ff02.number = "FF02";
  reports.ff02.title = "Probabilistic Methods for Realtime Streams";
  reports.ff02.image_dir = "pmrs";
  reports.ff02.images = ["00.jpg", "01.jpg", "02.jpg", "03.jpg", "04.jpg"];
  reports.ff02.info = "Realtime analysis is a challenge for modern data systems. The probabilistic methods explored in this report offer highly efficient models for extracting value from streams of data as they are generated. This orders-of-magnitude improvement in efficiency enables many new applications and modes of computation.";

  // FF03 config
  reports.ff03 = {};
  reports.ff03.type = "report";
  reports.ff03.color = "purple";
  reports.ff03.number = "FF03";
  reports.ff03.title = "Deep Learning: Image Analysis";
  reports.ff03.image_dir = "dlia";
  reports.ff03.images = ["00.jpg"];
  reports.ff03.info = "Deep learning, or highly-connected neural networks, offers fascinating new capabilities for image analysis. Using deep learning, computers can now learn to identify objects in images. This report explores the history and current state of the field, predicts future developments, and explains how to apply deep learning today.";

  function reportModuleHtml(report) {
    var html = '';
    html += '<div>';
    html += '<img class="spacer" src="images/spacer.png">';
    for (var i=0; i<report.images.length; i++) {
      var img_class = 'report-img';
      if (i==0) {
        img_class += ' active';
      }
      html += '<img class="' + img_class + '" src="images/' + report.image_dir + '/' + report.images[i] + '" />'
    }
    html += '</div>';
    html += '<div class="report-progress display-none col-12 relative" style="margin-top: 1rem">';
    html += '<div class="col-12 report-marker-holder" style="height: 0.1rem;">';
    html += '<div class="report-marker" style="height: 100%; width: 0%;"></div';
    html += '</div>';
    return html;
  }

  var $report_holders = $('.report-holder');

  $report_holders.each(function() {
    var $this = $(this);
    var width = $this.width();

    var report_selector = $this.attr('data-report');
    var report = reports[report_selector];
    var html = reportModuleHtml(report);
    var $html = $(html);
    $this.html($html);

    var $report_images = $html.find('.report-img');
    var $report_markers = $html.find('.report-marker');
    var image_num = $report_images.length;

    var flipInterval = false;
    var interval_pause = false;

    $this.on('mouseenter', function() {
      if (noTouch) {
        flipInterval = setInterval(function() {
          if (interval_pause) {
            interval_pause = false;
          } else {
            var active_image = $this.find('.active');
            // index starts at one because of spacer image
            var active_index = active_image.index();
            if (active_index == image_num) {
              next_index = 1;
              interval_pause = true;
            } else if (active_index == (image_num - 1)) {
              interval_pause = true;
              next_index = active_index + 1;
            } else {
              next_index = active_index + 1;
            }
            $report_images.removeClass('active');
            $report_images.eq(next_index - 1).addClass('active');
          }
        }, 500);
      }
    });

    $this.on('mouseleave', function() {
      if (noTouch) {
        if (flipInterval) {
          clearInterval(flipInterval);
        }
        $report_images.removeClass('active');
        $report_images.eq(0).addClass('active');
      }
    });

    $this.on('click', function() {
      if (noTouch) {
        clearInterval(flipInterval);
        $report_images.removeClass('active');
        $report_images.eq(0).addClass('active');
      }
    });

  });

  var prototypes = {};

  // Roborealtor
  prototypes.roborealtor = {};
  prototypes.roborealtor.type = "prototype";
  prototypes.roborealtor.color = "cyan";
  prototypes.roborealtor.number = "FF01";
  prototypes.roborealtor.name = "Roborealtor";
  prototypes.roborealtor.file_name = "roborealtor";
  prototypes.roborealtor.info = "Inspired by real estate sites, Roborealtor is a natural language generation prototype that takes the attributes for a hypothetical apartment and generates listings for it.";

  // CliqueStream
  prototypes.cliquestream = {};
  prototypes.cliquestream.type = "prototype";
  prototypes.cliquestream.color = "magenta";
  prototypes.cliquestream.number = "FF02";
  prototypes.cliquestream.name = "CliqueStream";
  prototypes.cliquestream.file_name = "cliquestream";

  // Fathom
  prototypes.fathom = {};
  prototypes.fathom.type = "prototype";
  prototypes.fathom.color = "purple";
  prototypes.fathom.number = "FF03";
  prototypes.fathom.name = "Fathom and Pictograph";
  prototypes.fathom.file_name = "fathom";

  function videoModuleHtml(prototype) {
    var html = '';
    html += '<div class="video-inside-holder">';
    html += '<div class="relative video-inside">';
    html += '<img class="video-backer" src="resources/images/video-back.svg" />';
    html += '<img class="video-screenshot" src="resources/videos/' + prototype.file_name + '.png" />';
    html += '<div class="sp sp-circle ' + prototype.color + '"></div>'
    html += '</div>';
    html += '</div>';
    return html;
  }

  var $video_holders = $('.video-holder');

  $video_holders.each(function() {
    var $this = $(this);
    var width = $this.width();

    var prototype_selector = $this.attr('data-prototype');
    var prototype = prototypes[prototype_selector];
    var html = videoModuleHtml(prototype);
    var $html = $(html);
    $this.html($html);

    var $progress_indicator = $html.find('.progress-bar');

    var video_inserted = false;
    var video_loaded = false;
    var video_playing = false;

    $html.on("mouseenter", function() {
      if (noTouch) {
        var $this = $(this);
        video_playing = true;
        if (video_inserted) {
          $this.find('video').get(0).play();
        } else {
          $this.addClass('loading');
          var resource = 'resources/videos/' + prototype.file_name + '.mp4';
          var $video = $('<video src="' + resource + '" loop="true"></video>');
          $this.find('.video-inside').append($video);
          video_inserted = true;

          // update HTML5 video current play time
          $video.on('timeupdate', function() {
            var currentPos = video.currentTime; //Get currenttime
            var maxduration = video.duration; //Get video duration
            var percentage = 100 * currentPos / maxduration; //in %
            $progress_indicator.css('width', percentage+'%');
          });

          var video = $video.get(0);
          $video.on("canplay", function() {
            $this.removeClass('loading').addClass('loaded');
            if (video_playing) {
              video.play();
            }
          })
        }
      }
    });
    $html.on("mouseleave", function() {
      if (noTouch) {
        video_playing = false;
        $this.find('video').get(0).pause();
      }
    });
  });

  window.overlay_objects = {};

  function generateReportOverlayContent(report) {
    var report_obj = reports[report];
    var content = '<div class="container narrower">';
    content += '<p>' + report_obj.info + '</p>';
    content += '</div>';
    content += '<div class="report-overlay-images">';
    for (var i=0; i<report_obj.images.length; i++) {
      var image = report_obj.images[i];
      var html = '<img style="margin: 0 auto 1rem; display: block;" src="images/' + report_obj.image_dir + '/' + image + '" />';
      content += html;
    }
    content += '</div>';
    return content;
  }

  function generatePrototypeOverlayContent(prototype) {
    var prototype_obj = prototypes[prototype];
    var content = '<div class="container narrower">';
    var resource = 'resources/videos/' + prototype_obj.file_name + '.mp4';
    content += '<p>' + prototype_obj.info + '</p>';
    content += '</div>';
    if (noTouch) { 
      var touchClass = ''
    } else { 
      var touchClass = 'touch'
    };
    content += '<div class="video-holder container relative overlay-video ' + touchClass + '" style="max-width: 38rem; margin-bottom: 0.75rem;">';
    content += '<div class="loaded">'
    content += '<img class="video-screenshot" src="resources/videos/' + prototype_obj.file_name + '.png" />';
    content += '<img class="video-backer" src="resources/images/video-back.svg" />';
    if (noTouch) {
      content += '<video src="' + resource + '" class="col-12" loop="true"></video>';
    }
    content += '</div>';
    content += '<div class="status-indicator">';
    content += '<i class="fa fa-play"></i>';
    content += '<i class="fa fa-pause"></i>';
    content += '</div>';
    content += '</div>';
    content += '<div class="progress-bar-holder col-12" style="max-width: 38rem; margin: 0 auto;">';
    content += '<div class="progress-bar-indicator"></div>'
    content += '</div>';
    return content;
  }

  window.overlay_objects.ff01 = {};
  var ff01 = window.overlay_objects.ff01;
  ff01.head_title = "FF01";
  ff01.color = "cyan";
  ff01.title = "Natural Language Generation";
  ff01.links = ['<span class="fake-link active">Report</span>','<span class="overlayer fake-link" data-overlay="roborealtor">Prototype</span>'];
  var content = generateReportOverlayContent("ff01");
  ff01.content = content;

  window.overlay_objects.roborealtor = {};
  var roborealtor = window.overlay_objects.roborealtor;
  roborealtor.head_title = "FF01";
  roborealtor.type = "prototype";
  roborealtor.color = "cyan";
  roborealtor.title = "RoboRealtor"
  roborealtor.links = ['<span class="fake-link overlayer" data-overlay="ff01">Report</span>','<span class="fake-link active" href="#">Prototype</span>'];
  var content = generatePrototypeOverlayContent("roborealtor");
  roborealtor.content = content;

  window.overlay_objects.ff02 = {};
  var ff02 = window.overlay_objects.ff02;
  ff02.head_title = "FF02";
  ff02.color = "magenta";
  ff02.title = "Probabilistic Methods for Realtime Streams";
  ff02.links = ['<a class="active" href="#">Report</a>','<a class="" href="#">Prototype</a>'];
  var content = generateReportOverlayContent("ff02");
  ff02.content = content;

  window.overlay_objects.ff03 = {};
  var ff03 = window.overlay_objects.ff03;
  ff03.head_title = "FF03";
  ff03.color = "purple";
  ff03.title = "Deep Learning: Image Analysis";
  ff03.links = ['<span class="active">Report</a>','<span class="">Prototype</span>'];
  var content = generateReportOverlayContent("ff03");
  ff03.content = content;

});