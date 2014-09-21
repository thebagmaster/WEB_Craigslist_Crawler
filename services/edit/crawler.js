Crawler = {
	States: [],
	Catas: [],
	Queue: [],
	SelectedCatas: [],
	Credits: 0,
	SelCatas: 0,
	SelCities: 0,
    Init: function () {
		document.body.style.overflow = "auto";
		Crawler.Queue[0] = 1;
		Crawler.SelectedCatas[0] = 1;
		Crawler.Credits = parseInt($("#citiesAvail").text());

	    var url = "../../get-cities.php";
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
		
		var url2 = "../../get-categories.php";
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
				$("#cataContainer").append('<div id="queryContainer" class="other"><input type="search" id="query" class="query"></div><div id="priceContainer" class="other">price:<input id="min_price" class="price">-<input id="max_price" class="price"></div><div id="searchContainer" class="other"><input type="button" class="search" onClick="Crawler.Search();" value="Set"></div>');
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
		expDiv.setAttribute('onClick','Crawler.Expand(this);event.stopPropagation();');
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
		expDiv.setAttribute('onClick','Crawler.Expand(this);event.stopPropagation();');
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
	Expand: function (source) {
		source.style.backgroundColor = '#551A8B';
		source.style.color = '#fff';
		source.setAttribute('onMouseOut', '');
		source.setAttribute('onClick','Crawler.Retract(this);');
		source.style.height = (source.childNodes[2].childNodes.length*14+19) + "px";
	},
	Retract: function (source) {
		source.style.height = '15px';
		source.setAttribute('onMouseOut', 'this.style.backgroundColor = "#fff"; this.style.color = "#551A8B"');
		source.setAttribute('onClick','Crawler.Expand(this);');
		source.style.backgroundColor = '#fff';
		source.style.color = '#551A8B';
	},
	Check: function (i, source, e) {
		e.stopPropagation();
		var state = source.parentNode.childNodes[2];
		for(var j = 0; j < state.childNodes.length; j++)
		{
			var inc = 0;
			if(source.checked)
				inc = (state.childNodes[j].childNodes[1].checked) ? 0 : -1;
			else
				inc = (!state.childNodes[j].childNodes[1].checked) ? 0 : 1;
				
			Crawler.IncCredits(state.childNodes[j].childNodes[1], inc);			
			state.childNodes[j].childNodes[1].checked = source.checked;
		}
		Crawler.UpdateCredits();
		Crawler.Expand(source.parentNode);
	},
	UpdateCredits: function () {
		$("#citiesAvail").text(Crawler.Credits);
		$("#cataCount").text(Crawler.SelCatas);
		$("#cityCount").text(Crawler.SelCities);
	},
	IncCredits: function (source, inc) {
		window.event.stopPropagation();
		if(inc==null)
			inc = (source.checked) ? -1 : 1;
		
		if($(source).hasClass("subCata")) {
			Crawler.SelCatas -= inc;
			Crawler.Credits += inc*Crawler.SelCities;
		}
		else {
			Crawler.SelCities -= inc;
			Crawler.Credits += inc*Crawler.SelCatas;
		}
		Crawler.UpdateCredits();
	},
	CityCheck: function (source, e) {
		e.stopPropagation();
		source.parentNode.parentNode.parentNode.childNodes[1].indeterminate = true;
		source.checked = !source.checked;
		Crawler.IncCredits(source);	
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
		stateCheck.setAttribute('onClick','Crawler.IncCredits(this);')
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
		stateCheck.setAttribute('onClick','Crawler.IncCredits(this);')
		txtDiv.appendChild(stateCheck);
		
		return txtDiv;
	},
	Search: function() {
		var catas = [];
		var cities = [];
		var subs = 0;
		catas.length = 0;
		cities.length = 0;
		Crawler.SelectedCatas.length = 1;
		var cityDivs = document.getElementsByClassName('city');
		for(var i = 0; i < cityDivs.length; i++)
			if(cityDivs[i].childNodes[1].checked)
				cities.push($(".city:eq("+i+")").text());
		
		var cataDivs = document.getElementsByClassName('cataCheck');
		for(var i = 0; i < cataDivs.length; i++)
			if(cataDivs[i].indeterminate)
			{
				//continue getting children
				var cataSubs = document.getElementsByClassName('subCata');
				for(var j = 0; j < cataSubs.length; j++)
					if(cataSubs[j].checked)
						catas.push(Crawler.Catas[cataSubs[j].id.split('_')[1]][parseInt(cataSubs[j].id.split('_')[3])+2]);					
			}
			else if(cataDivs[i].checked)
			{
				catas.push(Crawler.Catas[i][1]);
				subs = $(cataDivs[i].parentNode).children(".cata").html();
			}
		
		alert(cities+catas+subs);
	}
}