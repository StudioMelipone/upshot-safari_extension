safari.self.addEventListener("message", handleMessage, false);

function handleMessage(msgEvent) {
	var message = msgEvent.name;
	var data = msgEvent.message;
	
	if(message === "shot") {
		if(window.top === self) {
			// Show screenshot and form
			setup_box_container(data);
			
			// add a listener on buttons
			var cancel = document.getElementById('upshot_safari_cancel');
			cancel.addEventListener('click', close_popup, false);

			var draft_submit = document.getElementById('Draft');
			draft_submit.addEventListener('click', submission, false);
		}
	} else if(message === "done"){
		
		var main = document.getElementById('upshot_safari_box');
		
		if(data==200  || data==201){
			main.style.color = "#166F28";
	    main.style.font = "Georgia bold 22px";
	    main.innerHTML = "Your upshot has been successfully <b>created</b>" ;
	    // Google analyticts
	    trackButton('draft');
		} else {
	    main.style.color = "#FF0000";
      main.innerHTML = xhr.status==0 ? "Barbie grosse menteuse !" : "An Error occured";
      // Google analyticts
      trackButton('error_on_draft');
		}
	} else if (message === "credentials"){
		// Setup credentials
		setup_box_container(data);
		
		// add listener on save button
		var save = document.getElementById('upshot_safari_settings_save');
		save.addEventListener('click', save_settings, false);
	} 
	
}

function setup_box_container(data){
	// Insert html data in web page
	var container = document.createElement('div');
	container.setAttribute('id', 'upshot_safari_box_container');
	container.innerHTML = data;
	document.body.appendChild(container);
}

function save_settings(){
	close_popup();
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

function submission(){
	// UX : WE ARE SENDING, PLEASE WAIT
	var img = document.getElementById('base64');
	var accounts = document.getElementById('accounts');
	var buttons = document.getElementById('buttons');
	var main = document.getElementById('upshot_safari_box');

	accounts.style.visibility = "hidden";
  accounts.style.display = "none";
	buttons.style.visibility = "hidden";
  buttons.style.display = "none";

	main.style.width = 200;
  var load = document.createElement("img");
  load.src = safari.extension.baseURI + "ajax-loader.gif";
  load.style.border = "none";

	var div = document.createElement("div");
  div.appendChild(load);
	div.appendChild(document.createTextNode(" Sending upshot..."));
	main.appendChild(div);
	safari.self.tab.dispatchMessage("upshot_safari_extension", "upshot");
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
function trackButton(button_name) {
  // _gaq.push(['_trackEvent', 'button_' + button_name, 'clicked']);
  
  if(button_name==='draft' || button_name==='error_on_draft'){
    setTimeout(function() {
      close_popup();
    }, 1500);
  }else{
    close_popup();
  }
  
}