var data = {"18": {"words": ["leather", "product", "used", "new", "use", "like", "products", "stuff", "cleaner", "old"], "weight": 0.58243540513206, "sentences": ["It's about as thick as honey.", "I can see why they call it Honey Leather Conditioner!", "This moisturizes well, but darkens leather."]}, "23": {"words": ["reviews", "read", "did", "review", "decided", "try", "reading", "say", "bought", "said"], "weight": 0.03140957089987237, "sentences": ["I read the reviews and decided to try it.", "I have to agree with the other reviewers.", "I'd never heard of it before, but after reading the review, thought I'd give it a shot."]}, "12": {"words": ["don", "just", "know", "ll", "like", "thing", "ve", "want", "people", "think"], "weight": 0.030175583498088993, "sentences": ["I can imagine many people have become alarmed by this--but don't be.", "I am feeling dumb and stupid now.", "No one knows how these things happen, but everyone knows they do."]}, "45": {"words": ["got", "day", "went", "car", "right", "did", "didn", "just", "time", "started"], "weight": 0.02989038240660766, "sentences": ["See for yourself.", "Though I have thought I might try it if I go on vacation for a week with the car at home.", "I believe I saw something on Pinterest."]}, "72": {"words": ["clean", "water", "use", "cleaning", "spray", "dry", "cleaner", "used", "towel", "towels"], "weight": 0.02514146062995224, "sentences": ["I only had terrycloth rags with me...", "Have to have two or three rags.", "Then wipe with a dry cloth."]}, "27": {"words": ["vehicle", "products", "years", "best", "product", "ve", "vehicles", "experience", "available", "different"], "weight": 0.019172725891528512, "sentences": ["There's only 2 facts that are true in this situation. 1.)", "Regardless, an extremely satisfying result.", "It has been satisfying customers for many, many years!"]}, "8": {"words": ["gloves", "hands", "like", "hand", "feel", "grip", "glove", "little", "good", "really"], "weight": 0.01779342996866594, "sentences": ["", "I put on latex gloves and used my hands.", "I use it bare handed, and my skin feels soft and good afterwards."]}, "33": {"words": ["size", "jacket", "fit", "small", "large", "wear", "like", "ordered", "fits", "nice"], "weight": 0.013407443164822935, "sentences": ["I have Top gear leather, pants and jackets.", "The Jacket is a size Large, and falls right below my waist.", "Another leather jacket that was a gift, but has always been too stiff to be comfortable.3)"]}}

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
    url: "http://grantcuster.com/crux/php/amazon.php?product_id=B003IS3HV0",
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