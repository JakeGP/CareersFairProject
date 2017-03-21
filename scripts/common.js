var photoTaken = false;
var idleTime = 0;
var uniqueURL = "";

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
];
var recentImages = [

]
var defaultImages = [
  "http://sm.uploads.im/7XMkE.png",
  "http://sk.uploads.im/bLe8E.png",
  "http://sk.uploads.im/bUHDB.png",
  "http://sk.uploads.im/QuU4N.png",
  "http://sj.uploads.im/lDw5I.png"
]
var shareLinks = {
  facebook : "http://www.facebook.com/sharer.php?u=",
  twitter : "http://twitter.com/share?text=I visited the FCG stand at the careers fair today %23FCGCareersFair2017&url="
}

$(function() {
  getUsers();
  checkIdle();
  iterateTitles();
  setUpRecent();
});

setInterval(function() {
	$("#recent-wrapper #inner-wrapper .image").animate({ "left": "-=50px" }, "slow", "linear" );
}, 500);

setInterval(function() {
	var img = $('#recent-wrapper #inner-wrapper img:nth-last-child(5)').clone();
	$('#recent-wrapper #inner-wrapper').append(img);
}, 5000);

setInterval(function() {
  setUpRecent();
}, 60000);

function setUpRecent() {
  var recent = recentImages.length;
  $("#inner-wrapper").html("");

  for(var i = 0; i < 5; i++) {
    if(i < recent) {
      $("#inner-wrapper").append("<img class='image' src='" + recentImages[i] + "'/>");
    }
    else {
      $("#inner-wrapper").append("<img class='image' src='" + defaultImages[i] + "'/>");
    }
  }
}

function addToRecent(newUrl) {
  if(recentImages.length == 5) {
    recentImages.shift();
  }
  recentImages.push(newUrl);
}

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
  formatImage();
  $("#video").hide();
  $("#canvas").hide();
  $("#buttons").hide();
  $("#buttons2").show();
  $("#ask-textbutton").fadeOut(200);
  $("#textbox-wrapper").addClass("fullwidth");
  $("#murphyloading").hide();
  $("#murphyImage").css("display", "flex");
}

function formatImage() {
  var height = $("#loadedImage").height();
  var width = $("#loadedImage").width();

  if(height > width) {
    $("#loadedImage").css("height", "480px");
    $("#loadedImage").css("width", "auto");
  }
  else {
    $("#loadedImage").css("height", "auto");
    $("#loadedImage").css("width", "640px");
  }
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
  if(uniqueURL == "") {
    $("#socialLoading").addClass("show");
    setTimeout(function() {
      showSocialIcons();
    }, 1000);
  }
  else {
    $("#socialLoading").removeClass("show");
    $("#socialicons").addClass("show");
  }
}

function updateUniqueUrl(_uniqueURL) {
  uniqueURL = _uniqueURL;
  addToRecent(_uniqueURL);
  $("#twitter").attr("href", shareLinks.twitter + uniqueURL);
  $("#facebook").attr("href", shareLinks.facebook + uniqueURL);
}

function showLoading() {
  $("#ask-textbox").prop("disabled", true);
  $("#attachmentRecieved").css("display", "none");
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
  uniqueURL = "";
  setUpRecent();
  $("#murphyImage img").attr("src", "");
  $("#video").css("display", "block");
  $("#canvas").css("display", "none");
  $("#murphyImage").css("display", "none");
  $("#murphyloading").hide();
  $("#error").css("display", "none");
  $("#buttons").css("display", "flex");
  $("#buttons2").css("display", "none");
  $("#socialicons").removeClass("show");
  $("#attachmentRecieved").css("display", "none");
  $("#attachmentRefused").css("display", "none");
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
  hidePhotoButtons();
  $("#ask-textbox").prop("disabled", true);
  $("#cameraFlash").css("display", "flex");
  $("#cameraFlash").fadeIn(100).delay(400).fadeOut(1000);

  setTimeout(function() {
    $("#cameraFlash").css("display", "none");
    $("#murphyloading").css("display", "flex");
    uploadImage();
  }, 1400);
}

function attachmentRecieved() {
  $("#ask-textbox").prop("disabled", false);
  $("#murphyloading").css("display", "none");
  $("#attachmentRecieved").css("display", "flex");
  $("#ask-textbox").focus();
  photoTaken = false;
}

function attachmentRefused() {
  $("#murphyloading").css("display", "none");
  $("#attachmentRefused").css("display", "flex");
  $("#attachmentRefused").fadeIn(100).delay(400).fadeOut(2500);
  photoTaken = false;

  setTimeout(function() { startAgain(); }, 2500);
}

function error(errorMessage) {
  $("#murphyloading").css("display", "none");
  $("#error p").html(errorMessage);
  $("#error").css("display", "flex");
  $("#error").fadeIn(100).delay(600).fadeOut(2500);
  photoTaken = false;

  setTimeout(function() { startAgain(); }, 2500);
}

$("#share").on("click", function() {
  showSocialIcons();
});

$("#snap").on("click", function() {
  takePhoto();
});

$("#ask-textbutton").on("click", function() {
  showLoading();
  startMurphyCall();
  stopRecognition();
});

$("#startagain").click(function() {
  startAgain();
});
