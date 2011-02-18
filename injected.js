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
		if(data==201){
			if(main!=null){
				main.style.color = "#166F28";
		    main.style.font = "Georgia bold 22px";
		    main.innerHTML = "Your upshot has been successfully <b>created</b>" ;
		    // Google analyticts
		    trackButton('draft');
			}
		} else {
			if(main!=null){
		    main.style.color = "#FF0000";
	      main.innerHTML = "An Error occured";
	      // Google analyticts
	      trackButton('error_on_draft');
			}
		}
	} else if (message === "credentials"){
		// Setup credentials
		setup_box_container(data);
		
		// add listener on save button
		var login = document.getElementById('upshot_safari_login');
		login.addEventListener('click', go_to_upshot_login, false);
		
		var close = document.getElementById('upshot_safari_close');
		close.addEventListener('click', close_popup, false);
	} 
	
}

function setup_box_container(data){
	// Insert html data in web page
	var container = document.createElement('div');
	container.setAttribute('id', 'upshot_safari_box_container');
	container.innerHTML = data;
	document.body.appendChild(container);
}

function go_to_upshot_login(){
		safari.self.tab.dispatchMessage("upshot_login", "");
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
	var select = document.getElementById('upshot_safari_select');
	var subdomain = select.options[select.selectedIndex].value

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
	safari.self.tab.dispatchMessage("upshot_safari_submission", subdomain);
}


// /////////////////
// GOOGLE ANALYTICS
// /////////////////

var upshot_safari_gaq = upshot_safari_gaq || [];
upshot_safari_gaq.push(['_setAccount', 'UA-8358011-13']);
upshot_safari_gaq.push(['_trackPageview']);

(function() {
  var upshot_safari_ga = document.createElement('script'); upshot_safari_ga.type = 'text/javascript'; upshot_safari_ga.async = true;
  upshot_safari_ga.src = 'https://ssl.google-analytics.com/ga.js';
  var upshot_safari_s = document.getElementsByTagName('script')[0]; upshot_safari_s.parentNode.insertBefore(upshot_safari_ga, upshot_safari_s);
})();

function trackButton(button_name) {
  upshot_safari_gaq.push(['_trackEvent', 'button_' + button_name, 'clicked']);
  
  if(button_name==='draft' || button_name==='error_on_draft'){
    setTimeout(function() {
      close_popup();
			if(button_name==='error_on_draft'){
				safari.self.tab.dispatchMessage("upshot_safari_credentials", "");
			}
    }, 1500);
  }else{
    close_popup();
  }
  
}