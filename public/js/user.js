$(document).ready(function () {
    loadDataTables(indexUrl, imageUrl);

    $('#create_record').click(function () {
        $('#sample_form')[0].reset();
        $('#store_image').html('');
        $('.modal-title').text("Add New Record");
        $('#action_button').val("Add");
        $('#action').val("Add");
        $('#formModal').modal('show');
    });

    $('#sample_form').on('submit', function (event) {
        event.preventDefault();
        if ($('#action').val() == 'Add') {
            $.ajax({
                url: storeUrl,
                method: "POST",
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                success: function (data) {
                    var html = '';
                    if (data.errors) {
                        html = '<div class="alert alert-danger">';
                        for (var count = 0; count < data.errors.length; count++) {
                            html += '<p>' + data.errors[count] + '</p>';
                        }
                        html += '</div>';
                    }
                    if (data.success) {
                        html = '<div class="alert alert-success">' + data.success + '</div>';
                        // $('#sample_form')[0].reset();
                        $('#formModal').modal('toggle');
                        $('#user_table').DataTable().ajax.reload();
                    }
                    $('#form_result').html(html);
                    setTimeout(function () {
                        $('#form_result').html('');
                    }, 1000);
                }
            })
        }

        if ($('#action').val() == "Edit") {
            $.ajax({
                url: updateUrl,
                method: "POST",
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                success: function (data) {
                    var html = '';
                    if (data.errors) {
                        html = '<div class="alert alert-danger">';
                        for (var count = 0; count < data.errors.length; count++) {
                            html += '<p>' + data.errors[count] + '</p>';
                        }
                        html += '</div>';
                    }
                    if (data.success) {
                        html = '<div class="alert alert-success">' + data.success + '</div>';
                        $('#formModal').modal('toggle');
                        // $('#sample_form')[0].reset();
                        // $('#store_image').html('');
                        $('#user_table').DataTable().ajax.reload();
                    }
                    $('#form_result').html(html);
                    setTimeout(function () {
                        $('#form_result').html('');
                    }, 1000);
                }
            });
        }
    });

    $(document).on('click', '.edit', function () {
        var id = $(this).attr('id');
        $('#form_result').html('');
        $.ajax({
            //url: "/ajax-crud/" + id + "/edit",
            url: indexUrl + "/edit/" + id,
            dataType: "json",
            success: function (html) {
                $('#first_name').val(html.data.first_name);
                $('#last_name').val(html.data.last_name);
                $('#store_image').html("<img src=" + imageUrl + html.data.image + " width='70' class='img-thumbnail' />");
                $('#store_image').append("<input type='hidden' name='hidden_image' value='" + html.data.image + "' />");
                $('#hidden_id').val(html.data.id);
                $('.modal-title').text("Edit New Record");
                $('#action_button').val("Edit");
                $('#action').val("Edit");
                $('#formModal').modal('show');
            }
        })
    });

    var user_id;

    $(document).on('click', '.delete', function () {
        user_id = $(this).attr('id');
        $('#confirmModal').modal('show');
    });

    $('#ok_button').click(function () {
        $.ajax({
            url: indexUrl + "/destroy/" + user_id,
            beforeSend: function () {
                $('#ok_button').text('Deleting...');
            },
            success: function (data) {
                if (data.success) {
                    $('#ok_button').text('OK');
                    $('#confirmModal').modal('hide');
                    $('#user_table').DataTable().ajax.reload();
                    html = '<div class="alert alert-success">' + data.success + '</div>';
                    $('#form_result').html(html);
                    setTimeout(function () {
                        $('#form_result').html('');
                    }, 1000);
                }
            }
        })
    });

});

function loadDataTables(routeUrl, imageUrl) {
    $('#user_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: routeUrl,
        },
        columns: [
            {
                data: 'image',
                name: 'image',
                render: function (data, type, full, meta) {
                    return "<img src=" + imageUrl + data + " width='70' class='img-thumbnail' />";
                },
                orderable: false
            },
            {
                data: 'first_name',
                name: 'first_name'
            },
            {
                data: 'last_name',
                name: 'last_name'
            },
            {
                data: 'action',
                name: 'action',
                orderable: false
            }
        ]
    });
}