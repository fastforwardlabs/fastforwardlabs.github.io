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

// From http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
function extractDomain(url) {
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }
  //find & remove port number
  domain = domain.split(':')[0];
  domain = domain.replace('www.','');
  return domain;
}

// Tree Walker from http://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function compareIndex(a,b) {
  if (a.index < b.index)
    return -1;
  if (a.index > b.index)
    return 1;
  return 0;
}

function compareScore(b,a) {
  if (a.score < b.score)
    return -1;
  if (a.score > b.score)
    return 1;
  return 0;
}

function findByUrl(source, url) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].url === url) {
      return source[i];
    }
  }
}

function findIndexByUrl(source, url) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].url === url) {
      return i;
    }
  }
  throw 'error';
}

// From http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function ordinal_suffix_of(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function stripTrailingSlash(str) {
  if(str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
  }
  return str;
}

function bareRender(template_string) {
  var html = $(template_string).html();
  return html;
}

function render(template_string, context) {
  var source = $(template_string).html();
  var template = Handlebars.compile(source);
  var html = template(context);
  return html;
}

function getHistoryList(current_url) {
  var category_counter = 0;
  var category_length = public_articles.length;
  function _getHistoryCategory(category_counter) {
    var counter = 0;
    var category_obj = public_articles[category_counter];

    var category_articles = category_obj.articles;
    var $link_holder = $('#link-holder');
    $link_holder.append('<div class="time-string relative; px2 h5 sans-serif py1" style="color: #444; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.8rem; background: #fafafa;">' + category_obj.name + '</div>');
    var category_articles_length = category_articles.length;
    function _getHistoryLink(counter) {
      var public_article = category_articles[counter];
      var public_article_url = 'public/article_json/' + public_article + '.json';
      var public_article_highlights_url = 'public/highlight_json/' + public_article + '_highlights.json';
      $.ajax({
        url: public_article_highlights_url,
        type: 'GET',
        success: function(highlight_json) {
          $.ajax({
            url: public_article_url,
            type: 'GET',
            success: function(article_json) {

              var optional_class = '';
              if (current_url == public_article) {
                optional_class = 'active';
              }

              var link_obj = {};
              link_obj.title = article_json.title;
              link_obj.first_sentence = highlight_json.scored_article_sentences[0].sent;
              link_obj.domain = extractDomain(article_json.url);
              link_obj.inner_link = '?url=' + public_article;
              link_obj.url = article_json.url;
              link_obj.optional_class = optional_class;
              var html = render('#article-link-template', link_obj);
              $link_holder.append(html);

              counter++;
              if (counter < category_articles.length) {
                _getHistoryLink(counter);
              } else {
                category_counter++;
                if (category_counter < category_length) {
                  _getHistoryCategory(category_counter);
                }
              }
            }
          })
        }
      });
    };
    _getHistoryLink(0);
  };
  _getHistoryCategory(0);
}

var params = getSearchParameters();

var hostname = 'http://tlllldddrr.ngrok.com';

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

var url = false;
if (params.url !== undefined) url = decodeURIComponent(params.url);

// default model
var model_global = 'c22a5bzd';
if (params.model !== undefined) model_global = params.model;

var $body = $('body');
var $content = $('#content');
var sidebar_built = false;

var culture_articles = {
  name: "Culture", 
  articles: ['the-hunt-for-el-chapo', 'the-secret-lives-of-tumblr-teens', 'dune-cant-capture', 'unfollow'] 
};
var tech_articles = {
  name: "Tech", 
  articles: ['google-ai','spreadsheet', 'watchmaker', 'railroad'] 
};
var science_articles = {
  name: 'Science',
  articles: ['lovelace','science-beautiful','pacific','sleep']
}

var public_articles = [culture_articles, tech_articles, science_articles];

