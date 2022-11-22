const backgroundButton = document.querySelector('#backgroundEditor>form>.submit');
const shapeButton = document.querySelector('#shapeEditor>form>.submit');
const startButton = document.querySelector('button');
const canvas = document.getElementById('editedCard');
const ctx = canvas.getContext("2d");
let name;
function drawShape(shape){
    ctx.fillStyle = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b})`;
    switch(shape.type){
        case 'Square':
            ctx.fillRect(shape.pos.x, shape.pos.y, 20, 20);
            break;
        case 'Circle':
            ctx.beginPath();
            ctx.arc(shape.pos.x, shape.pos.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'Triangle':
            ctx.beginPath();
            ctx.moveTo(shape.pos.x, shape.pos.y);
            ctx.lineTo(+shape.pos.x +20, shape.pos.y);
            ctx.lineTo(shape.pos.x, +shape.pos.y +20);
            ctx.fill();
            break;
    }
}

function initialize(){
    //toDO
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

    this.parentElement.classList.add('hidden');
    document.getElementById('t').classList.add('hidden');
    const name = this.parentElement.querySelector('input').value;
    document.querySelector('#cardEditor>h2').innerHTML = `Editing Card ${name}`
    const [r,g,b] = formValues;
    console.log(`rgb(${r}, ${g}, ${b})`);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const req = new XMLHttpRequest();
    req.open('POST', '/api/card', true);
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
    drawShape(shape);
    
    const req = new XMLHttpRequest();
    req.open('POST', '/api/shape', true);
    req.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    req.send(JSON.stringify({cardName: document.querySelector('div input').value, shape: shape}));
    form.className = 'hide';
});

