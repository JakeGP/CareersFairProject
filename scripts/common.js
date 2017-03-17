var photoTaken = false;
var idleTime = 0;
var titles = [
  "What if Donald Trump was a pigeon?",
  "What if Britney Spears was a man?",
  "What if the Queen rode a motorbike?",
  "What if pigs had wings?",
  "What if Greenday were blue?",
  "What if the Obama was a woman?",
  "What if Cameron Diaz was James Bond?",
  "What if Will Wheaton was in Star Wars?",
  "What if a foot was a hand?",
  "What if James Bond was in Lord of the Rings?",
  "What if David Attenborough was a samouri?",
  "What if David Attenborough was in Wallace and Gromit?",
  "What if David Attenborough was in the Great British Bake Off?",
  "What if Jesus was baking a cake?",
  "What if a Granny was a Formula 1 Race Driver?"
]

$(function() {
  getUsers();
  checkIdle();
  iterateTitles();
});

function iterateTitles() {
  setInterval(changeTitle, 200);
}

function changeTitle() {
  var random = Math.floor(Math.random() * titles.length);
  $("#questions").html(titles[random]);
}

function checkIdle() {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
};

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 20) { // 20 minutes
        window.location.reload();
    }
}

function showImageFromMurphy() {
  $("#video").hide();
  $("#canvas").hide();
  $("#buttons").hide();
  $("#ask-textbutton").fadeOut(200);
  $("#textbox-wrapper").addClass("fullwidth");
  $("#murphyloading").hide();
  $("#buttons2").css("display", "flex");
  $("#murphyImage").css("display", "flex");
}

function showImage() {
  localStorage.removeItem("image");
  $("#video").hide();
  $("#canvas").css("display", "block");
  showPhotoButtons();
	context.drawImage(video, 0, 0, 640, 480);
  photoTaken = true;
}

function showSocialIcons() {
  $("#startagain").fadeOut(200);
  $("#share").addClass("shareicons");
  $("#socialicons").css("display", "flex");
}

function hideSocialIcons() {

}

function showLoading() {
  $("#ask-textbox").prop("disabled", true);
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
  $("#ask-textbutton").fadeIn(200);
  $("#textbox-wrapper").removeClass("fullwidth");
  $("#ask-textbox").prop("disabled", false);
  $("#ask-textbox").val("");
  $("#ask-textbox").focus();
}
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

function takePhoto() {
  showImage();
  $("#cameraFlash").fadeIn(400).delay(1000).fadeOut(1000);
  $("#cameraFlash").css("display", "flex");
}

$("#share").on("click", function() {
  showSocialIcons();
});

$("#snap").on("click", function() {
  takePhoto();
});

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
      $("#cameraFlash").hide();
      $("#video").css("display", "block");
      $("#canvas").css("display", "none");
      photoTaken = false;
      hidePhotoButtons();
    }
});

$("#decline").click(function() {
  $("#cameraFlash").hide();
  if(photoTaken) {
    $("#video").css("display", "block");
    $("#canvas").css("display", "none");
    photoTaken = false;
    hidePhotoButtons();
  }
});
