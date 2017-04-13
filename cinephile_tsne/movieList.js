function MovieList(){
	this.quadtree=d3.quadtree();
	this.size=0;
	this.movieMap={};
	this.getSize=getSize;
	this.addMovie=addMovie;
	this.getMovie=getMovie;
	this.getXcord=getXcord;
	this.getYcord=getYcord;
	this.getMainColor=getMainColor;
	this.updateColors=updateColors;
	this.getSimilarMovies=getSimilarMovies;
	this.getCountryName=getCountryName;
	this.quadtreeReset=quadtreeReset;
	this.quadtreeAdd=quadtreeAdd;
}

function addMovie(movieID,movieObject){
	this.movieMap[movieID]=movieObject;
	this.size+=1
}

function getSize(){
	return this.size;
}

function quadtreeReset(){
	this.quadtree=d3.quadtree();
}

function quadtreeAdd(data){
	this.quadtree.add(data);
}

function getMovie(movieID){
	return this.movieMap[movieID];
}

function getXcord(movieID){
	return this.movieMap[movieID].getX();
}

function getYcord(movieID){
	return this.movieMap[movieID].getY();
}

function getMainColor(movieID){
	return this.movieMap[movieID].mainColor;
}

function getCountryName(movieID){
	return this.movieMap[movieID].getCountry();
}


function getSimilarMovies(clickedMovie){
	var result = [];
	for(var i in this.movieMap){
		if((this.getMovie(i).getDirector()==clickedMovie.getDirector())&&(this.getMovie(i).getName()!=clickedMovie.getName())){
			result.push(this.getMovie(i));
		}
	}
	return result;
}

function updateColors(){
	for(var i in this.movieMap){
		this.getMovie(i).updateColor();
	}
}
