function showPopup(popID, popupParam){
	var oScope = this;
	$('.logo').removeClass('menuScale');
	console.log("Popup called. id: " + popID);
	//alert("Popup called from tour with id:"+popID+'currentaud'+this.currentAudio);
	var popHTML;
	/* if(popID.indexOf('didyouknow') == 0 || popID.indexOf('info') == 0 || popID.indexOf('insight') == 0){
		for (var i = 0; i < oScope.objdata.popup_data.length; i++) {
			if(popID == oScope.objdata.popup_data[i].id){
				console.log("popID::"+popID +"== oScope.objdata.popup_data[i].id ::" +oScope.objdata.popup_data[i].id);
				var image = oScope.objdata.popup_data[i].image;
				var txt = oScope.objdata.popup_data[i].popupText;
				var popCls = oScope.objdata.popup_data[i].popupClass;
				var strImg = "";
				if(image.indexOf(",")>-1){	
					console.log("image--"+image)
					strImg+="<div class='slideshow-container'><div class='ss_prev_btn disabled'></div><div class='ss_img_container'>"
					var allImages = image.split(",");
					console.log("allImages--"+allImages)
					for(var j=0;j<allImages.length;j++){
						var img = allImages[j];
						strImg+="<img id='image"+(j+1)+"' class='popupImg' src='"+img+"' style='display:none;'/>"
					}
					strImg+="</div><div class='ss_next_btn'></div></div>"
				}else{
					strImg+="<img class='popupImg' src='"+image+"'/>";
				}
				console.log("strImg--"+strImg)
				popHTML = "<div id='"+popID+"' class='popupBackgrndWithImage "+popCls+"'><div class='popup-close-btn'></div>"+strImg+"<div class='popup_txt'>"+txt+"</div></div>";
			}
		}
	}else if(popID.indexOf('aud_') == 0){
		oScope.showTranscript(popID);
		return;
	}else if(popID.indexOf("vid") == 0){
		console.log('inside video popup')
		var _idx = parseInt(popID.split("vid").join(""));
		console.log("_idx:::"+_idx);
		var _popupID = oScope.objdata.video_data[_idx].id;
		var _popupLabel = oScope.objdata.video_data[_idx].label;
		var _vidSrc = oScope.objdata.video_data[_idx].source;
		 popHTML = "<div id='"+_popupID+"' class='popupVideocls'><div class='popup-close-btn'></div><video class='videoCls' id='"+_popupLabel+"' preload autoplay='true' controls><source src='"+_vidSrc+"' type='video/mp4'></video></div>";
		console.log("popHTML:::"+popHTML);
	}else */ if(popID == "menu"){
		hideMenuBtn();
		popHTML = getMenuHTML();
		// $('.logo').addClass('menuScale');
	}else if(popID == "endMenu"){	
		hideMenuBtn();
		popHTML = getMenuHTML();
		$('.logo').addClass('menuScale');
		unloadSection();
	}else if(popID == "3d_anim01"){
		popHTML = "<div id='anim01'><div class='popup-close-btn'></div><video id='testimonial03' preload autoplay='true' controls><source src='assets/videos/sc_virtualTour_receiving_of_potatoes.mp4' type='video/mp4'></video></div>";
	}else if(popID == "map_popup"){
		popHTML = "<div id='map_popup'><div class='popup-close-btn'></div></div>";
	}else if(popID.indexOf("chester") == 0){
		// popHTML = getMascotHTML(this.currentScene);	
		//alert("this.currentScene::"+this.currentScene)
		// $('.popup-container').addClass('chester '+popID);
	}else if(popID == "progress_popup"){
		popHTML = "<div id='progress_popup'><div class='popup-close-btn'></div></div>";		
	}else if(popID == "help_popup"){
		popHTML = "<div id='help_popup'><img src='assets/images/Popup_Help.png'/><div class='popup-close-btn'></div></div>";		
	}else if(popID == "help_popup_start"){
		hideMenuBtn();
		popHTML = "<div id='help_popup_start' class=''><img src='assets/images/scr_02_cha_callout.png'/><div class='popup-next-btn'></div></div>";
	}else if(popID == "info_practice"){
		console.log("display info_practice");
		hideMenuBtn();
		popHTML = "<div id='info_popup' class=''><img src='assets/images/pop_cha_fire_alert.png'/><div class='popup-next-btn'></div></div>";
	}else if(popID == "info_test"){
		hideMenuBtn();
		popHTML = "<div id='info_popup' class=''><img src='assets/images/pop_cha_fire_alert_2.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "practice_failure_popup"){
		hideMenuBtn();
		popHTML = "<div id='session_feedback_popup' class=''><img src='assets/images/scr_fail_feedback_cha.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "practice_success_popup"){
		hideMenuBtn();
		popHTML = "<div id='session_feedback_popup' class=''><img src='assets/images/scr_pass_feedback_cha.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "test_timeout_popup"){
		hideMenuBtn();
		popHTML = "<div id='session_feedback_popup' class=''><img src='assets/images/scr_timeout_cha_01.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "test_failure_partial_popup"){
		hideMenuBtn();
		popHTML = "<div id='session_feedback_popup' class=''><img src='assets/images/scr_timeout_cha_02.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "test_failure_popup"){
		hideMenuBtn();
		popHTML = "<div id='session_feedback_popup' class=''><img src='assets/images/scr_fail_feedback_test.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "test_success_popup"){
		hideMenuBtn();
		popHTML = "<div id='session_feedback_popup' class=''><img src='assets/images/scr_pass_feedback_test.png'/><div class='popup-next-btn'></div></div>";
	}
	else if(popID == "launch_page"){
		popHTML = "<div id='launch_page'><div id='IntroText'><button id='launchBtn'></button></div></div>";
	}else if(popID == "intro_video"){
		popHTML = "<div id='intro_video' class='popupVideocls introVideo'><div class='popup-close-btn'></div><video class='videoCls' id='introVideo' preload autoplay='true' controls><source src='assets/videos/VR_Intro_Video.mp4' type='video/mp4'></video></div>";
	}else if(popID.indexOf("carousel") == 0){
		console.log('inside carousel popup::'+popID);
		var numSlides = 0;
		for (var i = 0; i < oScope.objdata.popup_data.length; i++) {
			if(popID == oScope.objdata.popup_data[i].id){
				console.log("popID::"+popID +"== oScope.objdata.popup_data[i].id ::" +oScope.objdata.popup_data[i].id);
				var popCls = oScope.objdata.popup_data[i].popupClass;
				var popCls = oScope.objdata.popup_data[i].popupClass;
				var strSlides = "";
				var slides = oScope.objdata.popup_data[i].slides;
				strSlides+="<div class='slideshow-container'><div class='ss_prev_btn disabled'></div><div class='ss_slides_container'>"
				numSlides = slides.length;
				for(var j=0;j<slides.length;j++){
					var img = slides[j].image;
					var txt = slides[j].popupText;
					strSlides+="<div id='slide"+(j+1)+"' class='carousel_slide' style='display:none;'><img id='image"+(j+1)+"' class='popupImg' src='"+img+"''/><div class='popup_txt'>"+txt+"</div></div>"
				}
				break;
			}
		}
		var dotsHTML = "<div class='dots_container'>"
		for(var d=0;d<numSlides;d++){
			dotsHTML+="<div class='dots' id='dot"+(d+1)+"'></div>"
		}
		dotsHTML += "</div>"
		strSlides+="</div>"+dotsHTML+"<div class='ss_next_btn'></div></div>"
		console.log("strSlides--"+strSlides)
		popHTML = "<div id='"+popID+"' class='popup_carousel "+popCls+"'><div class='popup-close-btn'></div>"+strSlides+"</div>";
		console.log("popHTML:::"+popHTML);
	}
	var oScope = this;
	$('.popup-container').empty().append($(popHTML));	
	$('.popup-container').fadeIn();
	$('.popup-container').find('.popup-close-btn').on('click', function(){
		$(this).off();
		$('.logo').removeClass('menuScale');
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').removeClass().addClass('popup-container')
			showMenuBtn();
		});
	})
	if(popID.indexOf('vid') == 0){
		var videoRef = $('.popup-container').find('video');
		$(videoRef).on('ended', function(){
			$(videoRef).css('cursor', "pointer")
			$(videoRef).on('click',function(){
				$(videoRef).off('click');
				$(videoRef)[0].currentTime = 0;
				//$(videoRef)[0].play();
				$(this).get(0).currentTime = 0;
				$(this).get(0).play();
				$(videoRef).trigger('play');
				$(videoRef).css('cursor', "default");
				setTimeout(function(){
					$(videoRef)[0].play();
				},500);
			})
		});
	}
	$('.popup-container').removeClass('menu-bg');
	// if(popID.indexOf("chester") == 0){
		// $('#chester01 .callout-panel').addClass(popID);	
		// showMascot(popID);
	// }else 
		if(popID == "menu" || popID == "endMenu"){
		$('.popup-container').off('click');
		if(popupParam && popupParam == 'isPopup'){
			$('.popup-container').find('.popup-close-btn').show();
		}else{
			$('.popup-container').find('.popup-close-btn').hide();
			$('.popup-container').addClass('menu-bg');
		}
		assignMenuActions();
	}
	
	if(popID.indexOf('didyouknow') == 0 || popID.indexOf('info') == 0){
		if($('.popup-container').find('.slideshow-container').length !== 0){
			$('.ss_img_container').children().first().show();
		}
		$('.ss_prev_btn').on("click",function(){
			if($(this).hasClass('disabled')){return;}
			$('.ss_next_btn').removeClass('disabled');
			var _currentChild = $('.ss_img_container').find('.popupImg:visible')
			var _currentChildIndex = _currentChild.index();
			var _prevChildIndex = _currentChildIndex - 1;
			var _prevChild = $('.ss_img_container').children().eq(_prevChildIndex);
			_currentChild.hide();
			_prevChild.show();
			if(_prevChildIndex <= 0){
				$('.ss_prev_btn').removeClass('disabled').addClass('disabled');
			}			
		});
		$('.ss_next_btn').on("click",function(){
			if($(this).hasClass('disabled')){return;}
			$('.ss_prev_btn').removeClass('disabled');
			var _currentChild = $('.ss_img_container').find('.popupImg:visible')
			var _currentChildIndex = _currentChild.index();
			var _totalChildren = $('.ss_img_container').children().length;
			var _nextChildIndex = _currentChildIndex + 1;
			var _nextChild = $('.ss_img_container').children().eq(_nextChildIndex);
			_currentChild.hide();
			_nextChild.show();
			if(_nextChildIndex >= (_totalChildren-1)){
				$('.ss_next_btn').removeClass('disabled').addClass('disabled');
			}			
		});
	}

	if(popID.indexOf('carousel') == 0){
		if($('.popup-container').find('.slideshow-container').length !== 0){
			$('.ss_slides_container').children().first().show();
		}
		$('.popup_carousel .ss_prev_btn').on("click",function(){
			if($(this).hasClass('disabled')){return;}
			$('.ss_next_btn').removeClass('disabled');
			var _currentChild = $('.ss_slides_container').find('.carousel_slide:visible')
			var _currentChildIndex = _currentChild.index();
			var _prevChildIndex = _currentChildIndex - 1;
			var _prevChild = $('.ss_slides_container').children().eq(_prevChildIndex);
			_currentChild.hide();
			_prevChild.show();
			if(_prevChildIndex <= 0){
				$('.ss_prev_btn').removeClass('disabled').addClass('disabled');
			}			
		});
		$('.popup_carousel .ss_next_btn').on("click",function(){
			if($(this).hasClass('disabled')){return;}
			$('.ss_prev_btn').removeClass('disabled');
			var _currentChild = $('.ss_slides_container').find('.carousel_slide:visible')
			var _currentChildIndex = _currentChild.index();
			var _totalChildren = $('.ss_slides_container').children().length;
			var _nextChildIndex = _currentChildIndex + 1;
			var _nextChild = $('.ss_slides_container').children().eq(_nextChildIndex);
			_currentChild.hide();
			_nextChild.show();
			if(_nextChildIndex >= (_totalChildren-1)){
				$('.ss_next_btn').removeClass('disabled').addClass('disabled');
			}			
		});
	}

	$('#launchBtn').on("click", function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').addClass('popupBackgrnd');
			$('.logo').remove();
			// showPopup('intro_video');
			// showPopup('help_popup_start');
			oScope.showPopup("menu");
		});		
	})	
	$('.popup-container').find('#intro_video .popup-close-btn').on('click', function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').addClass('popupBackgrnd');
			oScope.showPopup("help_popup_start");
		});
	})
	// $('.popup-container').find('#help_popup_start .popup-close-btn').on('click', function(){
	$('.popup-container').find('#help_popup_start .popup-next-btn').on('click', function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			oScope.showPopup("menu");
		});
	})
	
	$('.popup-container').find('#info_popup .popup-next-btn').on('click', function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').removeClass('popupBackgrnd');
			loadARFrame();
			updateInstruction();
		});
	})
	$('.popup-container').find('#session_feedback_popup .popup-next-btn').on('click', function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').addClass('popupBackgrnd');
			unloadARFrame();
			oScope.showPopup("menu");
		});
	})
	/* $('.popup-container').find('#info_test .popup-next-btn').on('click', function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').removeClass('popupBackgrnd');
			loadARFrame();
		});
	}) */
	
}
function closeAllPopups(){
	$('.popup-container').empty();
	$('.popup-container').removeClass().addClass('popup-container');
	$('.trancript-container').empty().hide();
}


