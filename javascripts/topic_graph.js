$(document).ready(function() {

  var width = $(window).width();
  var height = $(window).height();

  var force = d3.layout.force();

  var revolving = true;
  var scrolled = false;
  var bottom = false;
  var $bottom_check = $('#bottom-check');
  var content_bottom = 2000;
  setTimeout(function() {
    content_bottom = $bottom_check.offset().top;
  },500)

  var $body = $('body');
  var topics = "";
  var updateGraph = "";

  $(window).scroll(function() {
    var $this = $(this);
    var scroll_top = $this.scrollTop();
    if (scroll_top > height) {
      if (!scrolled) {
        scrolled = true;
        revolving = false;
        $body.addClass('scrolled');
      }
      if (scroll_top >= content_bottom) {
        bottom = true;
        var last_topic = topics[topics.length - 1];
        if (last_topic._id == "logo_spacer_0") {
          topics.pop();
        }
        updateGraph();
        $body.addClass('bottom')
      } else {
        bottom = false;
        $body.removeClass('bottom');
      }
    } else {
      if (scrolled) {
        scrolled = false;
        revolving = true;
        bottom = false;
        $body.removeClass('scrolled bottom');
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

      topics = response;

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
          .attr("height", svg_height)
          .attr({xlink: "http://www.w3.org/1999/xlink"});

        var defs = svg.append("defs");

        // Cyan back
        defs.append("pattern")
            .attr({
              "id": "cyan",
              patternUnits: "userSpaceOnUse",
              width: 370,
              height: 370
            })
            .append("image")
            .attr({
              "xlink:href":"images/letterpress-back.jpg",
              x: 0,
              y: 0,
              width: 370,
              height: 370
            });

        defs.append("pattern")
            .attr({
              "id": "magenta",
              patternUnits: "userSpaceOnUse",
              width: 370,
              height: 370
            })
            .append("image")
            .attr({
              "xlink:href":"images/letterpress-back-magenta.jpg",
              x: 0,
              y: 0,
              width: 370,
              height: 370
            });

        defs.append("pattern")
            .attr({
              "id": "purple",
              patternUnits: "userSpaceOnUse",
              width: 370,
              height: 370
            })
            .append("image")
            .attr({
              "xlink:href":"images/letterpress-back-purple.jpg",
              x: 0,
              y: 0,
              width: 370,
              height: 370
            })

        function drawNodes() {
          node = svg.selectAll(".node");
          node = node.data(topics, function(d) { return d._id; });

          var nodeEnter = node.enter();

          var gnode = nodeEnter.append('g')
            .attr("class", function(d) {
              if (d.fixed) {
                return "node spacer";
              } else if (d.name == "natural language generation") {
                return "node nlg";
              } else if (d.name == "probabilistic methods for realtime streams") {
                return "node pmrs";
              } else if (d.name == "deep learning: image analysis") {
                return "node dlia";
              } else {
                return "node";
              }
            });

          var text = gnode
            .append("text")
            .text(function(d) { return d.name; })
            .attr("class", "text")
            .call(wrap, 150);

          node.exit().remove();
        }

        function drawLinks() {
          link_lines = svg
            .selectAll(".link", function(d) { return d._id; })
            .data(links);

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

        updateGraph = function() {
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
        updateGraph();

        // svgagain = d3.select("#graph-holder").select("svg");

        // svgagain.on("mousemove", function() {
        //   pt = d3.mouse(this);
        // });

      });

    });

  }

  startTopicGraph();

});