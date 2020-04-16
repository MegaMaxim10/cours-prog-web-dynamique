function valider(){
	var text = "<h1>Voici les données que vous avez entré</h1>"+
				"<table class=\"table\"><tr><th>Votre nom</th><th>Votre Email</th></tr>"+
				"<tr><td>"+document.newsletter.nom.value+"</td><td>"+document.newsletter.email.value+"</td></tr></table>";
	if(document.getElementById("overlay") == null){
		var overlay = document.createElement("div");
		overlay.id = "overlay";
		overlay.innerHTML = "<div id=\"overContent\"><a href=\"#\" class=\"close\" id=\"closer\">Fermer</a>"+text+"</div>";
		document.newsletter.appendChild(overlay);
		overlay.onclick = function(){close(); return false;};
		document.getElementById("closer").onclick = function(){close(); return false;};
	}else{
		var overlay = document.getElementById("overlay");
		overlay.innerHTML = "<div id=\"overContent\"><a href=\"#\" class=\"close\" id=\"closer\">Fermer</a>"+text+"</div>";
		overlay.style.display = "block";
		document.getElementById("closer").onclick = function(){close(); return false;};
	}
	return false;
}

function close(){
	document.getElementById("overlay").style.display = "none";
	return false;
}