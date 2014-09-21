Crawler = {
	States: [],
	Catas: [],
	Queue: [],
	SelectedCatas: [],
    Init: function () {
		document.body.style.overflow = "auto";
		Crawler.Queue[0] = 1;
		Crawler.SelectedCatas[0] = 1;

	    var url = "get-cities.php";
		var http = new XMLHttpRequest();
		http.open("POST", url, true);
		http.onreadystatechange = function () {
			if (http.readyState == 4) 
			{
				document.getElementById("stateContainer").innerHTML = "";
				var temp = http.responseText.split("|");
				for(var i = 0; i < temp.length-1; i++)
				{
					Crawler.States[i] = temp[i].split(",");
					Crawler.MakeExpander(i);
				}
			}
		}
		http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		http.send();
		
		var url2 = "get-categories.php";
		var http2 = new XMLHttpRequest();
		http2.open("POST", url2, true);
		http2.onreadystatechange = function () {
			if (http2.readyState == 4) 
			{
				document.getElementById("cataContainer").innerHTML = "";
				var temp = http2.responseText.split("|");
				for(var i = 0; i < temp.length-1; i++)
				{
					Crawler.Catas[i] = temp[i].split(",");
					Crawler.MakeCataExpander(i);
				}
				document.getElementById("cataContainer").innerHTML += '<div id="queryContainer" class="other"><input type="search" id="query" class="query"></div><div id="priceContainer" class="other">price:<input id="min_price" class="price"><input id="max_price" class="price"><br>(where applicable)</div><div id="searchContainer" class="other"><input type="button" class="search" onClick="Crawler.Search();" value="Search"></div>';
			}
		}
		http2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		http2.send();
		
	},
	MakeExpander: function (i) {
        var expDiv = document.createElement('div');
		expDiv.setAttribute('id','state_' + i);
		expDiv.setAttribute('class','state');
		expDiv.setAttribute('onMouseOver', 'this.style.backgroundColor = "#551A8B"; this.style.color = "#fff"');
		expDiv.setAttribute('onMouseOut', 'this.style.backgroundColor = "#fff"; this.style.color = "#551A8B"');
		expDiv.setAttribute('onClick','Crawler.Expand(' + i + ',this);event.stopPropagation();');
		if(Crawler.States[i][0] == "")
			expDiv.innerHTML = "(Unlabeled)";
		else
			expDiv.innerHTML = Crawler.States[i][0];

		var stateCheck = document.createElement('input');
		stateCheck.setAttribute('type','checkbox');
		stateCheck.setAttribute('class','check');
		stateCheck.setAttribute('onClick','Crawler.Check(' + i + ',this,event);');
		expDiv.appendChild(stateCheck);
		
		document.getElementById("stateContainer").appendChild(expDiv);
		
		var containerDiv = document.createElement('div');
		containerDiv.setAttribute('id','state_' + i + '_cityContainer');
		for(var j = 1; j < Crawler.States[i].length; j++)
			containerDiv.appendChild(Crawler.MakeLink(i,j));
		expDiv.appendChild(containerDiv);
		
        return expDiv;
    },
	MakeCataExpander: function (i) {
        var expDiv = document.createElement('div');
		expDiv.setAttribute('id','cata_' + i);
		expDiv.setAttribute('class','state');
		expDiv.setAttribute('onMouseOver', 'this.style.backgroundColor = "#551A8B"; this.style.color = "#fff"');
		expDiv.setAttribute('onMouseOut', 'this.style.backgroundColor = "#fff"; this.style.color = "#551A8B"');
		expDiv.setAttribute('onClick','Crawler.Expand(' + i + ',this);event.stopPropagation();');
		expDiv.innerHTML = Crawler.Catas[i][0];

		var stateCheck = document.createElement('input');
		stateCheck.setAttribute('type','checkbox');
		stateCheck.setAttribute('class','check cataCheck');
		stateCheck.setAttribute('onClick','Crawler.Check(' + i + ',this,event);');
		expDiv.appendChild(stateCheck);
		
		document.getElementById("cataContainer").appendChild(expDiv);
		
		var containerDiv = document.createElement('div');
		containerDiv.setAttribute('id','cata_' + i + '_cataContainer');
		for(var j = 1; j < Crawler.Catas[i].length-1; j+=2)
			containerDiv.appendChild(Crawler.MakeCata(i,j));
		expDiv.appendChild(containerDiv);
		
        return expDiv;
    },
	Expand: function (i, source) {
		source.style.backgroundColor = '#551A8B';
		source.style.color = '#fff';
		source.setAttribute('onMouseOut', '');
		source.setAttribute('onClick','Crawler.Retract(' + i + ',this);');
		source.style.height = (source.childNodes[2].childNodes.length*14+19) + "px";
	},
	Retract: function (i, source) {
		source.style.height = '15px';
		source.setAttribute('onMouseOut', 'this.style.backgroundColor = "#fff"; this.style.color = "#551A8B"');
		source.setAttribute('onClick','Crawler.Expand(' + i + ',this);');
		source.style.backgroundColor = '#fff';
		source.style.color = '#551A8B';
	},
	Check: function (i, source, e) {
		e.stopPropagation();
		var state = source.parentNode.childNodes[2];
		for(var j = 0; j < state.childNodes.length; j++)
			state.childNodes[j].childNodes[1].checked = source.checked;
	},
	CityCheck: function (source, e) {
		e.stopPropagation();
		source.parentNode.parentNode.parentNode.childNodes[1].indeterminate = true;
		source.checked = !source.checked;
		},
	MakeLink: function(i, j) {
		var txtDiv = document.createElement('div');
		txtDiv.setAttribute('id','state_' + i + '_city_' + j);
		txtDiv.setAttribute('class','city');
		txtDiv.innerHTML = Crawler.States[i][j];
		txtDiv.setAttribute('onMouseOver', 'this.style.backgroundColor = "#551A8B"; this.style.color = "#fff"');
		txtDiv.setAttribute('onMouseOut', 'this.style.backgroundColor = "#fff"; this.style.color = "#551A8B"');
		txtDiv.setAttribute('onClick','Crawler.CityCheck(this.childNodes[1],event);')
		
		var stateCheck = document.createElement('input');
		stateCheck.setAttribute('id','check_' + i + '_city_' + j);
		stateCheck.setAttribute('type','checkbox');
		stateCheck.setAttribute('class','check');
		//stateCheck.setAttribute('onClick','return false;')
		txtDiv.appendChild(stateCheck);
		
		return txtDiv;
	},
	MakeCata: function(i, j) {
		var txtDiv = document.createElement('div');
		txtDiv.setAttribute('id','cata_' + i + '_sub_' + j);
		txtDiv.setAttribute('class','cata');
		txtDiv.innerHTML = Crawler.Catas[i][j+1];
		if(Crawler.Catas[i][j+1] == "cars+trucks")
			Crawler.Catas[i][j+2] = "cta/";
		//Crawler.Catas[i][j]; //url link
		txtDiv.setAttribute('onMouseOver', 'this.style.backgroundColor = "#551A8B"; this.style.color = "#fff"');
		txtDiv.setAttribute('onMouseOut', 'this.style.backgroundColor = "#fff"; this.style.color = "#551A8B"');
		txtDiv.setAttribute('onClick','Crawler.CityCheck(this.childNodes[1],event);')
		
		var stateCheck = document.createElement('input');
		stateCheck.setAttribute('id','check_' + i + '_cata_' + j);
		stateCheck.setAttribute('type','checkbox');
		stateCheck.setAttribute('class','check subCata');
		//stateCheck.setAttribute('onClick','return false;')
		txtDiv.appendChild(stateCheck);
		
		return txtDiv;
	},
	Search: function() {
		document.getElementById("resultsContainer").innerHTML = "";
		var cityDivs = document.getElementsByClassName('city');
		for(var i = 0; i < cityDivs.length; i++)
			if(cityDivs[i].childNodes[1].checked)
				Crawler.Queue.push(i);
		var cataDivs = document.getElementsByClassName('cataCheck');
		for(var i = 0; i < cataDivs.length; i++)
			if(cataDivs[i].indeterminate)
			{
				//continue getting children
				var cataSubs = document.getElementsByClassName('subCata');
				for(var j = 0; j < cataSubs.length; j++)
					if(cataSubs[j].checked)
						Crawler.SelectedCatas.push(cataSubs[j].parentNode.childNodes[0].data);
			}
			else if(cataDivs[i].checked)
				Crawler.SelectedCatas.push(cataDivs[i].parentNode.childNodes[0].data);
		Crawler.Retrieve();
	},
	Retrieve: function() {
		if(Crawler.Queue[1])
		{
			var prefix = document.getElementsByClassName('city')[Crawler.Queue.pop()].childNodes[0].data;
			for(var i = 1; i < Crawler.SelectedCatas.length; i++)
				setTimeout("Crawler.GetResults(\"" + prefix + "\"," + i + ");",(i-1)*1000);
			setTimeout('Crawler.Retrieve();',2000*Crawler.SelectedCatas.length);
		}
		else
		{
			//empty array for next search
			Crawler.SelectedCatas = [];
			Crawler.SelectedCatas[0] = 1;
		}
	},
	GetResults: function (prefix, i) {
		var cata;
		var selCata = Crawler.SelectedCatas[i];
		if(Crawler.Catas.indexOf(selCata) < 0)
			for(var j = 0; j < Crawler.Catas.length; j++)
				if(Crawler.Catas[j].indexOf(selCata) < 0)
					continue;
				else
					cata = Crawler.Catas[j][Crawler.Catas[j].indexOf(selCata)+1];
			else
				cata = Crawler.Catas[Crawler.Catas.indexOf(selCata)+1];
		
		var url = "get-ads.php";
		var http = new XMLHttpRequest();
		http.open("POST", url, true);
		http.onreadystatechange = function () {
			if (http.readyState == 4) 
			{
				//document.getElementById("resultsContainer").value += http.responseText.split("|S|P|L|I|T|"));
				var contain = document.getElementById("resultsContainer");
				contain.removeChild(contain.getElementsByTagName("img")[0]);
				//contain.removeChild(contain.getElementsByTagName("div")[0]);
				contain.innerHTML += http.responseText.replace(/|S|P|L|I|T|/,"");
				$('a[href^="http://"]').attr("target", "_blank");
				$(".gc > a").attr("href", "#");
			}
		}
		var params = "prefix=" + prefix + "&query=" + document.getElementById("query").value + "&cata=" + cata.replace('/','&') + "&min=" + document.getElementById("min_price").value + "&max=" + document.getElementById("max_price").value;
		http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		http.send(params);
		document.getElementById("resultsContainer").innerHTML += "<img src='load.gif'>";
	}
}