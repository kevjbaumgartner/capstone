/*
*    ArraysAtOne Capstone 2018 - Maple Leaf Foods
*
*    Kevin Baumgartner
*    Jesse Berube
*    Marc Harquail
*    Alex Ireland
*
* * * * * * * * * * * * * * * * * * * * * * * * *
*
*    indexScript.js
*    
*	 Jesse Berube
*    Marc Harquail
*
*/

window.onload = function(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var btnList = document.getElementById("btnList");
            var buttons = this.responseText;
            btnList.innerHTML = "";
            btnList.innerHTML = buttons;
        }
    };
    xmlhttp.open("GET", "./php/indexButtons.php", true);
    xmlhttp.send();
    updateButtons();
    liveUpdate();
    setTimeout(function() {
        checkSub();
    }, 100);
	sendNotif();
	runNotifs();
};

function checkSub(){
    var tempBtns = document.getElementsByClassName("newBtn");
    for (var i = 0; i < tempBtns.length; ++i) {
        var btnID = tempBtns[i].id;
        updateSub(btnID, i);
    }
}

function updateSub(btnID, index){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var subLbl = document.getElementsByClassName("newBtnTitleFav");
            if(this.responseText == "1"){
                subLbl[index].classList.remove("colorHidden");
                subLbl[index].classList.add("colorSubbed");
            }
            else if(this.responseText == "0"){
                subLbl[index].classList.remove("colorSubbed");
                subLbl[index].classList.add("colorHidden");
            }
            else{
                console.log(this.responseText);
            }
        }
    };
    xmlhttp.open("GET", "./php/indexCheckSub.php?uid=" + btnID, true);
    xmlhttp.send();
}

function updateButtons(){
    $.getJSON("../php/indexTemp.php", function(result){
            $.each(result, function(key, sensor){
                var currentBtnTemp = document.getElementsByClassName("newBtnDisplayText");
                var len = sensor.length;
                for (var i = 0; i < len; i++){
                    var uid = sensor[i].uid;
                    var temp = sensor[i].temp;
                    var status = sensor[i].status;
                    currentBtnTemp[i].innerHTML = temp + "&deg";
                    switch(status) {
                        case 1:
                            makeBtnSafe(i);
                            makeTempSafe(i);
                            makeMovementSafe(i);
                            break;
                        case 2:
                            makeBtnUnsafe(i);
                            makeTempUnsafe(i);
                            makeMovementSafe(i);
                            break;
                        case 3:
                            makeBtnUnsafe(i);
                            makeTempSafe(i);
                            makeMovementUnsafe(i);
                            break;
                        case 4:
                            makeBtnUnsafe(i);
                            makeTempUnsafe(i);
                            makeMovementUnsafe(i);
                            break;
                        default:
                            makeBtnSafe(i);
                            makeTempUnsafe(i);
                            makeMovementUnsafe(i);
                    }
                }
            });
    });
}
function makeBtnSafe(i){
    var currentBtn = document.getElementsByClassName("newBtn");
    currentBtn[i].classList.remove("bdrRed");
    currentBtn[i].classList.add("bdrWhite");
}

function makeBtnUnsafe(i){
    var currentBtn = document.getElementsByClassName("newBtn");
    currentBtn[i].classList.remove("bdrWhite");
    currentBtn[i].classList.add("bdrRed");
}

function makeTempSafe(i){
    var tempLbl = document.getElementsByClassName("newBtnDisplayText");
    var tempText = document.getElementsByClassName("newBtnTempText");
    var tempStatus = document.getElementsByClassName("btnTempStatus");
    var tempSymbol = document.getElementsByClassName("btnTempSymbol");
    tempLbl[i].classList.remove("colorUnsafe");
    tempLbl[i].classList.add("colorSafe");
    tempText[i].innerHTML = "Safe Temperature";
    tempStatus[i].classList.remove("colorUnsafe");
    tempStatus[i].classList.add("colorSafe");
    tempSymbol[i].classList.remove("fa-exclamation-circle");
    tempSymbol[i].classList.add("fa-check-circle");
}

function makeTempUnsafe(i){
    var tempLbl = document.getElementsByClassName("newBtnDisplayText");
    var tempText = document.getElementsByClassName("newBtnTempText");
    var tempStatus = document.getElementsByClassName("btnTempStatus");
    var tempSymbol = document.getElementsByClassName("btnTempSymbol");
    tempLbl[i].classList.remove("colorSafe");
    tempLbl[i].classList.add("colorUnsafe")
    tempText[i].innerHTML = "Unsafe Temperature";
    tempStatus[i].classList.remove("colorSafe");
    tempStatus[i].classList.add("colorUnsafe");
    tempSymbol[i].classList.remove("fa-check-circle");
    tempSymbol[i].classList.add("fa-exclamation-circle");
}

function makeMovementSafe(i){
    var moveText = document.getElementsByClassName("newBtnMotionText");
    var moveStatus = document.getElementsByClassName("btnMoveStatus");
    var moveSymbol = document.getElementsByClassName("btnMoveSymbol");
    moveText[i].innerHTML = "Movement Stable";
    moveStatus[i].classList.remove("colorUnsafe");
    moveStatus[i].classList.add("colorSafe");
    moveSymbol[i].classList.remove("fa-exclamation-circle");
    moveSymbol[i].classList.add("fa-check-circle");
}

function makeMovementUnsafe(i){
    var moveText = document.getElementsByClassName("newBtnMotionText");
    var moveStatus = document.getElementsByClassName("btnMoveStatus");
    var moveSymbol = document.getElementsByClassName("btnMoveSymbol");
    moveText[i].innerHTML = "Movement Unstable";
    moveStatus[i].classList.remove("colorSafe");
    moveStatus[i].classList.add("colorUnsafe");
    moveSymbol[i].classList.remove("fa-check-circle");
    moveSymbol[i].classList.add("fa-exclamation-circle");
}

function runNotifs(){
	setInterval(function(){
		sendNotif();
	},600000);
}

function sendNotif(){
	$.getJSON("../php/indexTemp.php", function(result){
		$.each(result, function(key, sensor){
		var currentBtnTemp = document.getElementsByClassName("newBtnDisplayText");
		var len = sensor.length;
			for (var i = 0; i < len; i++){
				var uid = sensor[i].uid;
				var temp = sensor[i].temp;
				var status = sensor[i].status;

				
				//Push.Permission.request(onGranted, onDenied);
			
			
				if(status == 2 || status == 4){
					Push.create("Arrays At One", {
						body: "Cabinet 1 Is Over The Temperature Threshold!",
						timeout: 5000,
						onClick: function() {
							window.open("https://www.arraysatone.com/cabinet.php?uid=0001203B");;
						}
					});
				}
			}
		});
	});
}

function liveUpdate(){
    setInterval(function(){
        updateButtons();
    },1000);
}

function btnClick(uid){
    window.location = 'cabinet.php?uid=' + uid;
}

