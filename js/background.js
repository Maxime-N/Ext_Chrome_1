// var activation notification
var activationNotif;

// url api
var urlApi;

// store_code
var storeCode;

var notification;

// permet de récupérer la valeur de "activationNotif"
readEtat();

// pour récupérer l'url et le storeCode
readParametres();

// listener du clique sur icone extension
chrome.browserAction.onClicked.addListener(function (tab) {
    var page = "views/option.html";
	window.open(page, "Option Smart_Traffik");
});

// lance l'écoute de l'api réservations
function activationSetTimeOut(){

	notifications("Notifications actif", 0, "");

	setTimeout(reservations, 3000);

}

// appel au web service des reservations
function reservations(){

	if(activationNotif == 1){

			var url = urlApi+"/codeActivation/"+storeCode;

			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);

			xhr.onload = function (event) {
			    if (xhr.status === 200) {
			        // OK
			        var parser = new DOMParser();
        			var data = parser.parseFromString(xhr.response,'text/xml');

			        var clubs = data.getElementsByTagName('Clubs')[0];
			        var club = clubs.getElementsByTagName('Club')[0];
			        var ereservations = club.getElementsByTagName('ereservations')[0];
			        var nbrReservations = ereservations.childNodes[0].nodeValue;

			        if (nbrReservations != 0) {

				        // envoi le nombre de réservation en attente à la notification
				        closeNotification();
				        var txt;
				        if (nbrReservations == 1) {
				        	txt = " réservation en attente";
				        } else {
				        	txt = " réservations en attente";
				        }
				        notifications(nbrReservations+txt, 1, "http://dev.smart-traffik.com/accueil/login");

			        }

			        // exe la fonction reservation toute les 2min
			        setTimeout(reservations,120000);

			    } else {
			        // ERROR
			        console.error("Error: " + xhr.status);
			        alert("Erreur de connexion au service");
			    }
			};

			xhr.onerror = function (error) {
			    // ERROR
			    console.error("Error: " + error);
			}

			xhr.send();

	} else {

		activationNotif = 0;

	}

}

// permission de notifications
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted"){
    Notification.requestPermission();
	}
});


function notifications(txtAffiche, type, lien){
	if (Notification.permission !== "granted"){
	    Notification.requestPermission();
	} else {
	    notification = new Notification(txtAffiche, {
	      icon: '/images/faviconst.png',
	      //body: "",
	    });
	    if (type == 1){
	    	//setTimeout(notification.close.bind(notification), 119000);
	    	notification.onclick = function() {
				window.open(lien, "Smart_Traffik");	
			};
		} else {
			setTimeout(notification.close.bind(notification), 3000);
		}
	}
}

function closeNotification(){
	notification.close();
}

// permet de garder les valeurs saisi au lancement du navigateur
function readParametres(){
	chrome.storage.sync.get("url", function(data) {
		if (!chrome.runtime.error) {
			urlApi = data.url;
		}
	});

	chrome.storage.sync.get("storeCode", function(data) {
		if (!chrome.runtime.error) {
			storeCode = data.storeCode;
		}
	});
}

// permet de garder l'extension activé lors du lancement du navigateur
function readEtat(){
	chrome.storage.sync.get("etat", function(data) {
		if (!chrome.runtime.error) {
			activationNotif = data.etat;
			if(activationNotif == 1){
				activationSetTimeOut();
			}
		}
	});
}
