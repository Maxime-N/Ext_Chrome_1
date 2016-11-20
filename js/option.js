// listener btnAuth
var btnAuth = document.getElementById('submitOption');
btnAuth.addEventListener('click', etatBouton);

// id text etat
var txtEtat = document.getElementById('etatOption');

// id zone saisi
var zoneUrlApi = document.getElementById("urlOption");
var zoneStoreCode = document.getElementById("store_codeOption");

var txtUrlApi;
var txtStoreCode;

var couleurArret = "#B53A1E";
var couleurActive = "#1F751F";

// récupère la valeur du bouton
var etat = chrome.extension.getBackgroundPage().activationNotif;
if( etat == 1 ){		
		btnAuth.innerHTML = "Arreter";
		txtEtat.innerHTML = "Notifications Actif";
		// récupère l'url et le store_code
		var recupUrlApi = chrome.extension.getBackgroundPage().urlApi;
		var recupStoreCode = chrome.extension.getBackgroundPage().storeCode;
		zoneUrlApi.value = recupUrlApi;
		zoneStoreCode.value = recupStoreCode;

		// change la couleur des txt		
		btnAuth.style.color = couleurArret;
		txtEtat.style.color = couleurActive;
} else {
		btnAuth.innerHTML = "Activer";
		txtEtat.innerHTML = "Notifications Inactif";
	
		btnAuth.style.color = couleurActive;
		txtEtat.style.color = couleurArret;
}


function etatBouton(){

	etat = chrome.extension.getBackgroundPage().activationNotif;

	txtUrlApi = zoneUrlApi.value;
	txtStoreCode = zoneStoreCode.value;

	//champUrlApi = "https://rcbt.smart-traffik.net/api/product-locator/get-ereservations";
	//champStoreCode = "4000417";

	if(etat == 0){
		
		if ((txtUrlApi != "")&&(txtStoreCode != "")) {
			btnAuth.innerHTML = "Arreter";
			txtEtat.innerHTML = "Notifications Actif";
			etat = 1;
			chrome.extension.getBackgroundPage().activationNotif = etat;
			sauvEtat(etat);
			monitoringApi();
			// change la couleur du bouton
			btnAuth.style.color = couleurArret;
			txtEtat.style.color = couleurActive;
		} else {
			alert("Vous devez remplir les 2 champs");
		}

	} else {

		btnAuth.innerHTML = "Activer";
		txtEtat.innerHTML = "Notifications Inactif";
		etat = 0;
		chrome.extension.getBackgroundPage().activationNotif = etat;
		sauvEtat(etat);
		chrome.extension.getBackgroundPage().notifications("Arret Notifications", 0, "");
		chrome.extension.getBackgroundPage().urlApi = "";
		chrome.extension.getBackgroundPage().storeCode = "";
		txtUrlApi = "";
		txtStoreCode = "";
		sauvParametres(txtUrlApi, txtStoreCode);
		btnAuth.style.color = couleurActive;
		txtEtat.style.color = couleurArret;

	}

}


function monitoringApi(){

	chrome.extension.getBackgroundPage().urlApi = txtUrlApi;
	chrome.extension.getBackgroundPage().storeCode = txtStoreCode;

	sauvParametres(txtUrlApi, txtStoreCode);

	chrome.extension.getBackgroundPage().activationSetTimeOut();

}


function option(){

	var page = "option.html";
	window.open(page, "Option Smart_Traffik");

}


function sauvParametres(urlApi, storeCode){
	var parametres = {};
	parametres['url'] = urlApi;
	parametres['storeCode'] = storeCode;	

	chrome.storage.sync.set(parametres, function () {
        console.log('Saved');
    });

}

function sauvEtat(activ){
	var activation = {}; 
	activation['etat'] = activ;
	
	chrome.storage.sync.set(activation, function () {
        console.log('Saved');
    });

}
