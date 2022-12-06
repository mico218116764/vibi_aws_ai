function fileValidation(file) {
    var fileInput =
        document.getElementById('file');
     
    var filePath = fileInput.value;
 
    // Allowing file type
    var allowedExtensions =
            /(\.jpg|\.jpeg|\.png)$/i;
     
    if (!allowedExtensions.exec(filePath)) {
        alert('Please input PDF, PNG, JPEG, JPG format file');
        fileInput.value = '';
        return false;
    }
    else true;
}