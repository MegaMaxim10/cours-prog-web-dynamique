function ajax(){
	if(window.XMLHttpRequest){
		var xhr = new XMLHttpRequest();
		xhr.open("get", "response.txt", true);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4 && xhr.status == 200){
				document.querySelector("#response").innerHTML = xhr.responseText;
			}
		}
		xhr.send(null);
	}else{
		if(window.ActiveXObject){
			var xhr = new ActiveXObject("Microsoft.XMLHTTP");
			// Reprendre les lignes 4 à 10
		}else{
			alert("Votre navigateur ne peut pas envoyer des requêtes HTTP via XHR");
		}
	}
	return false;
}