if (!url) {

  $body.addClass('no-url');

  var html = bareRender("#header-template");
  $content.append(html);

  var html = bareRender('#form-template');
  $content.append(html);

  var html = bareRender('#history-header-template');
  $content.append(html);

  var html = bareRender('#article-link-holder-template');
  $content.append(html);

  var html = getHistoryList(false);

  var html = bareRender('#footer-template');
  $body.append(html);

} else {

  $body.addClass('highlight-mode');

  var html = bareRender('#header-bar');
  $content.append(html);

  var public_article_url = "public/article_json/" +  url + ".json"

  function getArticle(url) {

    function _getArticle(article_json) {
      article_json.domain = (extractDomain(url)).replace('www','');
      article_json.minute_count = Math.floor(article_json.words/250);
      displaySidebar(article_json, url)
      displayArticle(article_json, url);
      getHighlights(article_json);
    }

    $.ajax({
        url: public_article_url,
        type: 'GET',
        success: function(article_json){ 
          $content.html('');
          _getArticle(article_json);
        },
        error: function(data) {
          alert('There has been an error. Please try reloading the page.');
          console.log(data);
        }
    });

    var article_storage_name = url + '_article';
    var article = localStorage.getItem(article_storage_name);
    if (article !== null) {
      var article_json = JSON.parse(article);
      _getArticle(article_json);
    }
  }

  function displaySidebar(readable_article_json, url) {
    var html = render('#sidebar-shell', readable_article_json);
    var $sidebar_shell = $(html);
    $content.append($sidebar_shell);

    var $toggle_sidebar = $('#toggle-sidebar');
    $toggle_sidebar.click(function() {
      $body.toggleClass('hide-sidebar');
    });

    $('#menu-opener').click(function() {
      $body.addClass('show-menu');
      var $this = $(this);

      var html = bareRender('#menu-template');
      $content.append(html);

      var $menu = $('#menu');

      var html = bareRender('#article-link-holder-template');
      $menu.append(html);

      var html = getHistoryList(url);

      var $model_select = $('#model-select');
      var $change_button = $('#change-model');
      $model_select.change(function() {
        var new_model = $(this).val();
        if (new_model == model_global) {
          $change_button.addClass('disabled');
        } else {
          $change_button.removeClass('disabled');
        }
      });

      var $history_editor = $('#history-editor');
      $history_editor.click(function() {
        var $this = $(this);
        if ($this.hasClass('editing')) {
          $this.removeClass('editing');
          $('.article-link').each(function() {
            $(this).removeClass('editing').find('.article-link-deleter').remove();
          });
        } else {
          $this.addClass('editing');
          $('.article-link').each(function() {
            var html = bareRender('#link-trasher');
            $(this).addClass('editing').append(html);
          });
          $('.article-link-deleter').click(function() {
            var $this = $(this);
            var article_url = $this.parent().attr('data-url');
            deleteArticle(article_url);
            $this.parent().remove();
            return false;
          });
        }
      });

      $change_button.click(function() {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
          return false;
        } else {
          var new_url = window.location.origin + window.location.pathname + '?url=' + url + '&model=' + $model_select.val();
          window.location.href = new_url;
        }
      });


      $('.article-link.active').click(function() {
        return false;
      });

      $('#menu').click(function(e) {
        e.stopPropagation();
      });

      $('#menu-closer').click(function() {
        $body.removeClass('show-menu');
        $menu.remove();
        $('#overlay').remove();
      });

      $('#overlay').click(function() {
        $body.removeClass('show-menu');
        $menu.remove();
        $('#overlay').remove();
      });
    });
  }

  function getHighlights(article_json) {

    var public_article_highlights_url = 'public/highlight_json/' + url + '_highlights.json';

    function _getHighlights() {
      $.ajax({
        url: public_article_highlights_url,
        type: 'GET',
        success: function(highlight_json) {
          applyHighlights(highlight_json);
        }
      });
    };

    var summary_storage_name = url + '_summary';
    var article_highlights = localStorage.getItem(summary_storage_name);

    if (article_highlights !== null) {
      var highlight_json = JSON.parse(article_highlights);
    } else {
      _getHighlights();
    }
  }

  function displayHighlights(highlight_json) {
    var highlights = highlight_json.scored_article_sentences.slice();
    highlights.sort(compareScore);
    var top_sentences = highlights.slice(0,5);
    top_sentences.sort(compareIndex);
    $article_holder = $('#article-holder');
    var article_offset = $article_holder.offset().top;
    var article_height = $article_holder.height();
    $.each(top_sentences, function(i, sentence) {
      var $first_in_text = $('.article-highlight-' + sentence.index).first();
      var first_offset = $first_in_text.offset().top;
      var scroll = Math.round(((first_offset - article_offset)/article_height) * 100);
      sentence.adjusted_score = Math.round(sentence.score * 100);
      sentence.scroll = scroll
    });
    var context = {sentences: top_sentences};
    var html = render('#sidebar-highlights', context);
    var $sidebar_content = $('#sidebar-content');
    $sidebar_content.html(html);

    $sidebar_content.on('mouseenter', '.highlight-link', function() {
      var highlight_target = '.article-' + $(this).attr('data-link');
      var $target = $(highlight_target);
      $target.addClass('active');
    });

    $sidebar_content.on('mouseleave', '.highlight-link', function() {
      $('.article-highlight').removeClass('active');
    });

    $sidebar_content.on('click', '.highlight-link', function() {
      var $this = $(this);
      var article_highlight_target = '.article-' + $this.attr('data-link');
      var scroll_target = $(article_highlight_target).first().offset().top;
      $('html,body').animate({
        scrollTop: scroll_target - 80
      }, 200);
    });
  }

  function displayArticle(readable_article_json, url) {
    document.title = 'Brief: ' + readable_article_json.title;

    readable_article_json.domain = extractDomain(readable_article_json.url);
    var html = render('#readable-article-template', readable_article_json);
    $content.append(html);

    var html = bareRender('#footer-template');
    $body.append(html);

    $body.addClass('loading-highlights');

    $('#article-toggle').on('click', '.toggle-button', function() {
      var $this = $(this);
      var mode = $this.attr('data-mode');
      $body.removeClass('skim-mode highlight-mode');
      $body.addClass(mode + '-mode');
    });
  }

  getArticle(url);

}

