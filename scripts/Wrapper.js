var objdata;



function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function getCustomURL(_url){				
	var _finalURL = _url+"&language="+selectedLanguage;
	console.log("Loading URL... "+_finalURL);
	//window.location.href = _finalURL;
	document.getElementById('app-frame').src = _finalURL;
}

this.currentScene = 1;
this.currentAudio;
this.statusObj = {};
this.isQuizCompleted = false;
this.currentMode = 0;

function hideTranscript() {
	$('.trancript-container').css('display','none');
}

function setQuizCompletion(){
	this.isQuizCompleted = true;
}

function setCompletion(sectionData,status){
	var sectionNum = sectionData.split("_")[0]	
	console.log('sectionNum '+sectionNum+'<status>'+status);
	if(this.statusObj[sectionNum] != "completed"){
		this.statusObj[sectionNum] = status;
	}
	if(!isLMS){
		return;
	}
	var _status = LMSSetValue("cmi.suspend_data", JSON.stringify(this.statusObj));
	LMSCommit();
	console.log("Saved status to LMS:"+_status+"::"+LMSGetValue("cmi.suspend_data"));
	var totalCompletedModules = 0;
	for(var _sectNum in this.statusObj){
		if(this.statusObj[_sectNum] == "completed"){
			totalCompletedModules++;
		}
	}
	if(totalCompletedModules == 12){
		_status = LMSSetValue("cmi.core.lesson_status","completed");
		LMSCommit();
		console.log("Setting LMS status to completed")
	}
}

function setVisitedState(index)
{
	statusObj[index] = 'visited';
}

function getVisitedState(index)
{
	return statusObj[index] == 'visited';
}

function setApplicationMode(index)
{
	currentMode = index;
}

function getApplicationMode(index)
{
	return currentMode;
}

function replayAudio(){
	console.log("Audio::"+this.currentAudio);
	//tour._getRootPlayer()
	var playerRef = this.frames[0].tour._getRootPlayer();
	for(var i in playerRef){
		if(i.indexOf("audio_") == 0){
			console.log("______i::"+i);
			if(playerRef[i].state){
				console.log("playerRef[i].state::"+playerRef[i].state);
				if(playerRef[i].Qt){
					if(playerRef[i].Qt.data.label == this.currentAudio){
						var audioRef = playerRef[i];
						audioRef.play();
					}
				}else if(playerRef[i].Rt){
					if(playerRef[i].Rt.data.label == this.currentAudio){
						var audioRef = playerRef[i];
						audioRef.play();
					}
				}else{
					for(var s in playerRef[i]){
						try {
							if(playerRef[i][s].data != null){
								if(playerRef[i][s].data.label){
									if(playerRef[i][s].data.label == this.currentAudio){
										var audioRef = playerRef[i];
										audioRef.play();
										return;
									}
								}
							}
						}
						catch (e) {
							console.log("Audio not found");
						}
					}
				}
				
			}
		}
	}
}


var isLMS = false;
function loadhtml(){
	loadJson();
	if(isLMS){
		var lmsResult = LMSInitialize();
		console.log("01 > LMSInitialize called - result = "+lmsResult)
		if(lmsResult == "true"){
			var lmsData = LMSGetValue("cmi.suspend_data");
			console.log('suspend_data received = ' + lmsData);
			if(LMSGetValue("cmi.core.lesson_status") != "completed"){
				var status = LMSSetValue("cmi.core.lesson_status","incomplete");
				LMSCommit();
				console.log("Setting LMS status to incomplete")
			}
			if(lmsData != ""){
				this.statusObj = JSON.parse(lmsData);
				console.log("03 > Revisit detected -  showing menu page");
				loadTopBand();
				if(this.statusObj["12"] != null && this.statusObj["12"] == "started" && this.statusObj["12"] != "completed"){
					navigateToQuiz();
				}else{
					showPopup("menu");
				}
			}else{
				console.log("03 > First visit detected -  showing splash page")
				showPopup("launch_page");
			}
		}else{
			alert("LMS not initialised")
			//showPopup("launch_page");
		}
	}else{
		console.log("01 > LMS mode not set -  showing splash page")
		showPopup("launch_page");
		loadTopBand();
		loadBottomBand();
	}
	
	
}
function loadIframe(sectionNum) {
	console.log("loadIframe::"+sectionNum)
	this.currentScene = sectionNum.split("_")[0];
	var mediaIndex = sectionNum.split("_")[1]
	if(this.frames[0].tour != null){
		var playerRef = this.frames[0].tour._getRootPlayer();
		playerRef.setMainMediaByIndex(mediaIndex-1)
	}else{
		document.getElementById('app-frame').src = "tour/section2/index.html?media="+mediaIndex;
	}
	loadTopBand();
	showMenuBtn();
}

function loadARFrame() {
	console.log("loadARFrame:: " + getApplicationMode());
	document.getElementById('app-frame').src = "ar.html";
	loadTopBand();
	$('.logo').remove();
	// showMenuBtn();
}

function unloadARFrame() {
	console.log("Unloading AR frame");
	document.getElementById('app-frame').src = "about:blank";
	$('.popup-container').addClass('popupBackgrnd');
}

function unloadSection(){
	document.getElementById('app-frame').src = "bg.html";//"assets/images/lauchBackgrnd.png";
}
function navigateToQuiz(){
	//alert("navigateToQuiz called...");
	hideTranscript();
	hideMenuBtn();
	$('.logo').removeClass('menuScale');
	document.getElementById('app-frame').src = "quiz/quiz.html";
}
function loadJson(){
	    var url = 'scripts/data.json';    			
		$.ajax({
			type: 'GET',
			url: url,
			async: false,
			jsonpCallback: 'callback',
			contentType: "application/json",
			dataType: 'json',
			success: function(json) {
					       objdata = json;
					    },
					    error: function(e) {
					       console.log(e.message);
					    }
		});
}
var onBeforeUnLoadEvent = false;
window.onunload = window.onbeforeunload = function(){
	if(!isLMS){
		return;
	}
	 if(!onBeforeUnLoadEvent){
		 onBeforeUnLoadEvent = true;
		 LMSCommit();
		 LMSFinish();
	 }
};