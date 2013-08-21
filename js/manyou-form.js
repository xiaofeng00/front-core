$(function(){
  var class_name = 'checked';

  $(document)
  .on('change', '.checkbox > :checkbox', function() {
    var $this = $(this);
    $this.parent().toggleClass(class_name, $this.prop('checked'));
  })
  .on('change', '.radio > :radio', function() {
    var $this = $(this);
    var checked = $this.prop('checked');

    $this.parent().toggleClass(class_name, checked);

    if (checked) {
      var name = this.name;
      var $related = $(':radio[name="'+name+'"]').not($this);
      $related.parent('.radio').removeClass(class_name);
    }
  });

  $('.checkbox > :checkbox, .radio > :radio').trigger('change');

  // 上传控件
  $('input[data-toggle="file"]').each(function() {
    var $outer = $('<div>').addClass('input-file');
    var $input = $(this).hide();
    var $text = $('<input type="text" readonly tabindex="-1">');
    var $button = $('<button>').addClass('btn').text('选择文件');

    $input.after($outer.append($text, $button));

    $input.on('change', function() {
      var fakepath = $input.val().split(/[\\\/]/);
      $text.val(fakepath.pop());
    });

    $outer.on('click', 'input', function() {
      $button.click();
    }).on('click', 'button', function(e) {
      e.preventDefault();
      $input.click();
    });
  });
});
