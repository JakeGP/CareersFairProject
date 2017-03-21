var urls = {
  sendMessage : "https://slack.com/api/chat.postMessage",
  getUsers : "https://slack.com/api/im.list",
  getMessages : "https://slack.com/api/im.history",
  uploadFile : "https://slack.com/api/files.upload",
  authorise : "https://slack.com/oauth/authorize",
  access : "https://slack.com/api/oauth.access"
}
var _token = "xoxp-154581537425-155259091202-157080191989-72e4050b44188f759bbf433d7c22f5c7";
var ClientID = "154581537425.155941841734";
var ClientSecret = "e68ac9d9354018255366f28429df17ae";
var chatIds;
var firstResponse = true;
var numberOfMessagesFirst = 0;
var numberOfMessagesSecond = 0;
var counter;

function startMurphyCall() {
  firstResponse = true;
  numberOfMessagesFirst = 0;
  numberOfMessagesSecond = 0;
  sendMessage();
}

function getUsers() {
  data = { token : _token };
  makeCall(urls.getUsers, data, addChat);
}

function addChat(data) {
  chatIds = data.ims;
}

function sendMessage() {
  var text = "what if " + $("#ask-textbox").val();
  data = {
    token: _token,
    channel: chatIds[1].id,
    text: text,
    as_user: true
   };

   makeCall(urls.sendMessage, data, getMessages);
}

function getMessages() {
  data = {
    token: _token,
    channel: chatIds[1].id,
    count: 1000
  };

  makeCall(urls.getMessages, data, getFirstMessages);
}

function getFirstMessages(data) {
  if(numberOfMessagesFirst == 0) {
    numberOfMessagesFirst = data.messages.length;
    counter = 0;
    getMessages();
  }
  else {
    pollMessages();
  }
}

function pollMessages() {
  data = {
    token: _token,
    channel: chatIds[1].id,
    count: 1000
  };

  counter += 1;
  makeCall(urls.getMessages, data, updateResponses);
}

function updateResponses(data) {
  numberOfMessagesSecond = data.messages.length;

  if(numberOfMessagesSecond > numberOfMessagesFirst) {
    console.log(data.messages[0].text);
    handleResponse(data.messages[0].text);

    var difference = numberOfMessagesSecond - numberOfMessagesFirst;
    for(var i = 0; i < difference; i++) {
      if('attachments' in data.messages[0]) {
        imageToDataUrl(data.messages[0].attachments[0].image_url, function(base64Img) {
          $("#murphyImage img").attr("src", base64Img);
          uploadImageFromUrl(base64Img, updateUniqueUrl);
        }, "image/png");
        showImageFromMurphy();
        stopRecognition();
        imagefound = true;
      }
    }
  }
  else if(counter > 18) {
    error("UH OH! \n\n PLEASE TRY AGAIN!")
  }
  else {
    setTimeout(pollMessages, 50);
  }
}

function handleResponse(response) {
  response = response.trim();

  if(response.includes("Attachment received") || response.includes("Thanks, I will keep this photo for 10 minutes")) {
    attachmentRecieved();
  }
  else if(response.includes("I'm sorry but I only accept images with faces in them")) {
    attachmentRefused();
  }
  else if(response.includes("You asked:") || response.includes("Here's an idea:")) {
    console.log("Image Returned");
  }
  else if(response.includes("uploaded a file:")) {
    console.log("File Uploaded");
    pollMessages();
  }
  else if(response.includes("Please upload a photo that represents you so I can try that question")) {
    error("UPLOAD A PHOTO OF YOURSELF TO ASK 'WHAT IF I...' QUESTIONS");
  }
  else {
    error(response + "\n\r TRY ANOTHER QUESTION!");
  }
}

function uploadImage() {
  var canvas = document.getElementById("canvas");
  var dataURL = canvas.toDataURL("image/png");
  //document.getElementById('hidden_data').value = dataURL;
  var blob = dataURItoBlob(dataURL);
  var form = new FormData(document.forms["form1"]);
  form.append("file", blob);
  var url = urls.uploadFile + "?token=" + _token + "&channels=" + chatIds[1].id + "&filename=file&pretty=1";
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url,  true);
  xhr.onload = function() {

  };
  xhr.onreadystatechange=function(){
    if (xhr.readyState==4 && xhr.status==200){
      console.log('xhr.readyState=',xhr.readyState);
      console.log('xhr.status=',xhr.status);
      console.log('response=',xhr.responseText);

      setTimeout(function() { getMessages(); }, 200);
    }
  };
  xhr.send(form);
}

function uploadImageFromUrl(dataURL, callback) {
  //document.getElementById('hidden_data').value = dataURL;
  var blob = dataURItoBlob(dataURL);
  var form = new FormData();
  form.append("file", blob, "file.png");
  var url = "http://uploads.im/api?upload";
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url,  true);
  xhr.onload = function() {

  };
  xhr.onreadystatechange=function(){
    if (xhr.readyState==4 && xhr.status==200){
      console.log('xhr.readyState=',xhr.readyState);
      console.log('xhr.status=',xhr.status);
      console.log('response=',xhr.responseText);
      var data = JSON.parse(xhr.responseText);
      callback(data.data.img_url);
    }
  };
  xhr.send(form);
}

function makeCall(url, _data, successFunction) {
  $.ajax({
    url: url,
    data: _data,
    datatype: 'json',
    type: 'POST',
    success: function (data) {
      console.log(data);
      if(successFunction != null)
        successFunction(data);
      return data;
     },
     error: function (jqXHR, textStatus, errorThrown) {
      return errorThrown;
    }
  });
}

function imageToDataUrl(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}