function showTranscript(audID){
	var oScope = this;
	for (var i = 0; i < oScope.objdata.transcript_data.length; i++) {
		if(audID == oScope.objdata.transcript_data[i].id){
			if(audID.indexOf("_char_") == -1){
				var txt = oScope.objdata.transcript_data[i].popupText;
				popHTML = "<div id='"+audID+"' class='popupTranscript'><div class='popup-close-btn'></div><div class='transpopup_txt'>"+txt+"</div></div>";
				//$('.trancript-container').addClass('transcript');
			}else{
				var txt = oScope.objdata.transcript_data[i].popupText;
				popHTML = "<div id='"+audID+"' class='avatarTranscript'><div class='popup-close-btn'></div><div class='transpopup_txt'>"+txt+"</div></div>";				
			}
		}
	}
	$('.trancript-container').empty().append($(popHTML));	
	$('.trancript-container').fadeIn();
	$('.trancript-container').find('.popup-close-btn').on('click', function(){
		$(this).off();
		$('.trancript-container').fadeOut(100, function(){
			$('.trancript-container').empty();
		});
	})

	$('.trancript-container').on('click', function(){
			$('.trancript-container').off('click');
			$('.trancript-container').fadeOut("slow", function(){
				$('.trancript-container').empty();
				//$('.trancript-container').removeClass('transcript');
			});				
	});
}
