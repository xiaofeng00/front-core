$(function(){
  if (MANYOU.IE_HACK) {
    var $form = $('#global-search').on('focus', '.keyword', function() {
      $form.addClass('focus');
    }).on('blur', '.keyword', function() {
      $form.removeClass('focus');
    });
  }
});
