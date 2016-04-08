var data = {"83": {"words": ["weight", "lost", "loss", "lose", "pounds", "appetite", "product", "diet", "taking", "eat"], "weight": 0.387822031028334, "sentences": ["It has to be the Garcinia Cambogia.", "This is not what I have found for Garcinia Cambogia.", "Garcinia Cambogia"]}, "30": {"words": ["product", "difference", "using", "results", "noticed", "weeks", "taking", "ve", "month", "notice"], "weight": 0.07414548321467718, "sentences": ["It has been a month so far and I have noticed no change, no difference.", "Well i am 1 month in of using this product along with Nature Wise Green Coffee Bean and have not noticed any difference.", "I have been taking and have noticed a reduction in backfat."]}, "56": {"words": ["company", "customer", "service", "product", "sent", "amazon", "return", "received", "order", "called"], "weight": 0.04768848596836772, "sentences": ["Customer representative", "so I contacted them.", "Customer service is very responsive to my questions."]}, "0": {"words": ["day", "pills", "taking", "feel", "pill", "stomach", "vitamins", "took", "don", "morning"], "weight": 0.04714839006820157, "sentences": ["I eased into the full dosage from 3 pills a day (Breakfast, Lunch, and Dinner) to 9 pills a day (Breakfast, Lunch, and Dinner).", "I have been taking 2 pills in the morning, 2 before lunch and 3 before supper.", "I started by taking one pill 3x/day and increased to three pills 3x/day."]}, "80": {"words": ["day", "days", "minutes", "week", "time", "10", "30", "hours", "update", "just"], "weight": 0.029238095812636287, "sentences": ["17th.", "I started to take this in Jan.03.14 and It is Feb 24th.", "For an hour and 10 minutes, soon to 1 hour and 30 minutes."]}, "14": {"words": ["reviews", "try", "decided", "did", "read", "thought", "reading", "glad", "didn", "say"], "weight": 0.021972587911335332, "sentences": ["I read the many rave reviews and thought I'd at least give it a shot.", "I read the reviews and decided to give it a try.", "did my research and read the reviews and decided to give it a try."]}, "19": {"words": ["taking", "help", "effects", "product", "feel", "doctor", "supplement", "effect", "anxiety", "stress"], "weight": 0.019381490042730584, "sentences": ["I have a seizure disorder", "It has reduced my stress, calmed my nerves and improved my mood.", "I was diagnosed with hypothyroidism."]}, "20": {"words": ["just", "ve", "like", "don", "really", "think", "pretty", "ll", "thing", "little"], "weight": 0.018434072237465484, "sentences": ["It isn't about being lazy.", "I have to say, I'm pretty skeptical of these sort of things.", "Not sure why that happened, but I don't think I'll be giving these pills another shot."]}}

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
    url: "http://grantcuster.com/crux/php/amazon.php?product_id=B00B5H5BGA",
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