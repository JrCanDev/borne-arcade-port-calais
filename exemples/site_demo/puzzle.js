var pieces = $('.piece');

pieces.each(function() {

  Hammer(this).on('dragstart', function(event) {
    console.log('dragstart', event);
    event.gesture.preventDefault();
  });

  Hammer(this).on('drag', function(event){
    // console.log('drag', event.gesture.deltaX, event.gesture.deltaY)
    var target = event.target;
    $(target).css({
      'transform': 'translate(' + event.gesture.deltaX + 'px,' + event.gesture.deltaY + 'px)'
    });
  });

  Hammer(document.body).on('dragend', function(event)
  {
    console.log('dragend', event);
    $(event.target).css({'transform': 'translate(0,0)'});
    // debugger;
    var dropEl = document.elementFromPoint(event.gesture.center.pageX, event.gesture.center.pageY);
    var piece = $(event.target);
    console.log(dropEl)
    if ($(dropEl).hasClass('drop-target'))
    {
      var dropTarget = $(dropEl);
      if (dropTarget.hasClass('dropped'))
      {
        // Si la drop-target contient déjà une pièce, on échange les deux pièces
        var otherPiece = dropTarget.children();
        piece.appendTo(dropTarget);
        otherPiece.appendTo(piece.parent());
      }
      piece.appendTo(dropEl);
      $(dropEl).addClass('dropped');
    } else
    {
      // retirer la classe dropped de tous les drop-target sauf ceux qui contiennent une pièce
      $('.drop-target').each(function(){
        if ($(this).children().length == 0)
        {
          $(this).removeClass('dropped');
        }
      })
    }
  })
})

$(document.body).on('mousedown', '[draggable]', function(event){
  console.log('mousedown', event);
})

$(document.body).on('mouseup', '[draggable]', function(event){
  console.log('mouseup', event);
  event.preventDefault()
})

Hammer(document.body).on('release', function(event){
  console.log('release', event);
  event.gesture.preventDefault()
});