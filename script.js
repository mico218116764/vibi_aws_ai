var _PDF_DOC,
_CANVAS = document.querySelector('#pdf-preview'),
_OBJECT_URL;

// Load the required clients and packages
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");
const { S3Client } = require("@aws-sdk/client-s3");

// Set the AWS Region
const REGION = "us-east-1"; //REGION

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: "us-east-1:be360f48-ec2e-4495-8934-ea2deb1e7432", // IDENTITY_POOL_ID
  }),
});

const bucketName = "ricky-test-bucket-1"; //BUCKET_NAME

// //v2
// AWS.config.region = 'REGION';
// var bucketName = BUCKET_NAME;
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'IDENTITY_POOL_ID'});

function uploadS3(){
    var files = document.getElementById('fileUpload').files;
    if (files) {
        var file = files[0];
        var fileName = file.name;
        var filePath = 'Textract/upload/' + fileName;
        var fileUrl = 'https://' + bucketRegion + '.amazonaws.com/my-    first-bucket/' +  filePath;
        s3.putObject({
            Key: filePath,
            Body: file,
            ACL: 'public-read'
            }, function(err, data) {
                if(err) {
                    reject('error');
                }
                alert('Successfully Uploaded!');
            }).on('httpUploadProgress', function (progress) {
                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                $("progress").attr('value', uploaded);
            });
        (async () => {
            try {
              const file = await s3
                .getObject({ Bucket: 'BUCKET-NAME', Key: 'path/to/your/file' })
                .promise();
              console.log(file.Body);
            } catch (err) {
              console.log(err);
            }
        })();
    }
}

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
            if(fileInput.value.split('.').pop() == "pdf"){
                document.querySelector('#pdf-preview').width = 150;
                document.querySelector('#imagePreview').style.display = 'none';
                _OBJECT_URL = URL.createObjectURL(fileInput.files[0]);
                showPDF(_OBJECT_URL);
            }
            else{
                document.querySelector('#pdf-preview').height = 0;
                document.querySelector('#imagePreview').style.display = 'inline-block';
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
}





function showPDF(pdf_url) {
	PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
        
		_PDF_DOC = pdf_doc;
		showPage(1);

		// destroy previous object url
    	URL.revokeObjectURL(_OBJECT_URL);
	}).catch(function(error) {
		alert(error.message);
	});;
}

function showPage(page_no) {
    // fetch the page
    _PDF_DOC.getPage(page_no).then(function(page) {
        _CANVAS = document.querySelector('#pdf-preview');
        // set the scale of viewport
        // alert(_CANVAS);
        var scale_required = _CANVAS.width / page.getViewport(1).width;
        
        // get viewport of the page at required scale
        var viewport = page.getViewport(scale_required);

        // set canvas height
        _CANVAS.height = viewport.height;

        var renderContext = {
            canvasContext: _CANVAS.getContext('2d'),
            viewport: viewport
        };
        
        // render the page contents in the canvas
        
        page.render(renderContext).then(function() {
            document.querySelector("#pdf-preview").style.display = 'inline-block';
        });
        
    });
}

/* Selected File has changed */
document.querySelector("#file").addEventListener('change', function() {
    // user selected file
    var file = this.files[0];

    // allowed MIME types
    var mime_types = ['application/pdf'];



    // object url of PDF 
    _OBJECT_URL = URL.createObjectURL(file);

    // send the object url of the pdf to the PDF preview function
    showPDF(_OBJECT_URL);
});