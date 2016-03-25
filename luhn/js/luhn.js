// Stopword list from http://www.ranks.nl/stopwords
var stopwords = [
  "a", "about", "above", "across", "after", "afterwards", "again", "against",
  "all", "almost", "alone", "along", "already", "also", "although", "always",
  "am", "among", "amongst", "amoungst", "amount", "an", "and", "another",
  "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are",
  "around", "as", "at", "back", "be", "became", "because", "become",
  "becomes", "becoming", "been", "before", "beforehand", "behind", "being",
  "below", "beside", "besides", "between", "beyond", "bill", "both",
  "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con",
  "could", "couldnt", "cry", "de", "describe", "detail", "do", "done",
  "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else",
  "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone",
  "everything", "everywhere", "except", "few", "fifteen", "fifty", "fill",
  "find", "fire", "first", "five", "for", "former", "formerly", "forty",
  "found", "four", "from", "front", "full", "further", "get", "give", "go",
  "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter",
  "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his",
  "how", "however", "hundred", "i", "ie", "if", "in", "inc", "indeed",
  "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter",
  "latterly", "least", "less", "ltd", "made", "many", "may", "me",
  "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly",
  "move", "much", "must", "my", "myself", "name", "namely", "neither",
  "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone",
  "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on",
  "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our",
  "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps",
  "please", "put", "rather", "re", "same", "see", "seem", "seemed",
  "seeming", "seems", "serious", "several", "she", "should", "show", "side",
  "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone",
  "something", "sometime", "sometimes", "somewhere", "still", "such",
  "system", "take", "ten", "than", "that", "the", "their", "them",
  "themselves", "then", "thence", "there", "thereafter", "thereby",
  "therefore", "therein", "thereupon", "these", "they", "thick", "thin",
  "third", "this", "those", "though", "three", "through", "throughout",
  "thru", "thus", "to", "together", "too", "top", "toward", "towards",
  "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us",
  "very", "via", "was", "we", "well", "were", "what", "whatever", "when",
  "whence", "whenever", "where", "whereafter", "whereas", "whereby",
  "wherein", "whereupon", "wherever", "whether", "which", "while", "whither",
  "who", "whoever", "whole", "whom", "whose", "why", "will", "with",
  "within", "without", "would", "yet", "you", "your", "yours", "yourself",
  "yourselves"
]

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

// Adapted from http://jsfiddle.net/FutureWebDev/HfS7e/
function spanWord(word, span_class, target_id) {
  var text = word;
  var query = new RegExp("(\\b" + text + "\\b)", "gim");
  var e = document.getElementById(target_id).innerHTML;
  var newe = e.replace(query, '<span class="' + span_class + '">$1</span>');
  document.getElementById(target_id).innerHTML = newe;
}

function spanWordColor(word, hex, target_id) {
  var text = word;
  var query = new RegExp("(\\b" + text + "\\b)", "gim");
  var e = document.getElementById(target_id).innerHTML;
  var newe = e.replace(query, '<span class="bg-colored" style="background: ' + hex + '">$1</span>');
  document.getElementById(target_id).innerHTML = newe;
}

function setEditable(state) {
  if (state) {
    $demo_text.addClass('editable').attr('contenteditable',true);
  } else {
    $demo_text.removeClass('editable').attr('contenteditable',false);
  }
}

function clear() {
  $('#clear-button').remove();
  stripFormatting();
  $('#wordlist').remove();
  stepRender(0);
};

function addClear() {
  var $clear_button = $('<btn id="clear-button" class="btn left" style="">Clear</btn>');
  $step_button.before($clear_button);
  $clear_button.click(function() {
    clear();
  });
}

function textWithoutFormatting() {
  var $paragraphs = $demo_text.find('p');
  var text = "";
  $paragraphs.each(function(i, paragraph) {
    text += '<p>' + $(paragraph).text() + '</p>';
  });
  return text;
}

function stripFormatting() {
  var text = textWithoutFormatting();
  $demo_text.html(text);
}

function spanSentences() {
  var $paragraphs = $demo_text.find('p');
  $.each($paragraphs, function(i, paragraph) {
    var $paragraph = $(paragraph);
    var paragraph_sentences = getSentences($paragraph);
    if (paragraph_sentences !== null) {
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
    }
  });
}

