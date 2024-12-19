function loadTopBand(){
	var oScope=this;
	var topBandHTML = "<div class='logo'></div><div class='stepsContainer'><div class='stepsImg'></div><div class='stepsLabel'></div></div><div class='timer'></div><div class='clock'><div class='minutesContainer'><div class='minutes'></div></div><div class='divider'>:</div><div class='secondsContainer'><div class='seconds'></div></div></div>"
	$('.top-band').html(topBandHTML);

	

	$('.top-right-menu-container').click(function(e) {
		$('.expand-panel').toggle();	 	
	});

	$('.top-band').find('.collapseBtn').on("click", function(){	
		$('.expand-panel').toggle();
	})

	$('.top-band').find('.mapBtn').on("click", function(){	
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			oScope.hideTranscript();
			//oScope.showPopup('map_popup');
			oScope.showMenu("isPopup");
			$('.expand-panel').toggle();
		});
		
	})

	$('.top-band').find('.helpBtn').on("click", function(){
	
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			oScope.showPopup('help_popup');
			$('.expand-panel').toggle();
		});
		
	})

	$('.popup-container').find('.popup-close-btn').on('click', function(){
		$(this).off();
		$('.popup-container').fadeOut(100, function(){
			$('.popup-container').empty();
			$('.expand-panel').toggle();

		});
	})

	
	
}
function showMenuBtn(){
	$('.top-band').find('.top-right-menu-container').show();
}
function hideMenuBtn(){
	$('.top-band').find('.top-right-menu-container').hide();
}

function showMenu(param){
	hideMenuBtn();
	if(param){
		showPopup("menu", param);
	}else{
		showPopup("menu");
	}
}
//

var instructions = ['../assets/images/tooltip_step_01.png', '../assets/images/tooltip_step_02.png', '../assets/images/tooltip_step_03.png', '../assets/images/tooltip_step_04.png'];
var stepsLabels = ['../assets/images/img_p_tooltip.png', '../assets/images/img_a_tooltip.png', '../assets/images/img_s1_tooltip.png', '../assets/images/img_s2_tooltip.png'];
var instructionIndex = 0;

function loadBottomBand()
{
	var oScope=this;
	var bottomBandHTML = "<div class='instruction'><div class='instructionImg'></div></div>";
	// var bottomBandHTML = "<img class='instructionImg'></img>";
	$('.bottom-band').html(bottomBandHTML);
}

function updateInstruction()
{
	// $('.top-band').css('display', 'block');
	$('.stepsContainer').css('display', 'block');
	$('.timer').css('display', 'block');
	$('.clock').css('display', 'flex');
	// console.log("updateInstruction called..");
	if (getApplicationMode() != 0)
	{
		$('.instructionImg').css('display', 'none');
		$('.stepsLabel').css('display', 'none');
		// $('.timer').css('display', 'block');
		// $('.clock').css('display', 'flex');
		// $('.instructionImg').css('display', 'none');
		// return;
	}
	else
	{
		$('.instructionImg').css('display', 'block');
		$('.stepsLabel').css('display', 'inline-block');
	}
	
	if (instructionIndex < instructions.length)
	{
		// $('.instructionImg').attr('src', instructions[instructionIndex]);
		$('.instructionImg').css('background', 'url('+instructions[instructionIndex]+')');
		$('.stepsLabel').css('background', 'url('+stepsLabels[instructionIndex]+')');
		$('.stepsImg').css('width', (110 + (100 * instructionIndex)) + 'px');
		++instructionIndex;
	}
	else
	{
		resetARUI();
		
		// $('.instructionImg').src = "";
		/* $('.instructionImg').css('background', 'url()');
		$('.instructionImg').css('display', 'none');
		$('.stepsContainer').css('display', 'none');
		// $('.top-band').css('display', 'none');
		$('.timer').css('display', 'none');
		$('.clock').css('display', 'none');
		instructionIndex = 0; */
	}
}

function resetARUI()
{
	$('.instructionImg').css('background', 'url()');
	$('.instructionImg').css('display', 'none');
	$('.stepsContainer').css('display', 'none');
	// $('.top-band').css('display', 'none');
	$('.timer').css('display', 'none');
	$('.clock').css('display', 'none');
	instructionIndex = 0;
}

function getInstructionIndex()
{
	return instructionIndex;
}

function getInstructionLimit()
{
	return instructions.length;
}





