$(function() {
  var options = {
    html: true,
    placement: 'top',
    content: $('#email-signup ~ .content-for-popover').html()
  };

  $('#email-signup').popover(options);
  $('#email-signup').on('show.bs.popover', function() {
    window.analytics.track('Clicked Newsletter Signup');
  });
});