var top_words = [];
function getTopWords() {
  var search_text = $demo_text.text();
  var words = search_text.split(" ");
  words = words.map(function(word) {
    // replace punctuation and get rid of whitespace and newlines
    word = word.replace(/[.,\/#!'’$%\^&\*;:{}=\-_`~()\'\"]/g,"").trim();
    return word;
  });
  words = words.filter(function(word) {
    var stopword_check = stopwords.indexOf(word.toLowerCase());
    // filter out blanks and non alphabetical words
    if (word.match(/[a-z]/i) && stopword_check === -1) {
      return true;
    } else {
      return false;
    }
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

  var $wordlist = $('<div id="wordlist" class="px2" style="padding-bottom: 1rem;"></div>');
  $wordlist.append('<h3>Top Words</h3>')
  $body.append($wordlist);

  matched_array = matched_array.sort(compare);
  top_words = matched_array;

  $.each(matched_array, function(i, word_obj) {
    var bg_color_style = "";
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

function selectTopWords() {
  var $wordlist = $('#wordlist');
  var top_four = $wordlist.children('.bg-gray').slice(0,4);
  $.each(top_four, function(i, div) {
    var top_num = top_four.length;
    var hue_step = 360/(top_num);
    var hue = hue_step * i;
    var hex = husl.toHex(hue, 100, 70);
    $(div).css('background', hex);

    var word_obj = top_words[i];
    $.each(word_obj.display_words, function(i, display_word) {
      spanWordColor(display_word, hex, "demo-text");
    });
  });
}

function getSentences($container) {
  var search_text = $container.text();
  var result = search_text.match( /[^\.!\?]+[\.!\?]+/g );
  return result;
};

function matchSentences() {
  var sentences = getSentences($demo_text);
  if (sentences == null) {
    sentences = [$demo_text.text()];
  }
  var sentence_matches = [];
  $.each(sentences, function(i, sentence) {
    var sentence_obj = {};
    sentence_obj.index = i;
    sentence_obj.sentence = sentence;
    sentence_obj.count = 0;
    sentence_obj.matches = [];
    var lowercased = sentence.toLowerCase();
    $.each(top_words, function(i, word_obj) {
      if (i < 4) {
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
    if (i < 4) {
      $sentence.addClass('top-sentence');
    }
  });

  var top_5 = sentence_matches.slice(0,4);
  top_5.sort(indexCompare);
  var $summary = $('<div id="summary" class="mb3"></div>');
  $('#wordlist').prepend($summary);
  $summary.append('<h2>Top 4 Sentences</h2>');
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
}

function shareURL() {
  var text = textWithoutFormatting();
  var encoded_text = encodeURIComponent(text);
  var origin = window.location.origin;
  origin = 'http://fastforwardlabs.com';
  var share_url = origin + window.location.pathname + '?summarized=true&text=' + encoded_text;
  share_url = encodeURIComponent(share_url);
  $.get(
    'https://api-ssl.bitly.com/v3/shorten?access_token=ab3fb15c4e03ab9cc282cad123213c416b278c05&format=txt&longUrl=' + share_url, function(link) {
      var share_box = '<div id="share-box" class="mb2"><label for="share-link">Link to this summary:</label> <input id="share-link" name="share-link" type="text" class="field" value="' + link + '" onClick="this.select();"></div>';
      var $share_box = $(share_box);
      $('#step-help').before($share_box);
  });
}

var $body = $('body');
var $demo_text = $('#demo-text');
var $step_title = $('#step-title');
var $step_help = $('#step-help');
var $step_button = $('#step-button')

var husl = $.husl;

var current_step_num = 0;
var steps = [];

function setStep(title, button, help, callback) {
  var step = {};
  step.title = title;
  step.help = help;
  step.button = button;
  step.callback = callback;
  steps.push(step);
}

// Step 1
setStep(
  "Choose Text",
  'Start Summarization',
  "Insert your own text below or use the provided sample text. Click &ldquo;Start Summarization&rdquo; above to begin analyzing the text.",
  function step1() {
    $step_button.removeClass('display-none');
    setEditable(true);
    $('#share-box').remove();
  }
);

// Step 2
setStep(
  "Ignore Stopwords",
  "Next Step",
  "First, common words (known as stopwords) are ignored.",
  function step2() {
    addClear();
    setEditable(false);
    stripFormatting();
    spanSentences();
    $.each(stopwords, function(i, stopword) {
      spanWord(stopword, "stopword", "demo-text");
    });
  }
);

// Step 3
setStep(
  "Determine Top Words",
  "Next Step",
  "The most often occuring words in the document are counted up.",
  function step3() {
    getTopWords();
  }
);

// Step 4
setStep(
  "Select Top Words",
  "Next Step",
  "A small number (in this case four) of the top words are selected to be used for scoring",
  function step4() {
    selectTopWords();
  }
);

// Step 4
setStep(
  "Select Top Sentences",
  "Share This Summary",
  "Sentences are scored according to how many of the top words they contain. The top four sentences are selected for the summary.",
  function step5() {
    $('.stopword').addClass('unblur');
    matchSentences();
  }
);

setStep(
  "Select Top Sentences",
  "Restart",
  'The text below has been summarized using H.P. Luhn&rsquo;s <a href="http://courses.ischool.berkeley.edu/i256/f06/papers/luhn58.pdf" target="_blank">&ldquo;The Automatic Creation of Literature Abstracts&rdquo; (PDF)</a>. To see the process step-by-step, click the restart button above.',
  function step5() {
    $('#step-title').html('Luhn Method Example Summary');
    $('#clear-button').addClass('display-none');
    shareURL();
    history.pushState(null, null, window.location.pathname);
    // matchSentences();
  }
);

function stepRender(step_num) {
  current_step_num = step_num;
  var step = steps[step_num];

  var title_step = "Step " + (step_num + 1) + " of " + (steps.length - 1) + ": ";
  $step_title.html(title_step + step.title);
  $step_help.html(step.help);
  $step_button.html(step.button);

  step.callback();
}

stepRender(0);

// From http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}
var params = getSearchParameters();

if (params.text !== undefined) {
  $('#demo-text').html(decodeURIComponent(params.text));
}

if (params.summarized !== undefined) {
  if (params.summarized.toLowerCase() == "true") {
    stepRender(1);
    stepRender(2);
    stepRender(3);
    stepRender(4);
    stepRender(5);
  }
}

$step_button.click(function() {
  var next = current_step_num + 1;
  if (next == steps.length) {
    clear();
    stepRender(0);
  } else {
    stepRender(next);
  }
});