$(function() {
  var options = {
    html: true,
    placement: 'top',
    content: $('#email-signup ~ .content-for-popover').html()
  };

  $('#email-signup').popover(options);
});
