$(document).ready(function() {

	var $nav_links = $('.nav a');
	$nav_links.click(function() {
		var target = $(this.hash);
		$('html,body').animate({
		  scrollTop: target.offset().top
		}, 200);
		return false;
	});

	var $report_holder = $('.full-holder');
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

  var width = $(window).width();
  var height = $(window).height();

  var force = d3.layout.force();

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
              } else if (d.name == "probabilistic analysis methods") {
                return "pmrs";
              } else if (d.name == "deep learning") {
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
                return -2000;
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

        force.on("tick", function() {

          var x_range = (1000 - w_center)/1000;
          var x_from_center = pt[0] - w_center;
          var x_scaled = (x_from_center/w_center) * x_range;
          var y_range = (1000 - h_center)/1000;
          var y_from_center = pt[1] - h_center;
          var y_scaled = (y_from_center/h_center) * y_range;

          console.log(x_scaled);

          node.attr("transform", function(d) {
            if (node.name != "spacer") {
              new_x = d.x - x_scaled;
              d.x = new_x;
              new_y = d.y - y_scaled;
              d.y = new_y;
            }
            return 'translate(' + [d.x, d.y] + ')';
          });

          link_lines
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          if (force.alpha() < 0.02) {
            force.alpha(0.02)
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