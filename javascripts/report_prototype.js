$(document).ready(function() {

  var reports = {};

  // FF01 config
  reports.ff01 = {};
  reports.ff01.color = "cyan";
  reports.ff01.number = "FF01";
  reports.ff01.title = "Natural Language Generation";
  reports.ff01.image_dir = "nlg";
  reports.ff01.images = ["00.jpg", "01.jpg", "02.jpg", "03.jpg", "04.jpg"];
  reports.ff01.info = "Machines are beginning to speak our language. Through natural language generation, computers can take highly structured data and output human language narrative. This report explores machine systems for natural language generation.";

  // FF02 config
  reports.ff02 = {};
  reports.ff02.color = "magenta";
  reports.ff02.number = "FF02";
  reports.ff02.title = "Probabilistic Methods for Realtime Streams";
  reports.ff02.image_dir = "pmrs";
  reports.ff02.images = ["00.jpg", "01.jpg", "02.jpg", "03.jpg", "04.jpg"];
  reports.ff02.info = "Realtime analysis is a challenge for modern data systems. The probabilistic methods explored in this report offer highly efficient models for extracting value from streams of data as they are generated. This orders-of-magnitude improvement in efficiency enables many new applications and modes of computation.";

  // FF02 config
  reports.ff03 = {};
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
    html += '<div class="report-progress col-12 relative" style="margin-top: 1rem">';
    html += '<div class="col-12" style="height: 0.1rem; background: #efefef">';
    for (var i=0; i<report.images.length; i++) {
      var marker_class = 'report-marker left';
      if (i==0) {
        marker_class += ' active';
      }
      html += '<div class="' + marker_class + '" style="width: 20%; height: 100%;"></div>';
    }
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
    var sect_width = width/image_num;
    $html.on("mousemove", function(e) {
      var $this = $(this);
      var mouse_x = e.pageX - $this.offset().left;
      for (var i=0; i<image_num; i++) {
        var multiplier = i + 1;
        if (mouse_x < sect_width * multiplier) {
          $report_images.removeClass('active');
          $report_images.eq(i).addClass('active');
          $report_markers.removeClass('active');
          $report_markers.eq(i).addClass('active');
          break;
        }
      }
    });
    // $html.on("mouseleave", function(e) {
    //   setTimeout(function() {
    //     $report_images.removeClass('active')
    //     $report_images.eq(0).addClass('active');
    //     $report_markers.removeClass('active');
    //     $report_markers.eq(0).addClass('active');
    //   },100);
    // });
  });

  var prototypes = {};

  // Roborealtor
  prototypes.roborealtor = {};
  prototypes.roborealtor.color = "cyan";
  prototypes.roborealtor.number = "FF01";
  prototypes.roborealtor.name = "Roborealtor";
  prototypes.roborealtor.file_name = "roborealtor";

  // CliqueStream
  prototypes.cliquestream = {};
  prototypes.cliquestream.color = "magenta";
  prototypes.cliquestream.number = "FF02";
  prototypes.cliquestream.name = "CliqueStream";
  prototypes.cliquestream.file_name = "cliquestream";

  // Fathom
  prototypes.fathom = {};
  prototypes.fathom.color = "purple";
  prototypes.fathom.number = "FF03";
  prototypes.fathom.name = "Fathom and Pictograph";
  prototypes.fathom.file_name = "fathom";

  function videoModuleHtml(prototype) {
    var html = '';
    html += '<div class="relative">';
    html += '<img class="video-backer" src="resources/images/video-back.svg" />';
    html += '<img class="video-screenshot" src="resources/videos/' + prototype.file_name + '.png" />';
    html += '<div class="sp sp-circle ' + prototype.color + '"></div>'
    html += '</div>';
    html += '<div class="video-progress col-12 relative" style="margin-top: 1rem">';
    html += '<div class="col-12" style="height: 0.1rem; background: #efefef">';
    html += '<div class="progress-bar" style="width: 20%; height: 100%;"></div>';
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

    var video_inserted = false;
    var video_loaded = false;
    var video_playing = false;

    $html.on("mouseenter", function() {
      var $this = $(this);
      video_playing = true;
      if (video_inserted) {
        $this.find('video').get(0).play();
      } else {
        $this.addClass('loading');
        var resource = 'resources/videos/' + prototype.file_name + '.mp4';
        var $video = $('<video src="' + resource + '" loop="true"></video>');
        $this.append($video);
        video_inserted = true;

        var video = $video.get(0);
        $video.on("canplay", function() {
          $this.removeClass('loading').addClass('loaded');
          if (video_playing) {
            video.play();
          }
        })
      }
    });
    $html.on("mouseleave", function() {
      video_playing = false;
      $this.find('video').get(0).pause();
    });
  });

  window.overlay_objects = {};

  function generateReportOverlayContent(report) {
    var report_obj = reports[report];
    var content = '<div class="mb2">';
    content += '<p>' + report_obj.info + '</p>';
    content += '</div>';
    content += '<div class="report-overlay-images">';
    for (var i=0; i<report_obj.images.length; i++) {
      var image = report_obj.images[i];
      var html = '<img src="images/' + report_obj.image_dir + '/' + image + '" />';
      content += html;
    }
    content += '</div>';
    return content;
  }

  var overlay_ender = '<div class="clearfix" style="margin-top: -0.5rem"><div class="nav clearfix mb2"><div class="right"><a href="#">Back to Product</a></div></div>';

  window.overlay_objects.ff01 = {};
  var ff01 = window.overlay_objects.ff01;
  ff01.head_title = "FF01";
  ff01.color = "cyan";
  ff01.title = "Natural Language Generation";
  ff01.links = ['<a class="active" href="#">Report</a>','<a class="" href="#">Prototype</a>'];
  var content = generateReportOverlayContent("ff01");
  ff01.content = content;
  ff01.content += overlay_ender;

  window.overlay_objects.ff02 = {};
  var ff02 = window.overlay_objects.ff02;
  ff02.head_title = "FF02";
  ff02.color = "magenta";
  ff02.title = "Probabilistic Methods for Realtime Streams";
  ff02.links = ['<a class="active" href="#">Report</a>','<a class="" href="#">Prototype</a>'];
  var content = generateReportOverlayContent("ff02");
  ff02.content = content;
  ff02.content += overlay_ender;

  window.overlay_objects.ff03 = {};
  var ff03 = window.overlay_objects.ff03;
  ff03.head_title = "FF03";
  ff03.color = "purple";
  ff03.title = "Deep Learning: Image Analysis";
  ff03.links = ['<a class="active" href="#">Report</a>','<a class="" href="#">Prototype</a>'];
  var content = generateReportOverlayContent("ff03");
  ff03.content = content;
  ff03.content += overlay_ender;

});