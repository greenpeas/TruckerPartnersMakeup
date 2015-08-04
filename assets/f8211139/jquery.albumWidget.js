function deleteAlbum(jsonResp) {
    json = jQuery.parseJSON(jsonResp);
    $('#album' + json.id).remove();
}