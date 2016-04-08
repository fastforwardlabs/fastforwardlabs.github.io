var data = {"66": {"words": ["old", "year", "product", "vet", "years", "pain", "dog", "arthritis", "joint", "difference"], "weight": 0.30011983917559615, "sentences": ["No limping and full of energy.", "My dog has been diagnosed with arthritis of the elbow since he was 5.", "The vet has even stopped his carpofen because he is doing so well on the duralactin."]}, "23": {"words": ["price", "amazon", "shipping", "cost", "buy", "free", "store", "pet", "cheaper", "pay"], "weight": 0.06485854526022572, "sentences": ["I searched for better prices on the net--and found this supplier.", "I get the best price purchasing the two pack.", "Amazon's prices are much cheaper than the vet's prices and comparable to Dr.s Smith/Foster where we used to get it plus you can buy in bulk thru Amazon where the others I have only found the smaller bottles which makes it slightly cheaper even with the shipping."]}, "79": {"words": ["fast", "product", "arrived", "quickly", "great", "shipping", "price", "order", "delivery", "good"], "weight": 0.06371756711884742, "sentences": ["Product arrived in a timely manner.", "Shipping was quick and order secure.", "When needed I will be placing another order for it."]}, "1": {"words": ["products", "product", "pet", "company", "china", "pets", "read", "information", "review", "website"], "weight": 0.04086982693301319, "sentences": ["Who do I contact for information on plans like these", "Since then, we've moved from a small town into a major urban area, and all things veterinary seem to have gone up in cost accordingly, so it's great to find a realiable, cost-effective source through Amazon.", "Duralactin cannot be purchased here in Australia."]}, "63": {"words": ["vet", "life", "years", "results", "did", "said", "months", "year", "ago", "old"], "weight": 0.03634042693388521, "sentences": ["Concerned about the potential for organ damage with canine nsaids, we were thrilled when our vet introduced us to Duralactin supplement for our aging Huskies.", "At our annual vet visit 3 months ago, she suggested we add Duralactin every day and we have seen him maintain his activity level.", "I would have started using much earlier if I had known the great results."]}, "52": {"words": ["don", "time", "know", "ve", "want", "make", "think", "ll", "say", "things"], "weight": 0.030808102409321397, "sentences": ["My two labradors have problems with crucial ligaments.", "I didn't want to keep giving her Rimadyl, as this is what prescribed by vet on a temporary basis.", "I've recommended this product to severial other people."]}, "36": {"words": ["food", "eat", "cat", "eating", "eats", "dog", "pill", "day", "taste", "bowl"], "weight": 0.028690780584894663, "sentences": ["We just crush the tablet into there food to give them their recommended dosage.", "I have tried many different ways to administer these, andno way.", "My dogs absolutely refuse to take these tablets."]}, "67": {"words": ["german", "dog", "shepherd", "dogs", "mix", "great", "large", "old", "like", "bought"], "weight": 0.027238625746806272, "sentences": ["old german shepherd has been this supplement for over a year, and has really helped with her elbow dysplasia issues.", "This product is a must for our giant breed dog who has some joint issues, as long as we have him on his supplements he does great and this is a very important one for him!", "I've used this product before with my shepherd years ago so I knew it worked."]}}

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
  html += '<div class="words bold mb1">';
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
    url: "http://grantcuster.com/crux/php/amazon.php?product_id=B00076KP8E",
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