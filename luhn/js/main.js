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

$(document).ready(function() {

  // Adapted from http://jsfiddle.net/FutureWebDev/HfS7e/
  function findStopword(stopword) {
    var text = stopword;
    var query = new RegExp("(\\b" + text + "\\b)", "gim");
    var e = document.getElementById("searchtext").innerHTML;
    var newe = e.replace(query, "<span style=''>$1</span>");
    document.getElementById("searchtext").innerHTML = newe;
  }

  for (var i=0; i<stopwords.length; i++) {
    var stopword = stopwords[i];
    findStopword(stopword);
  }

  function compare(a,b) {
    if (a.count < b.count)
      return -1;
    else if (a.count > b.count)
      return 1;
    else
      return 0;
  }


  function getWordlist() {

    var search_text = $('#searchtext').text();
    search_text = search_text.toLowerCase();
    var words = search_text.split(" ");
    words = words.map(function(word) {
      word.toLowerCase();
      word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\'\"\↵]/g,"");
      var stopword_check = stopwords.indexOf(word);
      if (word.match(/[a-z]/i) && stopword_check === -1) {
        return word;
      } else {
        return '';
      }
    });
    var word_array = [];
    var word_multiples_array_ref = [];
    var word_multiples = [];
    $.each(words, function(i,word) {
      if (word.length > 0) {
        var index_check = word_array.indexOf(word);
        if (index_check > -1) {
          var ref_check = word_multiples_array_ref.indexOf(word)
          if (ref_check > -1) {
            console.log(ref_check);
            var word_obj = word_multiples[ref_check];
            word_obj.count++;
          } else {
            word_multiples_array_ref.push(word);
            var word_object = {"word": word, count: 2};
            word_multiples.push(word_object);
          }
        } else {
          word_array.push(word);
        }
      }
    });

    word_multiples.sort(compare);
    word_multiples.reverse();

    var $body = $('body');
    var $wordlist = $('<div id="wordlist" class="container mb2"></div>');
    $body.append($wordlist);

    $wordlist.append('<h2>Most Important Words</h2>');

    $.each(word_multiples, function(i, word_obj) {
      $wordlist.append('<div>' + word_obj.word + ': ' + word_obj.count + '</div>');
    });

    function getSentences(text) {
      var search_text = $('#searchtext').text();
      var result = search_text.match( /[^\.!\?]+[\.!\?]+/g );
      return result;
    }

    var result = getSentences();

    var matched_sentences_ref = [];
    var matched_sentences = [];

    $.each(word_multiples, function(i, word_obj) {
      $.each(result, function(i, sentence) {
        var lowercase_sentence = sentence.toLowerCase();
        var match_check = lowercase_sentence.match(word_obj.word);
        if (match_check !== null) {
          var already_matched_check = matched_sentences_ref.indexOf(sentence);
          if (already_matched_check > -1) {
            var matched_obj = matched_sentences[already_matched_check];
            matched_obj.count++;
            matched_obj.matches.push(word_obj);
          } else {
            matched_sentences_ref.push(sentence);
            matched_sentences.push({"sentence": sentence, "count": 1, matches: [word_obj]});
          }
        }
      });
    });

    matched_sentences.sort(compare).reverse();

    var $sentencelist = $('<div id="sentencelist" class="container mb2 border-bottom"></div>');
    $wordlist.before($sentencelist);
    $sentencelist.append('<h2>Matched Sentences</h2>');

    $.each(matched_sentences, function(i, match) {
      if (i < 5) {
        var html = '<div class="mb2">';
        html += '<div>';
        html += match.sentence;
        html += '</div>';
        html += '<div>';
        html += '<span class="bold">Matches:</span> ';
        html += ' ' + match.count + ' &ndash; ';
        $.each(match.matches, function(i, word_obj) {
          html += word_obj.word;
          if (i < match.matches.length - 1) html += ', ';
        });
        html += '</div>';
        html += '</div>';
        $sentencelist.append(html);
      }
    });

  }

  getWordlist();

});