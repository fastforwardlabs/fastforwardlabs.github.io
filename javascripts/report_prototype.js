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
          break;
        }
      }
    });
    $html.on("mouseleave", function(e) {
      setTimeout(function() {
        $report_images.removeClass('active')
        $report_images.eq(0).addClass('active');
      },100);
    });
  });

  var prototypes = {};

  // Roborealtor
  prototypes.roborealtor = {};
  prototypes.roborealtor.color = "cyan";
  prototypes.roborealtor.number = "FF01";
  prototypes.roborealtor.name = "Roborealtor";
  prototypes.roborealtor.file_name = "roborealtor";

  function videoModuleHtml(prototype) {
    var html = '';
    html += '<div>';
    html += '<img class="video-backer" src="resources/images/video-back.svg" />';
    html += '<img class="video-screenshot" src="resources/videos/' + prototype.file_name + '.png" />';
    html += '<div class="sp sp-circle ' + prototype.color + '"></div>'
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
        $this.find('video').get(0).pause();
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

});