// Grab elements, create settings, etc.
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
  localStorage.removeItem("image"); 
  $("#video").css("display", "none");
  $("#canvas").css("display", "block");
  $(".photo-accept").css("display", "block");
	context.drawImage(video, 0, 0, 640, 480);
  backToCamera();
});

function backToCamera() {
  //IF PHOTO IS ACCEPTED, CONVERT TO BASE64 AND SAVE TO LOCALSTORAGE
  $("#accept").click(function() {
    var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL("image/png");
    dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    try {
        localStorage.setItem("image", dataURL);
    }
    catch (e) {
        console.log("Storage failed: " + e);
    }

    $("#video").css("display", "block");
    $("#canvas").css("display", "none");
    $(".photo-accept").css("display", "none");
  });

  //IF PHOTO IS DECLINE, REVERT TO CAMERA
  $("#decline").click(function() {
    $("#video").css("display", "block");
    $("#canvas").css("display", "none");
    $(".photo-accept").css("display", "none");
  });
}

/* Legacy code below: getUserMedia
else if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia({ video: true }, function(stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({ video: true }, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({ video: true }, function(stream){
        video.src = window.URL.createObjectURL(stream);
        video.play();
    }, errBack);
}
*/
