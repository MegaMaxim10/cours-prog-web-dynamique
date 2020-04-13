var result = 0;
var screen = null;
var memScreen = null;
var calcID = "";
var binOp = null;
var clsscr = false;
var eval = false;
var memory = null;

function digitEntered(event, digit){
	if(!digit)
		digit = this.getAttribute("value");
	if((screen.innerHTML.length == 1 && screen.innerHTML === "0") || clsscr){
		screen.innerHTML = digit;
		eval = true;
	}else{
		if((screen.innerHTML).length < 20){
			screen.innerHTML = screen.innerHTML+""+digit;
			eval = true;
		}
	}
	clsscr = false;
	return false;
}

function unaryOperatorTrigered(event, op){
	var val = parseFloat(screen.innerHTML.replace(",", "."));
	if(screen.innerHTML === "Error"){
		val = 0;
	}
	if(!op)
		op = this.getAttribute("value");
	if(op === "+/-"){
		val = -val;
		screen.innerHTML = (val+"").replace(".", ",");
	}
	if(op === "." || op === ","){
		if(screen.innerHTML.indexOf(",") == -1 && (screen.innerHTML).length < 20)
			screen.innerHTML = screen.innerHTML+",";
	}
	if((op === "<---" || op === "Delete") && val !== 0){
		if(val > -10 && val < 10)
			screen.innerHTML = "0";
		else
			screen.innerHTML = screen.innerHTML.substring(0, screen.innerHTML.length - 1);
	}
	if(op === "C" || op === "c"){
		screen.innerHTML = "0";
	}
	if(op === "CA" || op === "Escape" || op === "z" || op === "Z"){
		screen.innerHTML = "0";
		result = 0;
		binOp = null;
		eval = false;
		clsscr = false;
	}
	if(op === "M" || op === "m"){
		if(screen.innerHTML !== "Error"){
			memory = screen.innerHTML;
			memScreen.innerHTML = "M";
		}
	}
	if(op === "RM" || op === "R" || op === "r"){
		if(memory != null){
			screen.innerHTML = memory;
			eval = true;
		}
	}
	if(op === "CM" || op === "E" || op === "e"){
		memory = null;
		memScreen.innerHTML = "";
	}
	if(op === "=" || op === "Enter"){
		if(eval){
			var val = parseFloat(screen.innerHTML.replace(",", "."));
			if(binOp === "+"){
				val += result;
			}
			if(binOp === "-"){
				val = result - val;
			}
			if(binOp === "*"){
				val *= result;
			}
			if(binOp === "/"){
				if(val == 0){
					val = "Error";
					eval = false;
					binOp = null;
					clsscr = true;
				}
				else
					val = result / val;
			}
			result = val;
			eval = false;
		}
		screen.innerHTML = (result+"").replace(".", ",");
		if(result === "Error")
			result = 0;
		binOp = null;
		clsscr = true;
	}
	return false;
}

function binaryOperatorTrigered(event, op){
	var val = parseFloat(screen.innerHTML.replace(",", "."));
	if(screen.innerHTML === "Error"){
		val = 0;
	}
	if(!op)
		op = this.getAttribute("value");
	if(eval){
		if(binOp === "+"){
			val += result;
		}
		if(binOp === "-"){
			val = result - val;
		}
		if(binOp === "*"){
			val *= result;
		}
		if(binOp === "/"){
			if(val == 0){
				val = "Error";
				eval = false;
				binOp = null;
				clsscr = true;
			}
			else
				val = result / val;
		}
	}
	result = val;
	screen.innerHTML = (result+"").replace(".", ",");
	if(result === "Error")
		result = 0;
	binOp = op;
	clsscr = true;
	eval = false;
}

function init(calcId){
	var init = false;
	if(document.getElementById(calcId)){
		calcID = calcId;
		screen = document.querySelector("#"+calcId+" .screen");
		memScreen = document.querySelector("#"+calcId+" .mem_screen");
		var digits = document.querySelectorAll("#"+calcId+" .digit");
		for(i = 0; i < digits.length; i++)
			digits[i].onclick = digitEntered;
		var unaOps = document.querySelectorAll("#"+calcId+" .una_op");
		for(i = 0; i < unaOps.length; i++)
			unaOps[i].onclick = unaryOperatorTrigered;
		var binOps = document.querySelectorAll("#"+calcId+" .bin_op");
		for(i = 0; i < binOps.length; i++)
			binOps[i].onclick = binaryOperatorTrigered;
		init = true;
		document.onkeyup = keyboardListener;
	}
	if(!init)
		alert("Could not init the MIU Calculator "+calcId);
}

function keyboardListener(event){
	var code = event.keyCode;
	var numb = parseInt(event.key, 10);
	if(!isNaN(numb)){
		digitEntered(event, numb);
		return;
	}
	if(event.key == '+' || event.key == '/' || event.key == '-' || event.key == '*'){
		binaryOperatorTrigered(event, event.key);
		return;
	}
	if(event.key == 'M' || event.key == 'm' || event.key == 'R' || event.key == 'r' || 
	   event.key == 'C' || event.key == 'c' || event.key == 'E' || event.key == 'e' ||
	   event.key == '.' || event.key == ',' || event.key == 'Z' || event.key == 'z' || 
	   event.key == '=' || event.key == 'Enter' || event.key == 'Delete' || event.key == 'Escape'){
		unaryOperatorTrigered(event, event.key);
		return;
	}
}