// Highlighting the article (kind of messy)

function setHighlightClass(span_node, highlight_obj) {
  var highlight_index = highlight_obj.index;
  var full_class = 'article-highlight article-highlight-' + highlight_index + ' group_' + highlight_obj.group_num;
  span_node.className = full_class;
}

var alerted = false;
function highlightSentence(highlight_obj, article_content) {
  try {
    var text_nodes = textNodesUnder(article_content);
    var character_count = 0;
    $.each(text_nodes, function(i, text_node) {
      var node_length = text_node.length;
      character_count += node_length;
      if (character_count > highlight_obj.begin) {
        var match_length = highlight_obj.end - highlight_obj.begin;
        var node_begin = highlight_obj.begin - (character_count - node_length);
        var span_node = document.createElement('span');
        var score = highlight_obj.score;
        span_node.setAttribute('data-score', score);
        span_node.setAttribute('debug-sent', highlight_obj.sent);
        span_node.setAttribute('debug-begin', highlight_obj.begin);
        span_node.setAttribute('debug-end', highlight_obj.end);
        // span_node.setAttribute('title', Math.round(score * 100) + '%');
        setHighlightClass(span_node, highlight_obj);
        if (match_length + node_begin >= node_length) {
          var first_clip = text_node.splitText(node_begin);
          var end_clip = first_clip.splitText(node_length - node_begin);
          var clip_clone = first_clip.cloneNode(true);
          span_node.appendChild(clip_clone);
          first_clip.parentNode.replaceChild(span_node, first_clip);
          var next_obj = {};
          next_obj.index = highlight_obj.index;
          next_obj.score = highlight_obj.score;
          next_obj.sent = highlight_obj.sent;
          // next_obj.adjusted_score = highlight_obj.adjusted_score;
          next_obj.group_num = highlight_obj.group_num;
          next_obj.begin = highlight_obj.begin + (node_length - node_begin);
          next_obj.end = highlight_obj.end;
          highlightSentence(next_obj, article_content);
        } else {
          var first_clip = text_node.splitText(node_begin);
          var end_clip = first_clip.splitText(match_length);
          var clip_clone = first_clip.cloneNode(true);
          span_node.appendChild(clip_clone);
          first_clip.parentNode.replaceChild(span_node, first_clip);
        }
        return false;
      }
    });
  }
  catch(e) {
    if (!alerted) {
      alert("There was an error parsing this article. We'll do our best to still display the highlights but they may not be quite right for this one.")
      alerted = true;
    }
  }
}

