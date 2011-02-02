safari.self.addEventListener("message", handleMessage, false);

function handleMessage(msgEvent) {
	var message = msgEvent.name;
	var data = msgEvent.message;
	
	if(message === "shot") {
		if(window.top === self) {
			// Insert html data in web page
			var container = document.createElement('div');
			container.setAttribute('id', 'upshot_safari_box_container');
			container.innerHTML = data;
			document.body.appendChild(container);
			
			// add a listener on buttons
			var cancel = document.getElementById('upshot_safari_cancel');
			cancel.addEventListener('click', close_popup, false);
			
			// add a listener on buttons
			var draft_submit = document.getElementById('Draft');
			draft_submit.addEventListener('click', submission, false);
		}
	}
	
}

    
function close_popup(){
	// close window
  container = document.getElementById('upshot_safari_box_container');
	if(container.parentNode){
		container.parentNode.removeChild(container);
	}
	
	// Send message to extension so it re-enable it
	safari.self.tab.dispatchMessage("upshot_safari_extension", "activate");
}


// ///////// 
// UPSHOT 
// /////////

function submission(){
  // Form submission by clicking the 'Draft' button
	
	close_popup();
}

// /////////////////
// GOOGLE ANALYTICS
// /////////////////

// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-8358011-13']);
// _gaq.push(['_trackPageview']);
// 
// (function() {
//   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//   ga.src = 'https://ssl.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();
// 
// function trackButton(button_name) {
//   _gaq.push(['_trackEvent', 'button_' + button_name, 'clicked']);
//   
//   if(button_name=='draft' || button_name=='error_on_draft'){
//     setTimeout(function() {
//       close_popup();
//     }, 1500);
//   }else{
//     close_popup();
//   }
//   
// };