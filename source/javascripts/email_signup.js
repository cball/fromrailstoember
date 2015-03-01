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
    var form = $(this);
    event.preventDefault();
    disableSubmitButton(form);

    $.post(form.attr('action'), postDataForForm(form), function() {
        $('#contact-source').after("<div class='popup-thanks'>Thanks for the message!</div>");
        enableSubmitButton(form);

        setTimeout(function() {
          $('#send-tip-link').popover('hide');
        }, 2000);
      }
    );
  });

  $('#no-more').on('submit', '#mailing-list', function(event) {
    var form = $(this);
    event.preventDefault();
    disableSubmitButton(form);

    $.post(form.attr('action'), postDataForForm(form), function() {
        $('#list-id').after("<div class='popup-thanks'>Thanks for subscribing! You should get a welcome email shortly.</div>");
        enableSubmitButton(form);

        setTimeout(function() {
          $('#list-signup-button').popover('hide');
        }, 2000);
      }
    )
    .fail(function(data) {
      $('#list-id').after("<div class='popup-thanks'>" + data.responseText + "</div>");
      enableSubmitButton(form);
    });
  });

  var disableSubmitButton = function(form) {
    var submitButton = form.find('input[type="submit"]');
    submitButton.prop('disabled', true);
  }

  var enableSubmitButton = function(form) {
    var submitButton = form.find('input[type="submit"]');
    submitButton.prop('disabled', false);
  }

  var postDataForForm = function(form) {
    var postData ={};
    var inputs = form.serializeArray();
    $(inputs).each(function(index, input) {
      postData[input.name] = input.value;
    });

    return postData;
  }
});