function applyHighlights(highlight_json) {
  $body.removeClass('loading-highlights');

  var dmp = new diff_match_patch();
  dmp.Match_Distance = 1000;
  dmp.Match_Threshold = 0.6;

  article_content = $('#article-content').get(0);
  var text = article_content.textContent;
  var reversed_text = esrever.reverse(text);
  var sentence_objs = highlight_json.scored_article_sentences;
  normalizeScores(sentence_objs);
  sentence_objs.sort(compareIndex);
  var text_nodes = textNodesUnder(article_content);

  function firstGuess() {
    var offset_count = 0;
    var first_guess = 0;
    var trackback = 0;
    $.each(sentence_objs, function(i, sentence_obj) {
      var sentence_length = sentence_obj.sent.length;
      if (sentence_length > 32) {
        var found = false;
        var character_count = 0;
        var pat = sentence_obj.sent.toUpperCase();
        $.each(text_nodes, function(i, text_node) {
          var character_length = text_node.length;
          var index_check = text_node.data.toUpperCase().indexOf(pat)
          if (index_check > -1) {
            found = true;
            first_guess = character_count - offset_count;
            return false;
          } else {
            character_count += character_length;
          }
        });
      }
      if (found) {
        return false;
      } else {
        trackback += sentence_length;
        offset_count += sentence_length;
      }
    });
    first_guess = first_guess - trackback;
    if (first_guess < 0) first_guess = 0;
    return first_guess;
  }

  var position_guess = firstGuess();
  // position_guess = 0;
  var begins_array = [];
  $.each(sentence_objs, function(i, sentence_obj) {
    var sentence = sentence_obj.sent;
    var sentence_length = sentence.length;
    var sentence_start = sentence.substr(0,32);
    var begin = dmp.match_main(text, sentence_start, position_guess);
    if (begin > -1) {
      var end_guess = begin + sentence_length;
      position_guess = end_guess;
    } else {
      // Not found
      begin = position_guess;
    }
    begins_array.push(begin);
  });

  var sentence_objs_reversed = sentence_objs.slice().reverse();
  var text_nodes_reversed = text_nodes.slice().reverse();

  function lastGuess() {
    var offset_count = 0;
    var last_guess = 0;
    var trackback = 0;
    $.each(sentence_objs_reversed, function(i, sentence_obj) {
      var sentence_length = sentence_obj.sent.length;
      if (sentence_length > 32) {
        var found = false;
        var character_count = 0;
        var pat = esrever.reverse(sentence_obj.sent).toUpperCase();
        $.each(text_nodes_reversed, function(i, text_node) {
          var character_length = text_node.length;
          var index_check = esrever.reverse(text_node.data.toUpperCase()).indexOf(pat)
          if (index_check > -1) {
            found = true;
            last_guess = character_count - offset_count;
            return false;
          } else {
            character_count += character_length;
          }
        });
      } else {
        trackback += sentence_obj.sent.length;
      }
      if (found) {
        return false;
      } else {
        trackback += sentence_length;
        offset_count += sentence_length;
      }
    });
    last_guess = last_guess - trackback;
    if (last_guess < 0) last_guess = 0;
    return last_guess;
  }

  var end_position_guess = lastGuess();
  var ends_array = [];
  $.each(sentence_objs_reversed, function(i, sentence_obj) {
    var sentence = esrever.reverse(sentence_obj.sent);
    var sentence_length = sentence.length;
    var sentence_end = sentence.substr(0,32);
    var end = dmp.match_main(reversed_text, sentence_end, end_position_guess);
    if (end > -1) {
      var begin_guess = end + sentence_length;
      end_position_guess = begin_guess;
    } else {
      end = end_position_guess;
    }
    var end_unreversed = text.length - end;
    ends_array.push(end_unreversed);
  });
  ends_array = ends_array.reverse();

  $.each(sentence_objs, function(i, sentence_obj) {
    sentence_obj.begin = begins_array[i];
    sentence_obj.end = ends_array[i];
    highlightSentence(sentence_obj, article_content)
  });

  displayHighlights(highlight_json);

}

function normalizeScores(sentence_objs) {

  var group_0_array = [];
  var group_0_length = 0;
  var group_1_array = [];
  var group_1_length = 0;

  // Changing to get a certain number of highlights
  var top_group_num = 5;
  var second_group_num = Math.max(10,Math.floor(sentence_objs.length * 0.15));
  $.each(sentence_objs, function(i, sentence_obj) {
    if (i < top_group_num) {
      sentence_obj.group_num = 0;
      group_0_array.push(sentence_obj);
    } else if (i < second_group_num) {
      sentence_obj.group_num = 1;
      group_1_array.push(sentence_obj);
    } else {
      sentence_obj.group_num = 2;
    }
  });

  $.each(group_0_array, function() { group_0_length += this.sent.length });
  $.each(group_1_array, function() { group_1_length += this.sent.length });
}

