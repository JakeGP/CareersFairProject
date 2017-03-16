var urls = {
  sendMessage : "https://slack.com/api/chat.postMessage",
  getUsers : "https://slack.com/api/im.list",
  getMessages : "https://slack.com/api/im.history"
}
var _token = "xoxp-154581537425-155259091202-155300101364-c6ff0ee41ae6babc82984e31e02f169a";
var chatIds;
var firstResponse = true;
var numberOfMessagesFirst = 0;
var numberOfMessagesSecond = 0;

function startMurphyCall() {
  showLoading();
  firstResponse = true;
  numberOfMessagesFirst = 0;
  numberOfMessagesSecond = 0;

  data = { token : _token };
  makeCall(urls.getUsers, data, addChat);
}

function addChat(data) {
  chatIds = data.ims;
  sendMessage();
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
  else {
    setTimeout(pollMessages, 2000);
  }
}

function handleResponse(response) {
  if(response.includes("...")) {
  }
  startAgain();
}

function makeCall(url, _data, successFunction) {
  $.ajax({
    url: url,
    data: _data,
    datatype: 'json',
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
