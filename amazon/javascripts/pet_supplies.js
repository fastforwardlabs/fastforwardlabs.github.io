var data = {"1": {"words": ["products", "product", "pet", "company", "china", "pets", "read", "information", "review", "website"], "weight": 0.15779303943416417, "sentences": ["Nothing illegal.", "Products produced for US distribution are EPA approved.", "Products for International markets, are not EPA approved."]}, "92": {"words": ["fleas", "flea", "product", "works", "used", "cats", "frontline", "using", "dogs", "work"], "weight": 0.06854659030905517, "sentences": ["No infestations at all.", "They get Sentinel for heartworm + fleas.", "NO fleas or tics with Frontline!"]}, "76": {"words": ["product", "used", "dog", "use", "skin", "dogs", "using", "vet", "did", "reaction"], "weight": 0.06838057690007911, "sentences": ["Never a reaction when applying .", "There have been no adverse reactions to the medication and they have never contracted Lyme disease.", "No side effects or skin reactions."]}, "63": {"words": ["vet", "life", "years", "results", "did", "said", "months", "year", "ago", "old"], "weight": 0.05995450643415486, "sentences": ["IV's for dehydration from vomiting.", "Then he began vomiting and had explosive diahrrea.", "I spoke to my vet about this when bringing my girl in for her annual shots and he said that I'm not the only one who said this."]}, "74": {"words": ["purpose", "quite", "ve", "design", "intended", "time", "designed", "does", "simply", "probably"], "weight": 0.0574104945274191, "sentences": ["Will be better able to evaluate after more usage as to the effectiveness.", "Otherwise, it is a necessity with the occasional flea appearance.", "Vigilance is the basic cure."]}, "4": {"words": ["away", "went", "took", "got", "time", "didn", "day", "night", "thought", "right"], "weight": 0.038981661334225454, "sentences": ["I was standing maybe 2 feet away from her and she was whining and crying as I was calling her to come to me.", "It was absolutely terrifying to watch her.", "We know there are fleas where we walk but I laugh as they attempt to jump on my dogs which like little death ninjas have but to secrete this oil and BAM THEY DIE LIKE THE VERMIN"]}, "88": {"words": ["company", "service", "customer", "sent", "amazon", "return", "received", "product", "called", "ordered"], "weight": 0.037008885114703224, "sentences": ["customer service there.", "Still awaiting refund!", "No response from the company as of yet."]}, "23": {"words": ["price", "amazon", "shipping", "cost", "buy", "free", "store", "pet", "cheaper", "pay"], "weight": 0.026911052802988958, "sentences": ["Amazon also had the cheapest price plus free shipping.", "Amazon had the lowest price and free shipping.", "You can't beat prime shipping either."]}}

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
    url: "http://grantcuster.com/crux/php/amazon.php?product_id=B00008DFGY",
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