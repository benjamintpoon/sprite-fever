$('#shake').on('click', function(){
    $('.dancer').addClass('animated shake');
      $('.dancer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
     $('.dancer').removeClass('animated shake');
        });
      });
  $('#wobble').on('click', function(){
    $('.dancer').addClass('animated wobble');
      $('.dancer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('.dancer').removeClass('animated wobble');
         });
      });
  $('#swing').on('click', function(){
    $('.dancer').addClass('animated swing');
      $('.dancer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('.dancer').removeClass('animated swing');
          });
      });
  $('#bounce').on('click', function(){
    $('.dancer').addClass('animated bounce');
      $('.dancer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('.dancer').removeClass('animated bounce');
          });
      });


$('').on('click', function(){
    $('.dancer').addClass('animated bounce');
      $('.dancer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('.dancer').removeClass('animated bounce');
          });
      });
