var photoTaken = false;

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

$("#ask-textbutton").on("click", function() {
  startMurphyCall();
  stopRecognition();
});

$("#startagain").click(function() {
  startAgain();
});

$("#accept").click(function() {
    if(photoTaken) {
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
