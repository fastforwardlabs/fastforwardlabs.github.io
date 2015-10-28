$(document).ready(function() {

  var width = $(window).width();
  var height = $(window).height();

  var $body = $('body');

	var $nav_links = $('.nav a');
	$nav_links.click(function() {
		var target = $(this.hash);
		$('html,body').animate({
		  scrollTop: target.offset().top
		}, 200);
		return false;
	});

	var $report_holder = $('.report-holder');
	$report_holder.each(function() {
		var $this = $(this);
		var width = $this.width();
		var $report_images = $this.find('img').not('.spacer');
		var image_num = $report_images.length;
		var sect_width = width/image_num;
		$this.on("mousemove",function(e) {
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
    $this.on("mouseleave",function() {
      setTimeout(function() {
        $report_images.removeClass('active')
        $report_images.eq(0).addClass('active');
      },100);
    });
	});

  var $overlay_info = $('#overlay-info');
  var $overlay_content = $('#overlay-content');
  var $overlay_content_inner = $('#overlay-content-inner');

  var reports = [];

  var ff01_report = {};
  ff01_report.color = "cyan";
  ff01_report.number = "FF01";
  ff01_report.title = "Natural Language Generation";
  ff01_report.info = "Machines are beginning to speak our language. Through natural language generation, computers can take highly structured data and output human language narrative. This report explores machine systems for natural language generation.";
  reports.push(ff01_report);

  var ff02_report = {};
  ff02_report.color = "magenta";
  ff02_report.number = "FF02";
  ff02_report.title = "Probabilistic Methods for Realtime Streams";
  ff02_report.info = "Deep learning, or highly-connected neural networks, offers fascinating new capabilities for image analysis. Using deep learning, computers can now learn to identify objects in images. This report explores the history and current state of the field, predicts future developments, and explains how to apply deep learning today.";
  reports.push(ff02_report);

  var ff03_report = {};
  ff03_report.color = "purple";
  ff03_report.number = "FF03";
  ff03_report.title = "Deep Learning: Image Analysis";
  ff03_report.info = "Deep learning, or highly-connected neural networks, offers fascinating new capabilities for image analysis. Using deep learning, computers can now learn to identify objects in images. This report explores the history and current state of the field, predicts future developments, and explains how to apply deep learning today.";
  reports.push(ff03_report);

  function makeInfoHtml(obj) {
    var html = '';
    html += '<div class="' + obj.number + '">';
    html += '<div id="report-num" class="' + obj.color + ' bold chambers">';
    html += obj.number;
    html += '</div>';
    html += '<div id="report-title" class="chambers bold mb1">';
    html += obj.title;
    html += '</div>';
    html += '<div id="report-info" class="chambers f3">';
    html += obj.info;
    html += '</div>';
    html += '</div>';
    return html;
  }

  function makeReportHtml(index) {
    var report_obj = reports[index];
    var info = makeInfoHtml(report_obj);
    return info;
  }

  function makePrototypeHtml(index) {
    var prototype_obj = prototypes[index];
    var info = makeInfoHtml(prototype_obj);
    return info;
  }

  $report_holder.click(function() {
    $body.addClass('overlayed');
    var $this = $(this);
    var $images = $this.find('img').not(".spacer").clone();
    var index = $report_holder.index($this);
    var report_html = makeReportHtml(index);
    $overlay_info.html(report_html);
    $overlay_content_inner.html($images);
    $overlay_content.scrollTop(0);
  });

	var $video_holder = $('.video-holder');
	$video_holder.mouseenter(function() {
		var $this = $(this);
		if ($this.hasClass('loaded') || $(this).hasClass('loading')) {
			$(this).find('video').get(0).play();
		} else {
			$this.addClass('loading');
			var name = $this.attr('data-video');
			var resource = "resources/videos/" + name + ".mp4";
			$this.append('<video src=' + resource + ' loop="true"></video>');
			var $video = $this.children('video');
			var video = $video.get(0);
			$video.on("canplay", function() {
				$this.removeClass('loading').addClass('loaded');
				video.play();
			});
		}
	});
	$video_holder.mouseleave(function() {
	  $(this).find('video').get(0).pause();
	});

  var prototypes = [];

  var ff01_prototype = {};
  ff01_prototype.color = "cyan";
  ff01_prototype.number = "FF01";
  ff01_prototype.title = "RoboRealtor";
  ff01_prototype.info = "Inspired by real estate sites, Roborealtor is a natural language generation prototype that takes the attributes for a hypothetical apartment and generates listings for it.";
  prototypes.push(ff01_prototype);

  var ff02_prototype = {};
  ff02_prototype.color = "magenta";
  ff02_prototype.number = "FF02";
  ff02_prototype.title = "CliqueStream";
  ff02_prototype.info = "CliqueStream displays popular topics across Twitter and Reddit as nodes in a force-directed graph where the connections are based on similarity of word use over all comments and tweets. Keyword groups add nodes based on how often the keyword is used. The probabilistic methods powering the prototype run in ~48 milliseconds. In a traditional analytics framework they would take around 15 minutes.";
  prototypes.push(ff02_prototype);

  var ff03_prototype = {};
  ff03_prototype.color = "purple";
  ff03_prototype.number = "FF03";
  ff03_prototype.title = 'Pictograph and <a target="_blank" href="http://pictograph.us">Fathom</a>';
  ff03_prototype.info = '<a href="http://pictograph.us" target="_blank">Pictograph</a> is our public image analysis prototype. It uses deep learning to analyze your Instagram photos and reveal your top interests in the form of a pictograph. Fathom is our more comprehensive, client-only, prototype. It allows you to explore our Instagram data set through categories, and you can see the algorithm at work on the photo detail pages.';
  prototypes.push(ff03_prototype);

  $video_holder.click(function() {
    $body.addClass('overlayed');
    var $this = $(this);
    var index = $video_holder.index($(this));
    var $video = $this.clone();
    var report_html = makePrototypeHtml(index);
    $overlay_info.html(report_html);
    $overlay_content_inner.html($video);
    $overlay_content.scrollTop(0);

    var $video_inner = $overlay_content_inner.find('.video_inner');

    $video = $overlay_content_inner.find($('video'));

    var video = $video.get(0);
    var progress_bar = '';
    progress_bar += '<div class="progress-holder col-12 absolute left-0 mb2" style="bottom: -3rem">';
    progress_bar += '<div class="progress"></div>';
    progress_bar += '</div>';
    console.log($video_inner);
    console.log(progress_bar);
    $video_inner.append(progress_bar);
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
  });

  var $learn_more = $('#learn-more');
  $learn_more.click(function() {
    var target = $('#product');
    $('html,body').animate({
      scrollTop: target.offset().top
    }, 200);
    return false;
  });

  $overlay_close = $('#overlay-close');
  $overlay_close.click(function() {
    $body.removeClass('overlayed');
  });

  var force = d3.layout.force();

  var revolving = true;
  var scrolled = false;

  $(window).scroll(function() {
    var $this = $(this);
    var scroll_top = $this.scrollTop();
    if (scroll_top > height) {
      if (!scrolled) {
        scrolled = true;
        revolving = false;
        $learn_more.addClass('scrolled');
      }
    } else {
      if (scrolled) {
        scrolled = false;
        revolving = true;
        $learn_more.removeClass('scrolled');
        if (typeof(force) != undefined) {
          force.alpha(0.03);
        }
      }
    }
  });

  var startTopicGraph = function() {

    var api = "http://techgraph.fastforwardlabs.com/api/";

    d3.json(api + "topics", function(error, response) {

      // From http://bl.ocks.org/mbostock/7555321
      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.2, // ems
            y = 1,
            dy = 1,
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y",0).attr('text-anchor','middle').attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").attr('text-anchor','middle').text(word);
            }
          }
          var bbox = text.node().getBBox();
          var padding = 12;
          var node = text[0][0].parentNode;
          var rect = d3.select(node).insert("rect", "text")
            .attr("x", -(bbox.width/2) - padding)
            .attr("y", -5)
            .attr("class","rect")
            .attr("width", bbox.width + (padding*2))
            .attr("height", bbox.height + 16);
        });
      }

      var topics = response;

      d3.json(api + "links", function(error, response) {

        function prepLink(link) {
          for (var j = 0; j < topics.length; j++) {
            var node = topics[j];
            if (node._id == link.source_id) {
              link.source = j;
            } else if (node._id == link.target_id) {
              link.target = j;
            }
          }
          return link;
        }

        // Prep likns
        var links_raw = response;
        var links = [];
        for (var i=0; i<links_raw.length; i++) {
          var link = links_raw[i];
          link = prepLink(link);
          links.push(link);
        }

        // Basic setup
        var svg_width = width;
        var svg_height = height;

        // Set up SVG
        var svg = d3.select("#graph-holder")
          .append("svg")
          .attr('id', "graph")
          .attr("width", svg_width)
          .attr("height", svg_height);

        function drawNodes() {
          node = svg.selectAll(".node")
            .data(topics)
            .enter()
            .append('g')
            .attr("class", function(d) { 
              if (d.fixed) {
                return "spacer node";
              } else if (d.name == "natural language generation") {
                return "nlg";
              } else if (d.name == "probabilistic methods for realtime streams") {
                return "pmrs";
              } else if (d.name == "deep learning: image analysis") {
                return "dlia";
              } else {
                return "node";
              }
            })

          var text = node
            .append("text")
            .text(function(d) { return d.name; })
            .attr("class", "text")
            .call(wrap, 150);
        }

        function drawLinks() {
          link_lines = svg.selectAll(".link", function(d) { return d._id; }).data(links);
          link_lines.enter()
            .append("line")
            .attr('class',"link")
          link_lines.exit().remove();
        }

        function setUp() {
          force
            .nodes(topics)
            .links(links)
            .gravity(0.06)
            .charge(function(d) {
              if (d.fixed) {
                return -2500;
              } else {
                return -800
              }
            })
            .size([svg_width, svg_height])
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

        // topics.push({
        //   _id: "mouser",
        //   name: "mouser",
        //   x: (svg_width/2),
        //   y: (svg_height/2),
        //   fixed: true
        // });

        var w_center = width/2;
        var h_center = height/2;
        var pt = [w_center,h_center];

        var rotation_speed = ((Math.PI/180)/300);

        force.on("tick", function() {

          var x_from_center = pt[0] - w_center;
          var x_scaled = (x_from_center/w_center)/8;
          var y_from_center = pt[1] - h_center;
          var y_scaled = (y_from_center/h_center)/8;

          node.attr("transform", function(d) {
            if (node.name != "spacer") {
              var node_x = d.x - w_center;
              var node_y = d.y - h_center;
              var new_x = node_x - node_y * rotation_speed;
              var new_y = node_y + node_x * rotation_speed;
              var x = new_x + w_center - x_scaled;
              var y = new_y + h_center - y_scaled;
              d.x = x;
              d.y = y;
            }
            return 'translate(' + [d.x, d.y] + ')';
          });

          link_lines
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          if (revolving) {
            if (force.alpha() < 0.02) {
              force.alpha(0.02)
            }
          }
        });

        setUp();
        update();

        svgagain = d3.select("#graph-holder").select("svg");
        // var mouser = topics[topics.length - 1];

        svgagain.on("mousemove", function() {
          pt = d3.mouse(this);
          // mouser.px = pt[0];
          // mouser.py = pt[1];
          // force.resume();
          // var x_from_center = pt[0] - (width/2);
          // var y_from_center = pt[1] - (height/2);
          // var stepper = 10;
          // $.each(topics, function(i,topic) {
          //   if (topic.name != "spacer") {
          //     if (x_from_center > 0) {
          //       topic.px = topic.px + stepper;
          //     } else {
          //       topic.px = topic.px - stepper;
          //     }
          //     if (y_from_center > 0) {
          //       topic.py = topic.py + stepper;
          //     } else {
          //       topic.py = topic.py - stepper;
          //     }
          //   }
          //   // topic.py = topic.py + 2;
          // });
          // force.resume();
        });

      });

    });

  }

  startTopicGraph();

})