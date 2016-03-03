// Stopword list from http://www.ranks.nl/stopwords

var stopwords = [
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves"
]

var $body = $('body');
var $searchtext = $('#searchtext');
var husl = $.husl;

function compare(b,a) {
  if (a.count < b.count)
    return -1;
  else if (a.count > b.count)
    return 1;
  else
    return 0;
}

function indexCompare(a,b) {
  if (a.index < b.index)
    return -1;
  else if (a.index > b.index)
    return 1;
  else
    return 0;
}

function getSentences($container) {
  var search_text = $container.text();
  var result = search_text.match( /[^\.!\?]+[\.!\?]+/g );
  return result;
};

var sentences = getSentences($searchtext);

function spanSentences() {
  var $paragraphs = $searchtext.children('p');
  $.each($paragraphs, function(i, paragraph) {
    var $paragraph = $(paragraph);
    var paragraph_sentences = getSentences($paragraph);
    var sentenced_text = ""
    $.each(paragraph_sentences, function(i, sentence) {
      var html = ' ';
      if (i == 0) {
        html += '';
      }
      html += '<span class="sentence">';
      html += sentence.trim();
      html += '</span>';
      sentenced_text += html;
    });
    $paragraph.html(sentenced_text);
  });
}

spanSentences();

// Adapted from http://jsfiddle.net/FutureWebDev/HfS7e/
function spanWord(word, span_class) {
  var text = word;
  var query = new RegExp("(\\b" + text + "\\b)", "gim");
  var e = document.getElementById("searchtext").innerHTML;
  var newe = e.replace(query, '<span class="' + span_class + '">$1</span>');
  document.getElementById("searchtext").innerHTML = newe;
}

function spanWordColor(word, container_id, hex) {
  var text = word;
  var query = new RegExp("(\\b" + text + "\\b)", "gim");
  var e = document.getElementById(container_id).innerHTML;
  var newe = e.replace(query, '<span class="bg-colored" style="background: ' + hex + '">$1</span>');
  document.getElementById(container_id).innerHTML = newe;
}

$.each(stopwords, function(i, stopword) {
  spanWord(stopword, "stopword");
});

function getWords() {
  var search_text = $searchtext.text();
  var words = search_text.split(" ");
  words = words.filter(function(word) {
    var stopword_check = stopwords.indexOf(word.toLowerCase());
    // filter out blanks and non alphabetical words
    if (word.match(/[a-z]/i) && stopword_check === -1) {
      return true;
    } else {
      return false;
    }
  });
  words = words.map(function(word) {
    // replace punctuation and get rid of whitespace and newlines
    word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\'\"]/g,"").trim();
    return word;
  });

  // Now we have a pretty cleaned up list of the words
  var words_ref_array = [];
  var matched_ref_array = [];
  var matched_array = [];
  $.each(words, function(i, word) {
    var base_word = pluralize(word.toLowerCase(), 1);
    var seen_check = words_ref_array.indexOf(base_word);
    if (seen_check > -1) {
      var matched_check = matched_ref_array.indexOf(base_word);
      if (matched_check > -1) {
        var word_obj = matched_array[matched_check];
        word_obj.count++;
        if (word_obj.display_words.indexOf(word) == -1) {
          word_obj.display_words.push(word);
        }
      } else {
        var word_obj = {};
        word_obj.base_word = base_word;
        word_obj.count = 2;
        word_obj.display_words = [word];
        matched_ref_array.push(base_word);
        matched_array.push(word_obj);
      }
    } else {
      words_ref_array.push(base_word)
    }
  });

  var $wordlist = $('<div id="wordlist" class="px2"></div>');
  $wordlist.append('<h3>Top Words</h3>')
  $body.append($wordlist);

  matched_array = matched_array.sort(compare);
  return matched_array;
}

function displayTopWords(matched_words) {
  var top_num = 5;
  $.each(matched_words, function(i, word_obj) {
    var bg_color_style = "";
    if (i < top_num) {
      var hue_step = 360/(top_num);
      var hue = hue_step * i;
      var hex = husl.toHex(hue, 100, 70);
      bg_color_style = "background: " + hex + '; ';

      $.each(word_obj.display_words, function(i, display_word) {
        spanWordColor(display_word, "searchtext", hex);
      });

    }
    var html = '<div class="clearfix bg-gray px2" style="margin-bottom: 2px; ' + bg_color_style + '">'
    html += '<div class="left">';
    html += word_obj.base_word;
    html += '</div>';
    html += '<div class="right">';
    html += word_obj.count;
    html += '</div>';
    html += '</div>';
    $('#wordlist').append(html);
  });

}

var matched_words = getWords();
displayTopWords(matched_words)

function matchSentences() {
  var sentence_matches = [];
  $.each(sentences, function(i, sentence) {
    var sentence_obj = {};
    sentence_obj.index = i;
    sentence_obj.sentence = sentence;
    sentence_obj.count = 0;
    sentence_obj.matches = [];
    var lowercased = sentence.toLowerCase();
    $.each(matched_words, function(i, word_obj) {
      if (i < 5) {
        $.each(word_obj.display_words, function(i, display_word) {
          var checker = new RegExp(display_word,"gi");
          var match_check = lowercased.match(checker);
          if (match_check !== null) {
            sentence_obj.count = sentence_obj.count + match_check.length;
            sentence_obj.matches.push(word_obj.base_word);
            return false;
          }
        });
      }
    });
    sentence_matches.push(sentence_obj);
  });

  sentence_matches.sort(compare);

  var $sentences = $('.sentence');
  $.each(sentence_matches, function(i, sentence_obj) {
    var $sentence = $sentences.eq(sentence_obj.index);
    $sentence.attr('title', 'Score: ' + sentence_obj.count);
    if (i < 5) {
      $sentence.addClass('top_5');
    }
  });

  var top_5 = sentence_matches.slice(0,5);
  top_5.sort(indexCompare);
  var $summary = $('<div id="summary" class="mb3"></div>');
  $searchtext.after($summary);
  $summary.append('<h2>Summary</h2>');
  $.each(top_5, function(i, sentence_obj) {
    var html = '';
    if (i != 0) {
      html += ' ';
    }
    html += '<div class="mb1">';
    html += '<span class="summary-sentence summary-highlight">';
    html += sentence_obj.sentence.trim();
    html += '</span>';
    html += '<span class="gray italic h5">';
    html += '&nbsp; (Score: ' + sentence_obj.count + ')';
    html += '</span>';
    html += '</div>';
    $summary.append(html);
  });

  // TODO: this is duplicating
  var top_num = 5;
  $.each(matched_words, function(i, word_obj) {
    var bg_color_style = "";
    if (i < top_num) {
      var hue_step = 360/(top_num);
      var hue = hue_step * i;
      var hex = husl.toHex(hue, 100, 70);
      bg_color_style = "background: " + hex + '; ';
      $.each(word_obj.display_words, function(i, display_word) {
        spanWordColor(display_word, "summary", hex);
      });
    }
  });
}

matchSentences();