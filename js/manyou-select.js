$(function(){
  var EVENT_NAME_DATA = 'data';
  var CLASS_SELECT = '.select-content';
  var CLASS_MENU = '.select-menu';
  var CLASS_HANDLE = '.handle';

  function get_class(name) {
    return name.slice(1);
  };

  function init ($select_origin) {

    var $select = $('<div>');

    var $input = $('<input>', {
      type: 'hidden',
      value: $select_origin.find(':selected').val(),
      name: $select_origin.attr('name')
    });

    var $content_group = $('<div>', {
      'class': get_class(CLASS_SELECT)
    });

    var $content = $('<p>');

    var $handle = $('<a>', {
      href: '#',
      'class': get_class(CLASS_HANDLE)
    });

    var $menu = $('<ul>', {
      'class': get_class(CLASS_MENU)
    });

    $select
    .on('click', CLASS_SELECT, function(event) {
      var $content_group = $(this);
      var $select = $content_group.parent();

      if ($select.hasClass('activing') || $select.hasClass('disabled')) {
        return;
      }

      var $menu = $content_group.next();

      setTimeout(function() {
        $select.addClass('activing');
        $menu.show();
        $(document).one('click', function() {
          $menu.hide();
          $select.removeClass('activing');
        });
      }, 50);
    })
    .on('click', CLASS_HANDLE, function(event) {
      event.preventDefault();
    })
    .on('click', '.select-menu a', function(event, inner_change) {
      event.preventDefault();

      var $item = $(this);
      var text = $item.text();
      var value = $item.data('value');

      var $menu = $item.closest(CLASS_MENU);
      var $select = $menu.prev();
      var $input = $select.prev();

      $select.find('p').text(text).attr('title', text);
      $menu.find('.select').removeClass('select');
      $item.addClass('select');
      $input.val(value).trigger(inner_change ? '_change' : 'change', [value, text]);
    })
    .on(EVENT_NAME_DATA, event_replace);

    $select.append($input, $content_group.append($content, $handle), $menu);

    // 如果没有 id 和 class 则模仿大小
    var id = $select_origin.prop('id');
    var className = $select_origin.prop('class');

    if (id || className) {
      $select
      .attr({
        id: id,
        'class': className
      });
    } else {
      $select.width($select_origin.innerWidth())
      .height($select_origin.innerHeight());
    }

    if ($select_origin.attr('disabled')) {
      $select.addClass('disabled');
    }

    $select_origin.after($select.addClass('select-group')).remove();

    return $select;
  }

  function event_replace (event, arr_data) {
    var arr_options = [];

    if (arr_data) {
      for (var i = 0; i < arr_data.length; i += 1) {
        var data = arr_data[i];
        var $option = $('<li>');
        var $item = $('<a>', {
          'class': data[2] ? 'select' : '',
          tabindex: -1,
          href: '#',
          'data-value': data[0]
        });

        arr_options[i] = ($option.append($item.text(data[1])));
      }
    }

    $(this)
    .find('p')
      .text('请选择...')
      .attr('title', '')
    .end()
    .find('input')
      .val('')
    .end()
    .find(CLASS_MENU)
      .empty().append(arr_options)
    .end()
    .trigger('update')
    .find('.select')
      .trigger('click', [true]);
  }

  $('select[data-toggle="select"]').each(function(i, select) {
    var $select_origin = $(select);
    var $select = init($select_origin);
    var data = [];

    $select_origin.find('option').each(function(i, option) {
      var $option = $(option);
      data.push([$option.val(), $option.text(), !!$option.attr('selected')]);
    });

    $select.trigger(EVENT_NAME_DATA, [data]);
  });
});
