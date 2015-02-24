$(function() {
  $('.popover-trigger').each(function() {
    var content = $(this).siblings('.content-for-popover');
    var html = content.html();
    content.detach();

    $(this).popover({
      html: true,
      placement: 'top',
      content: html
    });
  });

  $('#list-signup-button').on('show.bs.popover', function() {
    window.analytics.track('Clicked Newsletter Signup');
  });

  $('#send-tip-link').on('show.bs.popover', function() {
    window.analytics.track('Clicked send tip in footer');
  });

  $('footer').on('submit', '.contact-form', function(event) {
    event.preventDefault();
    var form = $(this);
    var submitButton = form.find('input[type="submit"]');
    submitButton.prop('disabled', true);

    var postData ={};
    var inputs = form.serializeArray();
    $(inputs).each(function(index, input) {
      postData[input.name] = input.value;
    });

    $.post(form.attr('action'), postData, function() {
        $('#contact-source').after("<div class='popup-thanks'>Thanks for the message!</div>");
        submitButton.prop('disabled', false);

        setTimeout(function() {
          $('#send-tip-link').popover('hide');
        }, 2000);
      }
    );
  });
});
