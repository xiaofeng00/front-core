$(function(){
  $(document).on('click', '#colorbox .close', function() {
    $.colorbox.close();
  });

  $('#cboxOverlay').on('mousewheel DOMMouseScroll', function(event) {
    event.preventDefault();
  });

  $('#colorbox').on('mousewheel DOMMouseScroll', function(event) {
    if ($(this).hasClass('scroll')) {
      return;
    };
    event.preventDefault();
  });

  $.extend($.colorbox.settings, {
    overlayClose: false,
    transition: MANYOU.IE_HACK ? 'none' : 'elastic',
    fadeOut: MANYOU.IE_HACK ? 0 : 300,
    opacity: 0,
    current: '{current} / {total}',
    previous: '上一个',
    next: '下一个',
    close: '&#x2715;',
    xhrError: '加载内容失败！',
    imgError: '加载图片失败！',
  })

  var title_class = 'showtitle';

  $('[data-toggle="modal"]').each(function(i, element) {
    var $element = $(element);
    var config = $element.data('config');
    config = config ? $.parseJSON(config.replace(/'/g, '"')) : {};

    if ($element.attr('href')) {
      config.href = $element.attr('href');
    }

    $(this).click(function(event) {
      event.preventDefault();
      show_custom_modal(config);
    });
  });

  var modal_queue = [];

  function show_custom_modal (options) {
    var dfd = $.Deferred();
    
    modal_queue.push([dfd, options]);

    _show_custom_modal();

    return dfd.promise();
  }

  var busying = false;

  function _show_custom_modal () {
    if (busying) { return; }
    busying = true;

    var queue_data = modal_queue.shift();
    if ( ! queue_data) { return; }

    var dfd = queue_data[0];
    var options = queue_data[1];

    // 自动关闭
    if (options && options.autoclose) {
      var timeout = +options.autoclose * 1000;
      var timer;
      options.onComplete = function() {
        timer = setTimeout(function() {
          dfd.resolve();
          $.colorbox.close();
        }, timeout);
      };
      options.onCleanup = function() {
        clearTimeout(timer);
      };
      delete options.autoclose;
    }

    if (options && options.title) {
      var className = options.className || '';
      options.className = className  ? className + ' ' + title_class : title_class;
    }

    var confirm = $.proxy(options.confirm || function (deferred) {
      deferred.resolve();
    }, dfd, dfd);

    delete options.confirm;

    function bind () {
      $('#colorbox').on('click.modal', '.confirm', confirm);
    }

    function unbind () {
      $('#colorbox').off('.modal');
      if (dfd.state() === 'pending') {
        dfd.reject();
      }

      busying = false;

      if (modal_queue.length) {
        setTimeout(_show_custom_modal, 0);
      }
    }

    options.onOpen = bind;
    options.onClosed= unbind;

    $.colorbox(options);

    dfd.done(function() {
      $.colorbox.close();
    });

    return dfd.promise();
  }

  var template_modal = MANYOU.template([
  '<div>'
  , '<p><#=@text#></p>'
  , '<#if(@confirm_text||@cancel_text){#>'
  , '<div class="cbox-foot">'
  ,   '<#if(@confirm_text){#><input class="btn confirm" type="button" value="<#=@confirm_text#>"><#}#>'
  ,   '<#if(@cancel_text){#><input class="btn close" type="button" value="<#=@cancel_text#>"><#}#>'
  , '</div>'
  , '<#}#>'
  ,'</div>'
  ].join(''));

  MANYOU.modal = {
    message: function(text, timeout) {
      // 无x 无按钮, 1秒后关闭
      return show_custom_modal({
        className: 'noclose message cbox-nt-nc-nb',
        html: template_modal({
          text: text
        }),
        autoclose: +timeout || 1,
        innerWidth: 120
      });
    },
    error: function(text) {
      // 有x, 确定
      return show_custom_modal({
        className: 'error cbox-nt',
        html: template_modal({
          confirm_text: '确定',
          text: text
        }),
        innerWidth: 310
      });
    },
    confirm: function(text) {
      // 无x, 确定 取消
      return show_custom_modal({
        className: 'noclose confirm cbox-nt-nc',
        html: template_modal({
          confirm_text: '确定',
          cancel_text: '取消',
          text: text
        }),
        innerWidth: 190
      });
    },
    alert: function(text, confirm_text, cancel_text) {
      // 有x, 确定 取消, 可改变默认文字
      return show_custom_modal({
        className: 'alert cbox-nt',
        html: template_modal({
          confirm_text: confirm_text || '确定',
          cancel_text: cancel_text || '取消',
          text: text
        }),
        innerWidth: 310
      });
    },
    custom: show_custom_modal
  };
});
