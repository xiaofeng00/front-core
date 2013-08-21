$(function(){
  MANYOU.plugin.clone = function(selector) {
    var $origin = $(selector);
    
    var EVENT_TRIGGER_CLONE = 'focusin.clone, mousedown.clone';

    var $delete = $('<a href="#" class="delete">删除</a>').on('click', function(event) {
      event.preventDefault();
      $(this).closest('.clone').remove();
    });

    function clone () {
      var $this = $(this);
      if ($this.hasClass('clone')) { return; }

      $this
      .after(auto_incrase_name($this.clone(true))
      .on(EVENT_TRIGGER_CLONE, clone))
      .addClass('clone')
      .off('.clone')
      .append($delete.clone(true));
    }

    function auto_incrase_name ($obj) {
      $obj.find('input[name],radio[name],checkbox[name]').attr('name', function(i, name) {
        return name.replace(/\[(\d+)\]$/g, function($0, $1) {
          return '['+ ++$1 + ']';
        });
      });

      return $obj
    }

    $origin.on(EVENT_TRIGGER_CLONE, clone);
  };
});
