'use strict';

$(() => {
  ShowAPIKeys();
});

function ShowAPIKeys()
{
  $('#table_api_keys').empty();
  
  $('#loader').show();
  
  $.post( "/listapikeys", {data: 0}, data => {
    $('#loader').hide();
    if (!data || !data.result)
      return;
      
    for (var i=0; i<data.result.length; i++)
    {
      if (!data.result[i].key) 
        continue;
        
      const key = data.result[i].key;
      const keyTableID = (Math.random()*100000).toFixed(0);
      
      const buttonDelete = $('<button class="btn btn-primary" >Delete</button>').on('click', e => {
                          e.preventDefault();
                            
                          $('#alert-fail').hide();
                          $('#alert-success').hide();
                          $('#loader').show();
                          $.post( "/deleteapikey", {key: key}, data => {
                            $('#loader').hide();
                  
                            $('#'+keyTableID).remove();
                          });
      });
      
      const buttonRead = $('<input id="'+keyTableID+'_read" type="checkbox">')
        .prop('checked', data.result[i].read || false)
        .change(() => {UpdateKey(key, keyTableID);});
      const buttonWrite = $('<input id="'+keyTableID+'_write" type="checkbox">')
        .prop('checked', data.result[i].write || false)
        .change(() => {UpdateKey(key, keyTableID);});
      const buttonWithdraw = $('<input id="'+keyTableID+'_withdraw" type="checkbox">')
        .prop('checked', data.result[i].withdraw || false)
        .change(() => {UpdateKey(key, keyTableID);});
      
      const tr = $('<tr id="'+keyTableID+'"></tr>')
          .append($('<td></td>').text(key))
          .append($('<td></td>').append(buttonRead))
          .append($('<td></td>').append(buttonWrite))
          .append($('<td></td>').append(buttonWithdraw))
          .append($('<td></td>').append(buttonDelete))
          
      $('#table_api_keys').append(tr);
    }
  });
}

function UpdateKey(key, keyTableID)
{
  const param = {key: key, read: 0, write: 0, withdraw: 0};
  
  if ($('#'+keyTableID+'_read').is(':checked')) param.read = 1;
  if ($('#'+keyTableID+'_write').is(':checked')) param.write = 1;
  if ($('#'+keyTableID+'_withdraw').is(':checked')) param.withdraw = 1;

  $('#loader').show();
  
  $.post( "/editapikey", param, data => {
    $('#loader').hide();
    if (!data || !data.result)
      return;
      
    ShowAPIKeys();
  });
}

$('#btn_add_key').on('click', e => {
    e.preventDefault();
    
  $('#alert-fail').hide();
  $('#alert-success').hide();
  $('#loader').show();
  $.post( "/generateapikey", {data: 0}, data => {
    $('#loader').hide();
    if (!data || !data.result)
      return;
    
    const key = data.result;
    const keyTableID = (Math.random()*100000).toFixed(0);
    
    const buttonDelete = $('<button class="btn btn-primary" >Delete</button>').on('click', e => {
      e.preventDefault();
        
      $('#alert-fail').hide();
      $('#alert-success').hide();
      $('#loader').show();
      $.post( "/deleteapikey", {key: key}, data => {
        $('#loader').hide();

        $('#'+keyTableID).remove();
      });
    });
    
    const tr = $('<tr id="'+keyTableID+'"></tr>')
        .append($('<td></td>').text(key))
        .append($('<td></td>').append($('<input type="checkbox">')))
        .append($('<td></td>').append($('<input type="checkbox">')))
        .append($('<td></td>').append($('<input type="checkbox">')))
        .append($('<td></td>').append(buttonDelete))
        
    $('#table_api_keys').append(tr);
  });
    
});



