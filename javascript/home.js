function changeFlag1($flag)
{
	var image = document.getElementById('player1Flag');

	image.src = 'images/flags/' + $flag + '.png';
}

function changeFlag2($flag)
{
	var image = document.getElementById('player2Flag');

	image.src = 'images/flags/' + $flag + '.png';
}

function clearCookies()
{
	var expired = new Date();
	expired.setFullYear(2015);
	//var expired = new Date(today.getTime() - 24 * 3600 * 1000); // less 24 hours

	document.cookie = "player1Name = null; path=/; expires=" + expired.toGMTString();
	document.cookie = "player1Flag = null; path=/; expires=" + expired.toGMTString();
	document.cookie = "player2Name = null; path=/; expires=" + expired.toGMTString();
	document.cookie = "player2Flag = null; path=/; expires=" + expired.toGMTString();
}

function setCookies()
{
	var p1n = document.getElementById('pl1Name');
	var p2n = document.getElementById('pl2Name');

	var p1f = document.getElementById('sel1Flag');
	var p2f = document.getElementById('sel2Flag');

	var today = new Date();
  	var expiry = new Date(today.getTime() + 24 * 3600 * 1000); //one day

	document.cookie = "player1Name = " + p1n.value + "; path=/; expires = " + expiry.toGMTString();	
	document.cookie = "player2Name = " + p2n.value + "; path=/; expires = " + expiry.toGMTString();

	var temp1Flag = p1f
	if(p1f == "Select a house")
	{
		temp1Flag = "null";
	}

	var temp2Flag = p2f
	if(p2f == "Select a house")
	{
		temp2Flag = "null";
	}

	document.cookie = "player1Flag = " + temp1Flag.value + "; path=/; expires = " + expiry.toGMTString();
	document.cookie = "player2Flag = " + temp2Flag.value + "; path=/; expires = " + expiry.toGMTString();
}

 function getCookie(name)
 {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
 }

function getCookies()
{
	var p1 = document.getElementById('player1');

	var p1Name = getCookie("player1Name");
	var p1Flag = getCookie("player1Flag");
	
	p1.innerHTML = "Welcome, " + p1Name + " of house " + p1Flag + "<br/>" + "You have 5 turns left <br/>" + "Score: 0" ;

	var p2 = document.getElementById('player2');

	var p2Name = getCookie("player2Name");
	var p2Flag = getCookie("player2Flag");
	
	p2.innerHTML = "Welcome, " + p2Name + " of house " + p2Flag + "<br/>" + "You have 5 turns left <br/>" + "Score: 0" ;

}