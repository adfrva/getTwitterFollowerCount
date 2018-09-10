function getTwitterUserFollowers() {
  var ss = SpreadsheetApp.openByUrl(""); //Insert google spreadsheet url

  var id = ss.getRange("A2").getValue();
  var CONSUMER_KEY = "";
  var CONSUMER_SECRET = ""; // Register your app with Twitter, insert keys

  // Encode consumer key and secret
  var tokenUrl = 'https://api.twitter.com/oauth2/token';
  var tokenCredential = Utilities.base64EncodeWebSafe(
    CONSUMER_KEY + ':' + CONSUMER_SECRET);

    //  Obtain a bearer token with HTTP POST request
    var tokenOptions = {
    headers : {
      Authorization: 'Basic ' + tokenCredential,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
    method: 'post',
    payload: 'grant_type=client_credentials'
 };

  var responseToken = UrlFetchApp.fetch(tokenUrl, tokenOptions);
  var parsedToken = JSON.parse(responseToken);
  var token = parsedToken.access_token;

  // Authenticate Twitter API requests with the bearer token
  var apiUrl = "https://api.twitter.com/1.1/users/show.json?screen_name="+id;
  var apiOptions = {
    headers : {
      Authorization: "Bearer " + token
      },
    'method' : 'get'
 };

  var responseApi = UrlFetchApp.fetch(apiUrl, apiOptions);

  var result = '';


  if (responseApi.getResponseCode() == 200) {

    // Parse the JSON encoded Twitter API response
    var tweets = JSON.parse(responseApi.getContentText());

 }

  var d = new Date();
  var date = d.toLocaleDateString();

  var rowNum = getFirstEmptyRowWholeRow();
  var dateCell = ss.getActiveSheet().getRange(rowNum, 2).setValue(date).setFontSize(14);
  var countRow = ss.getActiveSheet().getRange(rowNum, 3).setValue(tweets.followers_count).setFontSize(14);
  var changeVal = countRow.getValue() - (ss.getActiveSheet().getRange(rowNum - 1, 3).getValue());
  var changeRow = ss.getActiveSheet().getRange(rowNum, 4).setValue(changeVal).setFontSize(14);
}

function getFirstEmptyRowWholeRow() {
  var sheet = SpreadsheetApp.openByUrl(""); //Insert google spreadsheet url
  var range = sheet.getDataRange();
  var values = range.getValues();
  var row = 0;
  for (var row=0; row<values.length; row++) {
    if (!values[row].join("")) break;
  }
  return (row+1);
}
