function getMenuHTML(){
	var menuHTML = "<div id='menu'><div class='popup-close-btn' style='display: none;'></div><div class='menu-bottom-container'><div class='col-1'><div class='menu-btn-container' id='menuBtnContainer01'><div id='menuBtn01' class='menu-btn' data-id='0'></div></div><div class='menu-btn-container' id='menuBtnContainer02'><div id='menuBtn02' class='menu-btn' data-id='1'></div></div></div></div></div>";
	return menuHTML;
}

function assignMenuActions(){
	var menuBtnList = $('.popup-container').find('.menu-btn');
	var completedSections = 0;
	var totalSections = 11; 
	console.log("Status Obj::"+JSON.stringify(this.statusObj))
	for (var i=0;i<menuBtnList.length;i++){
		var sectionID = "section"+($(menuBtnList[i]).attr('data-id')).split("_")[0];
		console.log("Menu Btn ID::"+$(menuBtnList[i]).attr('id')+"::sectionID::"+sectionID)
		if(this.statusObj[sectionID] != null){
			console.log(sectionID+'::this.statusObj[sectionID]::'+this.statusObj[sectionID])
			var menuContainer = $(menuBtnList[i]).parent();
			menuContainer.find('.section-progress-indicator').removeClass().addClass('section-progress-indicator '+this.statusObj[sectionID]);
			$(menuBtnList[i]).removeClass().addClass('menu-btn '+this.statusObj[sectionID])
			if(this.statusObj[sectionID] == "started"){
				$(menuContainer).removeClass('disabled');
			}
		}
		if(this.statusObj[sectionID] == 'completed'){
			completedSections++;
			try{
				var menuContainerNext = $(menuBtnList[i+1]).parent();
				$(menuContainerNext).removeClass('disabled');
			}catch(e){

			}
		}
	}
	var percentCompletion = Math.round((completedSections*100)/totalSections);
	$('.popup-container').find("#progress_txt").html((percentCompletion<10 ? "0" + percentCompletion : percentCompletion)+"%");
	if(percentCompletion>99){
		$('.popup-container').find("#quizBtn").removeClass('disabled');		
	}
	if(this.isQuizCompleted || this.statusObj['section12'] == 'completed'){
		$('.popup-container').find("#quizBtn").removeClass('disabled')
		$('.popup-container').find("#quizBtn .section-progress-indicator").addClass("completed");	
	}
	$('.popup-container').find(".inner-bar").css('width', percentCompletion+'%')
	//$('.popup-container').find('.menu-btn:not(.completed)').on("click", function(){
	$('.popup-container').find('.menu-btn').on("click", function(){
		//if($(this).hasClass('completed')){return;};
		$(this).off();
		$('.logo').removeClass('menuScale');
		var index = parseInt($(this).attr('data-id'));
		menuButtonClickedHandler(index);
		
		var mode = getApplicationMode(index);
		var pageStr = mode > 0 ? "info_test" : "info_practice";
		
		var _menuBtnRef = this;
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.popup-container').addClass('popupBackgrnd');
				// $('.popup-container').removeClass('popupBackgrnd');
				// loadIframe($(_menuBtnRef).attr('data-id'));
				// console.log("pageStr: " + pageStr);
				showPopup(pageStr);
				// showPopup("help_popup_start");
		});		
	});
	/* $('.popup-container').find('.menu-btn').on("click", function(){
		//if($(this).hasClass('completed')){return;};
		$(this).off();
		$('.logo').removeClass('menuScale');
		var _menuBtnRef = this;
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
				$('.popup-container').removeClass('popupBackgrnd');
				loadIframe($(_menuBtnRef).attr('data-id'));			
		});		
	}); */
	$('.popup-container').find('#quizBtn').on("click", function(){
		if($(this).hasClass('disabled')){return;};
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
				$('.popup-container').removeClass('popupBackgrnd');
				navigateToQuiz();		
		});	
			
	})
	// $('.popup-container').find("#quizBtn").removeClass('disabled');
}

function menuButtonClickedHandler(index)
{
	setVisitedState(index);
	setApplicationMode(index);
}