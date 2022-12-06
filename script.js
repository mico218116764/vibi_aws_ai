function fileValidation(file) {
    var fileInput =
        document.getElementById('file');
     
    var filePath = fileInput.value;
 
    // Allowing file type
    var allowedExtensions =
            /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
     
    if (!allowedExtensions.exec(filePath)) {
        alert('Please input PDF, PNG, JPEG, JPG format file');
        fileInput.value = '';
        return false;
    }
    else {
        // Image preview
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(
                    'imagePreview').innerHTML =
                    '<img src="' + e.target.result
                    + '" height="200px"/>';
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}