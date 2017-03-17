var urls = {
  sendMessage : "https://slack.com/api/chat.postMessage",
  getUsers : "https://slack.com/api/im.list",
  getMessages : "https://slack.com/api/im.history",
  uploadFile : "https://slack.com/api/files.upload",
  authorise : "https://slack.com/oauth/authorize",
  access : "https://slack.com/api/oauth.access"
}
var _token = "xoxp-154581537425-155259091202-156519975830-0478f7b386b55470d11bf91d08ad16fb";
var ClientID = "154581537425.155941841734";
var ClientSecret = "e68ac9d9354018255366f28429df17ae";
var chatIds;
var firstResponse = true;
var numberOfMessagesFirst = 0;
var numberOfMessagesSecond = 0;
var counter;

function startMurphyCall() {
  showLoading();
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
    if('attachments' in data.messages[0]) {
      $("#murphyImage img").attr("src", data.messages[0].attachments[0].image_url);
      showImageFromMurphy();
      stopRecognition();
      imagefound = true;
    }
    else {
      console.log(data.messages[0].text);
      handleResponse(data.messages[0].text);
    }
  }
  else if(counter > 6) {
    startAgain();
  }
  else {
    setTimeout(pollMessages, 2000);
  }
}

function handleResponse(response) {
  if(response.includes("...")) {
  }
  startAgain();
}

function uploadImage() {
  var canvas = document.getElementById("canvas");
  var dataURL = canvas.toDataURL();
  var blob = dataURItoBlob(dataURL);
  var form = new FormData(document.forms[0]);
  form.append("file", blob);

   makeUploadCall(urls.uploadFile, form, null);
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

function makeUploadCall(url, _data, successFunction) {
  $.ajax({
    url: url + "?token=" + _token + "&channels=" + chatIds[1].id + "&filename=name&pretty=1",
    data: _data,
    processData: false,
    contentType: "multipart/form-data",
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
