$(function(){
  var $doc = $(document);
  var menu_class = '.dropdown-menu';
  var duration = 100;
  var toggle_class = 'activing';

  var dropdown = function(event) {
    event.preventDefault();
    var $btn = $(this);
    var $btn_group = $btn.parent();

    if ($btn_group.hasClass(toggle_class)) {
      return;
    }

    setTimeout(function() {
      $btn_group.addClass(toggle_class);
      var $menu = $btn.next(menu_class);
      $menu.find('a').width($btn.width());
      $menu.slideDown(duration);

      $doc.one('click', function() {
        $btn.data('slide', false);
        $menu.slideUp(duration, function() {
          $btn_group.removeClass(toggle_class);
        });
      });
    }, 50);
  };

  var close = function(event) {
    event.data.btn.data('slide', false);
    event.data.menu.slideUp(duration, function() {
      event.data.menu.parent().removeClass(toggle_class);
    });
  };

  $doc.on('click', '[data-toggle="dropdown"]', dropdown);

});
