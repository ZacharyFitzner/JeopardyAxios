
class Board{

    constructor(numCategories){
        this.numCategories = numCategories;
        this.makeBoardHtml(numCategories);
        this.setCurrentCard(this);
        $('input').hide(); 

    }

    //Creates the entire game board, prompted by constructor
    async makeBoardHtml(){
        
        const categories = await this.getCategories(this.numCategories);
        this.categories = categories;

        this.createTiles();

        $('input').show(); 
        $('button').hide();

    }

    // Set titles, row values, append to jeopardy container
    createTiles(){

        for(let i = 0; i < 6; i++){
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            let row = i;

            for(let i = 0; i < this.numCategories; i++){
               
                if(row === 0){
                newRow.classList.add('row-0');
                let newTile = $(this.setTileBody(this.categories[i][1].toUpperCase())); 
                $(newRow).append(newTile);
                }
                
                else{
                let newTile = $(this.setTileBody(`$${row * 200}`));
                $(newRow).append(this.setAtts(newTile, row, i));
                }
            }
            $('#jeopardyContainer').append(newRow);
        }

    }

    //sets card's data to question and answer
    setAtts(newTile, row, i){
                $(newTile)[0].setAttribute('data-question', this.categories[i][2][row - 1].question);
                $(newTile)[0].setAttribute('data-answer', this.categories[i][2][row - 1].answer);
                return newTile
    }


    //supplies the html for cards
    setTileBody(innerText){
        if(!innerText){
            innerText = 'No Clue was found';
        }
        return `<div class="card col"> <div class="card-body"> <p class="card-text">${innerText}</p><button class="btn btn-primary">hidden</button> </div></div>`;
    }


    //returns formated array of categories and associated clues
    async getCategories(){

        let CategoriesArray = new Array(this.numCategories);
        
        for(let i = 0; i < CategoriesArray.length; i++){
            
            let currentColumn = await this.getCurrColumn();

            for(let i = 0; i < 5; i++){
                if(currentColumn.clues[i].question == '' || currentColumn.clues[i].question == '[Clue missing from recording]' || currentColumn.clues[i].question == '='){ 
                    currentColumn = await this.getCurrColumn();
                }
            }

            CategoriesArray[i] = [currentColumn.id, currentColumn.title, currentColumn.clues];
            
        }
      
        this.categories = CategoriesArray;
        return this.categories;
        
    }

    //gets a random categories id using the JService Generator
    async getRandomCategory(){

        let randomClue = await axios.get('http://jservice.io/api/random');
        return randomClue.data[0].category.id;

    }

    //using a random category id, return the category data
    async getCurrColumn(){

        let randomCatId = await this.getRandomCategory();
        let currentColumn = await axios.get('http://jservice.io/api/category/', {params : {id : randomCatId}});
        return currentColumn.data;

    }

    //set the current clicked card to this question or to answer.
    setCurrentCard(obj){
        $('body').on('click', '.card', function(){

            let newValue = this.lastChild.children[0].innerText == this.dataset.question ? this.dataset.answer : this.dataset.question;

            if(this.lastChild.children[0].innerText == this.dataset.answer){
                return;
            }

            this.lastChild.children[0].innerText = newValue;
        
        });
    }

    
}

//
new Board(6);



  
  