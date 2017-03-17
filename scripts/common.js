var photoTaken = false;

$(function() {
  getUsers();
});

function showImageFromMurphy() {
  $("#video").hide();
  $("#canvas").hide();
  $("#buttons").hide();
  $("#murphyloading").hide();
  $("#buttons2").css("display", "flex");
  $("#murphyImage").css("display", "flex");
}

function showLoading() {
  $("#video").hide();
  $("#canvas").hide();
  $("#murphyloading").css("display", "flex");
}

function showPhotoButtons() {
  $("#accept").addClass("show");
  $("#decline").addClass("show");
}

function hidePhotoButtons() {
  $("#accept").removeClass("show");
  $("#decline").removeClass("show");
}

function startAgain() {
  $("#video").css("display", "block");
  $("#canvas").css("display", "none");
  $("#murphyImage").css("display", "none");
  $("#murphyloading").hide();
  $("#buttons").css("display", "flex");
  $("#buttons2").css("display", "none");
  $("#ask-textbox").val("");
  $("#ask-textbox").focus();
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
  return new Blob([ab], { type: 'image/jpeg' });
}

$("#ask-textbutton").on("click", function() {
  startMurphyCall();
  stopRecognition();
});

$("#startagain").click(function() {
  startAgain();
});

$("#accept").click(function() {
    if(photoTaken) {
      uploadImage();

      $("#video").css("display", "block");
      $("#canvas").css("display", "none");
      photoTaken = false;
      hidePhotoButtons();
    }
});

$("#decline").click(function() {
  if(photoTaken) {
    $("#video").css("display", "block");
    $("#canvas").css("display", "none");
    photoTaken = false;
    hidePhotoButtons();
  }
});
