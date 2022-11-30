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


function cardOnClick(event){
    name = this.parentElement.querySelector('p').innerHTML;
    cards.classList.add('hidden');
    editor.classList.remove('hidden');
    document.querySelector('#cardEditor>h2').innerHTML = `Editing Card ${name}`;

    const req = new XMLHttpRequest();
    const url = `api/card?name=${name}`;
    req.open('GET', url);
    req.addEventListener('load', function(evt){
        console.log(req.status, req.responseText);
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
        const req = new XMLHttpRequest();
        const url = `api/card?name=${name}`;
        req.open('DELETE', url);
        req.addEventListener('load', function(evt){
            console.log(req.status, req.responseText);
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
    console.log("Hi, why no work");
    //AJAX to retrieve cards
    console.log(cards.children.length);
    while (cards.children.length > 1) {
        console.log(cards.children.length);
        cards.removeChild(cards.lastChild);
        console.log(cards.children.length);
    }

    console.log("Cards\n " + cards);
    const req = new XMLHttpRequest();
    const url = 'api/cards';
    req.open('GET', url);
    req.addEventListener('load', function(evt){
        if(req.status >= 200 && req.status < 300) {
            const cardList  = JSON.parse(req.responseText); 
            console.log(cardList.length);
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
                editButton.addEventListener('click', cardOnClick);
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
    const formValues = [...this.parentElement.querySelectorAll('form input')].map(x=>x.value);
    let valid = true;
    for(const x of formValues){
        if(x < 0 || x > 255){
            document.getElementById('startError').innerHTML = `Invalid RGB value: ${x} (Must be >=0  and <256)`
            return;
        }
    }

    name = this.parentElement.querySelector('input').value;

    const [r,g,b] = formValues;
    startButton.disabled = true;
    const req = new XMLHttpRequest();
    req.open('POST', '/api/cards', true);
    req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");

    req.addEventListener('load', function(evt){
        console.log(req.status);
        if(req.status >= 200 && req.status < 300) {
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            cards.classList.add('hidden');
            editor.classList.remove('hidden');
            document.querySelector('#cardEditor>h2').innerHTML = `Editing Card: "${name}"`;
        }else{
            document.getElementById('startError').innerHTML = `Invalid Name: ${name} (Cannot have duplicate card names!!!)`;
        }
        startButton.disabled = false;
    });
    req.send(JSON.stringify({name: name, backgroundcolor: {r: r, g: g, b: b}, shapes: []}));
});

shapeButton.addEventListener('click', function(event){
    event.preventDefault();
    const formValues = [this.parentElement.querySelector('select'),...this.parentElement.querySelectorAll('input')].map(x=>x.value);
    console.log(formValues);
    const shape = {type: formValues[0], color: {r: formValues[1]%256, g: formValues[2]%256, b: formValues[3]%256}, pos: {x: formValues[4], y: formValues[5]}};
    if(shape.pos.x < -20 || shape.pos.x >= 300){
        document.getElementById('shapeError').innerHTML = `Invalid x value: ${shape.pos.x} (Must be >-20  and <300)`
        return;
    }
    if(shape.pos.y < -20 || shape.pos.y >= 500){
        document.getElementById('shapeError').innerHTML = `Invalid y value: ${shape.pos.y} (Must be >-20  and <500)`
        return;
    }
    document.getElementById('shapeError').innerHTML = "";
    drawShape(shape, ctx);
    
    const req = new XMLHttpRequest();
    req.open('POST', '/api/shape', true);
    req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    req.send(JSON.stringify({cardName: name, shape: shape}));
    //form.className = 'hide';
});

returnButton.addEventListener('click', function(event){
    cards.classList.remove('hidden');
    editor.classList.add('hidden');
    //update cards
    getCards();
});

getCards();