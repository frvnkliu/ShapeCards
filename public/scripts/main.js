const backgroundButton = document.querySelector('#backgroundEditor>form>.submit');
const shapeButton = document.querySelector('#shapeEditor>form>.submit');
const startButton = document.querySelector('button');
const returnButton = document.querySelector('#cardEditor>button');
const canvas = document.getElementById('editedCard');
const ctx = canvas.getContext("2d");
const cards = document.getElementById('cards');
const editor = document.getElementById('cardEditor');
const newCardForm = document.getElementById('newCardForm');
let name;


function editButtonClick(event){
    //Creates an AJAX get request to the card and rerenders it in the editor
    name = this.parentElement.querySelector('p').innerHTML;
    cards.classList.add('hidden');
    editor.classList.remove('hidden');
    document.querySelector('#cardEditor>h2').innerHTML = `Editing Card ${name}`;

    const req = new XMLHttpRequest();
    const url = `api/card?name=${name}`;
    req.open('GET', url);
    req.addEventListener('load', function(evt){
        if(req.status >= 200 && req.status < 300) {
            const cardInfo = JSON.parse(req.responseText);
            render(cardInfo, canvas);
        }
    });
    req.send();
}

function deleteCard(event){
    const name = this.parentElement.querySelector('p').innerHTML;
    if(confirm(`Are you sure you want to delete the card: "${name}"? (This is permanent)`)){
        //AJAX DELETE Request to remove a single card
        const req = new XMLHttpRequest();
        const url = `api/card?name=${name}`;
        req.open('DELETE', url);
        req.addEventListener('load', function(evt){
            if(req.status >= 200 && req.status < 300) {
                getCards();
            }else{
                console.log("error deleting card")
            }
        });
        req.send();
    }
}

function getCards(){
    //Remove previous cards
    while (cards.children.length > 1) {
        cards.removeChild(cards.lastChild);
    }

    //AJAX GET request to our API to retrieve info on cards of this user
    const req = new XMLHttpRequest();
    const url = 'api/cards';
    req.open('GET', url);
    req.addEventListener('load', function(evt){
        if(req.status >= 200 && req.status < 300) {
            const cardList  = JSON.parse(req.responseText); 
            for(const cardInfo of cardList) {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('mx-2');
                cardDiv.classList.add('my-2');
                const cardCanvas = document.createElement('canvas');
                cardCanvas.classList.add('block');
                cardCanvas.width = "300";
                cardCanvas.height = "500";
                const label = document.createElement('p');
                label.innerHTML = cardInfo.name;
                const editButton = document.createElement('button');
                editButton.innerHTML = "Edit Card";
                editButton.addEventListener('click', editButtonClick);
                editButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-0.5 px-1 mx-1'
                const delButton = document.createElement('button');
                delButton.innerHTML = "X";
                delButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold rounded py-0.5 px-2 mx-1'
                delButton.addEventListener('click', deleteCard);
                cardDiv.append(cardCanvas);
                cardDiv.append(label);
                cardDiv.append(editButton);
                cardDiv.append(delButton);
                cards.append(cardDiv);
                render(cardInfo, cardCanvas);
            }
        }
    });
    req.send();
}

startButton.addEventListener('click', function(event){
    //Run AJAX create Card
    name = this.parentElement.querySelector('input').value;
    if(!name){
        document.getElementById('startError').innerHTML = `Name cannot be empty!`;
        return;
    } 
    //Input Validation
    const formValues = [...this.parentElement.querySelectorAll('form input')].map(x=>x.value);
    let valid = true;
    for(const x of formValues){
        if(!x){
            document.getElementById('startError').innerHTML = `RGB Values are Required!`;
            return;
        }
        if(x < 0 || x > 255){
            document.getElementById('startError').innerHTML = `Invalid RGB value: ${x}<br>(Must be >=0  and <256)`
            return;
        }
    }

    const [r,g,b] = formValues;
    //disable start button so multiple posts are not made
    startButton.disabled = true;

    //Create AJAX Post request for new card
    const req = new XMLHttpRequest();
    req.open('POST', '/api/cards', true);
    req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");

    req.addEventListener('load', function(evt){
        if(req.status >= 200 && req.status < 300) {
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            cards.classList.add('hidden');
            editor.classList.remove('hidden');
            document.querySelector('#cardEditor>h2').innerHTML = `Editing Card: "${name}"`;
        }else{
            document.getElementById('startError').innerHTML = `Invalid Name: ${name}<br>(Cannot have duplicate card names!!!)`;
        }
        startButton.disabled = false;
    });
    req.send(JSON.stringify({name: name, backgroundcolor: {r: r, g: g, b: b}, shapes: []}));
});

shapeButton.addEventListener('click', function(event){
    event.preventDefault();
    const formValues = [this.parentElement.querySelector('select'),...this.parentElement.querySelectorAll('input')].map(x=>x.value);
    //Validation of Form Input
    if(formValues.every((x) => typeof x === 'number')){
        const shape = {type: formValues[0], color: {r: formValues[1]%256, g: formValues[2]%256, b: formValues[3]%256}, pos: {x: formValues[4], y: formValues[5]}};
        if(shape.pos.x < -20 || shape.pos.x >= 300){
            document.getElementById('shapeError').innerHTML = `Invalid x value: ${shape.pos.x}<br>(Must be >-20  and <300)`
            return;
        }
        if(shape.pos.y < -20 || shape.pos.y >= 500){
            document.getElementById('shapeError').innerHTML = `Invalid y value: ${shape.pos.y}<br>(Must be >-20  and <500)`
            return;
        }

        //AJAX Post request to API that adds shape to the current card
        document.getElementById('shapeError').innerHTML = "";
        drawShape(shape, ctx);
        const req = new XMLHttpRequest();
        req.open('POST', '/api/shape', true);
        req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
        req.send(JSON.stringify({cardName: name, shape: shape}));
    }else{
        document.getElementById('shapeError').innerHTML = `Invalid input (Must be Numbers)`;
    }
});

returnButton.addEventListener('click', function(event){
    cards.classList.remove('hidden');
    editor.classList.add('hidden');
    //update cards
    getCards();
});

getCards();