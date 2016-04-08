var data = {"69": {"words": ["hair", "brush", "fur", "long", "works", "cat", "use", "short", "tool", "haired"], "weight": 0.10313543279545143, "sentences": ["The FURminator!!", "The Furminator.", "the FURminator will get you."]}, "1": {"words": ["products", "product", "pet", "company", "china", "pets", "read", "information", "review", "website"], "weight": 0.10265297821206916, "sentences": ["Chinese replica.", "The product this distributor is selling infringes on patent laws and is a theft of intellectual property.", "The notified me that there are many counterfeit products on the market and that there was nothing that they could do about this instance."]}, "74": {"words": ["purpose", "quite", "ve", "design", "intended", "time", "designed", "does", "simply", "probably"], "weight": 0.06738494876653225, "sentences": ["But to completely remove it it requires that extra effort of your other hand in order to take it off (kind of defeats the purpose).Overall, it's ok.", "This is the proverbial \"better mousetrap.\"", "Then he/she may learn to dislike being brushed which would defeat you're purpose."]}, "4": {"words": ["away", "went", "took", "got", "time", "didn", "day", "night", "thought", "right"], "weight": 0.047213878950489035, "sentences": ["so I relented.", "No more resentment.", "She sat there so patiently as we ran the comb over her (which she never does)."]}, "56": {"words": ["just", "life", "thank", "thing", "know", "little", "time", "say", "like", "best"], "weight": 0.034689055048153485, "sentences": ["Dear god.", "Oh my gosh!", "Whoever invented this is a genius."]}, "52": {"words": ["don", "time", "know", "ve", "want", "make", "think", "ll", "say", "things"], "weight": 0.032723765583614034, "sentences": ["She has so much knowledge about dogs I seek her advice frequently", "That said, you have to start slowly and be patient.", "the only advice I can give you is be patient."]}, "63": {"words": ["vet", "life", "years", "results", "did", "said", "months", "year", "ago", "old"], "weight": 0.03022900278091854, "sentences": ["Stella was recently Ill-She has Addisons disease.", "I donated the qty 2 of these that we bought to the vet technicians at our vet clinic.", "My father saw a poster at his doctors office so he told us to try it."]}, "45": {"words": ["clean", "use", "just", "vacuum", "does", "easy", "hair", "gets", "floor", "like"], "weight": 0.028660246195553442, "sentences": ["There is less and less hairs being picked up by the Dyson vacuum cleaner.", "I vaccuum less!", "We have less hair on our floors and rugs."]}}

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
  html += '<div class="words bold gray mb1">';
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
    url: "http://grantcuster.com/crux/php/amazon.php?product_id=B0040QOYZ2",
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