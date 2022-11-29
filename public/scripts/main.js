const backgroundButton = document.querySelector('#backgroundEditor>form>.submit');
const shapeButton = document.querySelector('#shapeEditor>form>.submit');
const startButton = document.querySelector('button');
const canvas = document.getElementById('editedCard');
const ctx = canvas.getContext("2d");
const cards = document.getElementById('cards');
let name;


function cardOnClick(event){
    name = this.parentElement.querySelector('p').innerHTML;
    cards.classList.add('hidden');
    document.getElementById('cardEditor').classList.remove('hidden');
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


function getCards(){
    //AJAX to retrieve cards
    const req = new XMLHttpRequest();
    const url = 'api/cards';
    req.open('GET', url);
    req.addEventListener('load', function(evt){
        console.log(req.status, req.responseText);
        if(req.status >= 200 && req.status < 300) {
            const cardList  = JSON.parse(req.responseText); 
            for(const cardInfo of cardList) {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('mx-5');
                const cardCanvas = document.createElement('canvas');
                cardCanvas.classList.add('block');
                cardCanvas.width = "300";
                cardCanvas.height = "500";
                const label = document.createElement('p');
                label.innerHTML = cardInfo.name;
                const button = document.createElement('button');
                button.innerHTML = "Edit Card";
                button.addEventListener('click', cardOnClick);
                cardDiv.append(cardCanvas);
                cardDiv.append(label);
                cardDiv.append(button);
                cards.append(cardDiv);
                console.log(cardInfo);
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
            document.getElementById('startError').innerHTML = `Invalid RGB value: ${x} (Must be >=0  and <=256)`
            return;
        }
    }

    cards.classList.add('hidden');
    document.getElementById('cardEditor').classList.remove('hidden');
    name = this.parentElement.querySelector('input').value;
    document.querySelector('#cardEditor>h2').innerHTML = `Editing Card ${name}`
    const [r,g,b] = formValues;
    console.log(`rgb(${r}, ${g}, ${b})`);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const req = new XMLHttpRequest();
    req.open('POST', '/api/cards', true);
    req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    req.send(JSON.stringify({name: name, backgroundcolor: {r: r, g: g, b: b}, shapes: []}));
});

shapeButton.addEventListener('click', function(event){
    event.preventDefault();
    const formValues = [this.parentElement.querySelector('select'),...this.parentElement.querySelectorAll('input')].map(x=>x.value);
    const shape = {type: formValues[0], color: {r: formValues[1]%255, g: formValues[2]%255, b: formValues[3]%255}, pos: {x: formValues[4], y: formValues[5]}};
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

getCards();