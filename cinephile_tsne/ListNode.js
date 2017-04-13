function LinkedListNode(nodeColor){
	this.genre=null;
	this.color=nodeColor;
	this.next=null;
}

function LinkedList(){
	this.head = null;
	this.tail = null;
	this.size = 0;
	this.addNode=addNode;
	this.createList=createList;
	this.canAddGenre=canAddGenre;
	this.addGenre=addGenre;
	this.removeGenre=removeGenre;
	this.isEmpty=isEmpty;
	this.getColor=getColor;
}

function addNode(nodeColor){
	tempNode = new LinkedListNode(nodeColor);
	if(this.head == null){
		this.head=tempNode;
		this.tail=tempNode;
	}
	else{
		this.tail.next=tempNode;
		this.tail=tempNode;
	}
}

function createList(nodeColorList,defaultColor){
	for(each in nodeColorList){
		this.addNode(nodeColorList[each]);
	}
	this.defaultColor=defaultColor;
}

function canAddGenre(){
	if(this.size<12){
		return true;
	}
	return false;
}

function addGenre(genreString){
	if(this.canAddGenre()){
		tempNode=this.head;
		while(tempNode!=null){
			if(tempNode.genre==null){
				tempNode.genre=genreString;
				this.size = this.size +1;
				return true;
			}
			else{
				tempNode=tempNode.next;
			}
		}
	}
	else{
		return false;
	}
}

function removeGenre(genreString){
	tempNode=this.head;
	while(tempNode!=null){
		if(tempNode.genre===genreString){
			tempNode.genre=null;
			this.size = this.size - 1;
			return;
		}
		tempNode = tempNode.next;
	}
}

function isEmpty(){
	if(this.size==0){
		return true;
	}
	return false;
}

function getColor(genreString){
	if(this.isEmpty()){
		return this.defaultColor;
	}
	tempNode=this.head;
	while(tempNode!=null){
		if(tempNode.genre===genreString){
			return tempNode.color;
		}
		tempNode=tempNode.next;
	}
	return this.defaultColor;
}