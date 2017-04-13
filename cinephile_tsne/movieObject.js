function Movie(id,xData,yData){
	this.id=id;
	this.xData=xData;
	this.yData=yData;
	this.mainColor= "#D3D3D3";
	this.setMetaData=setMetaData;
	this.updateColor=updateColor;
	this.getX=getX;
	this.getY=getY;
	this.getName=getName;
	this.getYear=getYear;
	this.getImage=getImage;
	this.getGenre=getGenre;
	this.getDirector=getDirector;
	this.getSynopsis=getSynopsis;
	this.getCountry=getCountry;
	this.getTime = getTime;
	this.getAverage = getAverage;
	this.getTotal = getTotal;
	this.getID = getID;
}

function getX(){
	return this.xData;
}

function getY(){
	return this.yData;
}

function setMetaData(data){
	this.movieData={};
	this.movieData['avg_rating']=data[0];
	this.movieData['country']=data[1];
	this.movieData['director_list']=data[2];
	this.movieData["genres"]=data[3];
	this.movieData['synopsis']=data[4];
	this.movieData['time']=data[5];
	this.movieData['total_ratings']=data[6];
	this.movieData["year"]=data[7];
	this.movieData["canonical_url"]=data[8];
	this.movieData["title"]=data[9];
	this.movieData["image"]=data[10];
}

function updateColor(){
	this.mainColor=colorList.getColor(this.getGenre());
}

function getName(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["title"];
}

function getYear(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["year"];
}

function getImage(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["image"];
}

var genrePreferences = ["Commercial","Anthology","Music","TV Mini-series","Cult","History","Sport","Film noir","Gay & Lesbian","Erotica","War","TV Movie","Mystery","Family","Silent","Musical","Western"
,"Biography","Music Video", "Fantasy","Adventure","Sci-Fi","Romance","Thriller","Crime"
,"Avant-Garde","Horror","Action","Animation","Short","Documentary","Comedy","Drama"];


function getGenre(){
	if(this.movieData==undefined){
		return;
	}
	tempHandle = this;
	for(let each of genrePreferences){
		if((tempHandle.movieData["genres"].indexOf(each)>=0)||(tempHandle.movieData["genres"].indexOf(" "+each)>=0)){
			return each;
		}
	}
}

function getDirector(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["director_list"][0];
}

function getSynopsis(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["synopsis"];
}

function getTime(){
	if(this.movieData==undefined){
		return;
	}	
	return this.movieData["time"];
}

function getAverage(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["avg_rating"];
}

function getCountry(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["country"];
}

function getTotal(){
	if(this.movieData==undefined){
		return;
	}
	return this.movieData["total_ratings"];
}

function getID(){
	return this.id;
}
