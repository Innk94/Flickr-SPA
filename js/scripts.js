//Global variables used when user previews private list of pictures.
var myListPhotoTitle = [];
var myListPhotoUrl = [];

// Request pictures from Flickr with users search value.
function searchPictures() {
  var tag = document.getElementById('searchInput').value;
  var searchBtn = document.getElementById("searchBtn");
  //If search value is not empty.
  if(tag){
    var response = "";
    var url = "https://api.flickr.com/services/rest/";
    var first = true;
    var xhr = new XMLHttpRequest();
    var options = {
      "api_key": "b68a2df050ac89c019aa14cdf5c6e22a",
      "method": "flickr.photos.search",
      "format": "json",
      "nojsoncallback": "1",
      "text": tag
    }

    removeChildren("resultBox");
    searchBtn.style.backgroundColor = "#F7B733";

    //Builds URLs based on search value.
    for (var item in options) {
      if (options.hasOwnProperty(item)) {
        url += (first ? "?" : "&") + item + "=" + options[item];
        first = false;
      }
      else {
        console.log("Option have no item");
      }
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4){
             //sends Flickr response to function "callback".
             callback(xhr.responseText);
         }
    };
    xhr.open('get', url, true);
    xhr.send();
  }
  else{
    searchBtn.style.backgroundColor = "#FF4C4C";
  }
}

//Builds users personal photo-list from global variables.
function showList(){
  removeChildren("resultBox");

  for (var i=0; i < myListPhotoUrl.length; i++){
    var child = document.createElement("a");
    var altText = document.createElement("p");
    var imgText = document.createElement("button");
    var resultBox = document.getElementById("resultBox");

    child.className += "pictures";
    child.innerHTML = '<img class="picture" alt="'+ myListPhotoTitle[i] + '"src="' + myListPhotoUrl[i] + '"/>';
    child.addEventListener( "click", function(){
        previewPicture(this.firstChild.src);
    });

    altText.className = "altText";
    altText.innerHTML = myListPhotoTitle[i];

    imgText.className += "mouseOverText";
    imgText.innerHTML = "Preview";
    imgText.addEventListener( "click", function(){
        previewPicture(this.previousSibling.src);
    });

    child.appendChild(imgText);
    child.appendChild(altText);
    resultBox.appendChild(child);
  }
}

//Adds photos from Flickr to child elements of div "resultBox".
function callback(data) {
  if(data){
   var rsp = JSON.parse(data);
   var total = document.createElement("p");
   var resultBox = document.getElementById("resultBox");

   //Reverses order of items to get the newest picture first.
   rsp.photos.photo.reverse();

   total.className = "totalResult";
   total.innerHTML = "Results found: " + rsp.photos.photo.length;
   resultBox.appendChild(total);

   //For each photo, build and place info for HTML elements.
   for (var i=0; i < rsp.photos.photo.length; i++) {
      photoBuilder(rsp.photos.photo[i]);
   }
 }
 else{
   console.log("Passed parameter is empty.");
 }
}

//Creates HTML photo boxes.
function photoBuilder(photo){
  if(photo){
    var child = document.createElement("div");
    var picBox = document.createElement("div");
    var img = document.createElement("img");
    var imgText = document.createElement("button");
    var favBtn = document.createElement("button");

    t_url = photoUrlBuilder(photo.farm, photo.server, photo.id, photo.secret);

    child.className += "pictures";
    picBox.className += "pictureBox";

    img.className += "picture";
    img.setAttribute("alt", photo.title);
    img.setAttribute("src", t_url);
    img.addEventListener( "click", function(){
        previewPicture(this.src);
    });

    imgText.className += "mouseOverText";
    imgText.innerHTML = "Preview";
    imgText.addEventListener( "click", function(){
        previewPicture(this.previousSibling.src);
    });

    favBtn.className = 'saveBtn';
    favBtn.innerHTML = 'Save';
    favBtn.addEventListener( 'click', function(){
        addPictureToList(this.previousSibling.firstChild.alt, this.previousSibling.firstChild.src);
        this.style.backgroundColor = "#8ECC8E";
        this.innerHTML = "Saved!"
        this.disabled = true;
    });

    picBox.appendChild(img);
    picBox.appendChild(imgText);
    child.appendChild(picBox);
    child.appendChild(favBtn);
    resultBox.appendChild(child);
  }
  else{
    console.log("Passed parameter is empty.");
  }
}

//Creates photo urls based on callback from FlickrAPI.
function photoUrlBuilder(farm, server, id, secret){
  if(farm, server, id, secret){
    return "http://farm" + farm + ".static.flickr.com/" +
    server + "/" + id + "_" + secret + "_" + "c.jpg";
  }
  else{
    console.log("Passed parameter is empty.");
  }
}

//Removes child elements of div "resultBox".
function removeChildren(id){
  if(id){
    var childList = document.getElementById(id);
    while (childList.firstChild) {
        childList.removeChild(childList.firstChild);
    }
  }
  else{
    console.log("Passed parameter is empty.");
  }
}

//Builds modal for preview of specific picture.
function previewPicture(t_url){
  if(t_url){
    var child = document.createElement("a");
    var closeBtn = document.createElement("span");
    var modal = document.getElementById('myModal')

    //Removes info from previous preview of photo.
    removeChildren("myModal");

    child.innerHTML = '<img id="modalImg" src="' + t_url + '"/>';
    modal.appendChild(child);

    closeBtn.innerHTML = '<span class="close">&times;</span>';
    closeBtn.addEventListener( 'click', function(){
        document.getElementById("myModal").style.display = "none";
    });

    modal.appendChild(closeBtn);

    //Replaces targeted picture url from large square (150 x 150px)
    //to medium (800 on longest side).
    count = t_url.length;
    count = count - 5;
    t_url = t_url.substr(0, count) + "c.jpg";
    modal.style.display = "block";
    modalImg.src = t_url;
  }
  else {
    console.log("Passed parameter is empty.");
  }
}

//Adds single picture URL and info to users personal photo-list.
function addPictureToList(childTitle, childSrc){
  if(childTitle, childSrc){
    myListPhotoTitle.push(childTitle);
    myListPhotoUrl.push(childSrc);
  }
  else{
    console.log("Passed parameter is empty.");
  }
}
