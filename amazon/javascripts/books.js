var data = {"25": {"words": ["dark", "horror", "like", "novel", "just", "scary", "ghost", "mind", "evil", "disturbing"], "weight": 0.20841761288157173, "sentences": ["It was this that haunted Setrakian.", "Sardu!", "Scary, very scary."]}, "11": {"words": ["love", "vampire", "world", "series", "romance", "vampires", "new", "really", "paranormal", "like"], "weight": 0.15207766620399535, "sentences": ["These are not sparkly vampires.", "There are no moody teenagers battling hormones and vampire/werewolf love triangles.", "Vampires have been done, over and over again."]}, "41": {"words": ["book", "martin", "time", "just", "like", "long", "george", "new", "going", "way"], "weight": 0.04350417571567234, "sentences": ["Upon taxiing to the terminal, the plane stops.", "Air traffic controllers frantically reroute flights and emergency crews close in.", "A jumbo jet lands at JFK and simply stops on the taxiway."]}, "15": {"words": ["book", "movie", "read", "film", "better", "seen", "like", "movies", "tv", "reading"], "weight": 0.037307892422838315, "sentences": ["It was a movie, or should have been.", "Will it be a movie.", "I watched the movie and loved it."]}, "19": {"words": ["characters", "story", "character", "main", "plot", "interesting", "really", "book", "felt", "didn"], "weight": 0.036712846271899295, "sentences": ["The characters are all believable and fully matured; I didn't really feel that any of the characters were overplayed or underused.", "Character development is a bit thin but the pacing is well done.", "The plot, the writing,  and character development are impecabble."]}, "49": {"words": ["book", "just", "author", "writing", "boring", "plot", "pages", "characters", "like", "bad"], "weight": 0.033678338151799644, "sentences": ["Boring, blah, formulaic.", "So terribly ridiculous.", "The writing is riddled with cliches and at times downright atrocious."]}, "72": {"words": ["characters", "story", "novel", "fiction", "read", "action", "historical", "michael", "plot", "crichton"], "weight": 0.027034004803762824, "sentences": ["This is a tightly-plotted, fast-paced supernatural thriller.", "Riveting with a masterful blend of history and lore, action and intellectual thriller.", "The Strain will not disappoint you."]}, "78": {"words": ["book", "read", "books", "reading", "wait", "series", "loved", "couldn", "ve", "just"], "weight": 0.026016025615682954, "sentences": ["Fantastic read couldn't stop till I finished it!", "Just finished the 2nd book in the series and can't wait for the 3rd.", "Can't wait to finish the other two books of the trilogy."]}}

var data_array = [];
for (var key in data) {
  if (data.hasOwnProperty(key)) {
    data_array.push(data[key]);
  }
}

var $content = $('#content');

var html = '';
html += '<div id="header" class="bold h3">';
html += 'Review Topics';
html += '</div>';
$.each(data_array, function(i, topic) {
  html += '<div class="topic-holder container py2 border-bottom">'
  html += '<div class="topic">';
  html += '<div class="words gray bold mb1">';
  $.each(topic.words, function(k, word) {
    html += word + ' ';
  });
  html += '</div>';
  $.each(topic.sentences, function(j, sentence) {
    html += '<div class="sentence mb1">';
    html += '&ldquo;';
    html += sentence;
    html += '&rdquo;';
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';
});

// Changes XML to JSON from https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

var $product = $('#product');

$.ajax({
    type: "get",
    url: "http://grantcuster.com/crux/php/amazon.php?product_id=0061558230",
    dataType: "xml",
    success: function(data) {
      var json = xmlToJson(data);
      var item = json.ItemLookupResponse.Items.Item;
      var image_url = item.LargeImage.URL["#text"];
      var title = item.ItemAttributes.Title["#text"];
      var link = item.DetailPageURL["#text"];
      var html = '';
      html += '<div class="">';
      html += '<div class="center">';
      html += '<img class="inline-block" src="' + image_url + '"/>';
      html += '</div>';
      html += '<a class="bold" href="' + link + '">';
      html += '<h2>'
      html += title;
      html += '</h2>'
      html += '</a>';
      html += '</div>';
      $product.html(html);
    },
    error: function(xhr, status) {
      console.log('error?');
      console.log(xhr);
      console.log(status);
    }
});

$content.html(html);