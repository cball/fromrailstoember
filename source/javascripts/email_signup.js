$(function() {

  $('.popover-trigger').popover({
    html: true,
    placement: 'top',
    content: function() {
      return $(this).siblings('.content-for-popover').html();
    }
  });

  $('#list-signup-button').on('show.bs.popover', function() {
    window.analytics.track('Clicked Newsletter Signup');
  });

  $('#send-tip-link').on('show.bs.popover', function() {
    window.analytics.track('Clicked send tip in footer');
  });
});
