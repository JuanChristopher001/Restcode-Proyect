
    $(function() {

        ReadData();

        $('#btnShow').click(function() {
            var isDelete = $(this).text().includes('Delete');
            var isNewRecord = $('#dataModalLabel').text().includes('New');
            if (isDelete) // Delete Data.
          {
              $('#method').val('delete');
              DataObjectRest('delete');
    } else {
        if (isNewRecord) // New Data.
    {
       DataObjectRest('new');
    }
     else // Edit Data.
    {
       $('#method').val('put');
       DataObjectRest('update');
    }
 }
});

        $('#btnShow').click(function() {
            var boxType = $('#passcode').attr('type');
            if (boxType == 'password') {
                $('#passcode').attr('type','text');  
                $(this).html('<i class="fas fa-eye-slash"></i>');
            } else {
                $('#passcode').attr('type','password');
                $(this).html('<i class="fas fa-eye"></i>');
            }
    
        });

        
        $('#dataModal').on('show.bs.modal', function(event) {
            var isDelete = $('#dataModalLabel').text().includes('Delete');
            if (isDelete) {
                $('#btnAction').text('Delete').removeClass('btn-primary').addClass('btn-danger');
                $('#email, #passcode').attr('readonly','readonly');
            } else {
                $('#btnAction').text('Save').addClass('btn-primary').removeClass('btn-danger');
                $('#email, #passcode').removeAttr('readonly');
            }
    
        });

        $(document).on('click','.fa-pencil-alt, .fa-trash-alt',function() {
            var isDelete = $(this).hasClass('fa-trash-alt');
            $('#dataModalLabel').text((isDelete ? 'Delete' : 'Edit') + ' User Data');
            $('#dataModal').modal('show');

            var id = $(this).attr('data-id');
            ViewData(id);

        });

    $(document).on('click', '#btnNew', function() {
        $('#dataModalLabel').text('New user Data');
        $('#dataModal').modal('show');
        $('#email').val('');
        $('#passcode').val('');

    });


    });

      function ReadData() {

            $.ajax({
                dataType: "json",
                url: 'https://jdastas-comp2850.000webhostapp.com/api.php/usuario',
                data: null,
                success: function(data) {
                    console.log(data);
                    var str = ('<div class="tbl-header">' +
                    '<div>ID</div><div>Email</div><div>Password</div>'+
                    '<div>' +
                    '<button type="button" id="btnNew" class="btn btn-primary">New</button>' +
                    '</div>' +
                    '</div>');
                    data.forEach(row => {
                        str += (
                           '<div class="tbl-row">' +
                           '<div>'+ row.id + '</div>' +
                           '<div>'+ row.email + '</div>' +
                           '<div>'+ row.passcode + '</div>' + 
                           '<div>' + 
                           '<i class="fas fa-pencil-alt" data-id="' + row.id + '"></i>' +
                           '<i class="fas fa-trash-alt" data-id="' + row.id + '"></i>' +
                           '</div>' +
                        '</div>' 
                        );
                    });
                    $('#datos').html(str);
                }

            });
        }

function ViewData(_id) {
    console.log(_id);

    $.ajax({

        dataType: "json",

        url: 'https://jdastas-comp2850.000webhostapp.com/api.php/usuario/' + _id,

        data: null,

        success: function(data) {

            $('#email').val(data.email);
            $('#passcode').val(data.passcode);
            $('#key').val(data.id);

        }

    });

}

function DataObjectRest(_dataAction) {
    var formData = $('form').serializeArray();
    console.log(formData);
    if (_dataAction == 'delete') {
        formData.splice(2,2); // remove "email" and "passcode" data
        formData.push({name: 'table', value: 'usuario'});
    } else if (_dataAction == 'new') {

        formData.splice(0,2);
    }
    var jsonData = new Object();
    formData.forEach(element => {
        jsonData[ element.name ] = element.value;

    });

    console.log(jsonData);
    console.log(JSON.stringify(jsonData));



    $.ajax({

        type: 'post',
        dataType: "json",
        url: 'jdastas-comp2850.000webhostapp.com/api.php/usuario',
        data: JSON.stringify(jsonData),
        success: function(data) {
            $('#dataModal').modal('hide');
            ReadData();

        },
        error: function(err) {
            console.log('Error Message: ', err);

        }

    });
}