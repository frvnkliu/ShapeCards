//cards library

//function to drawShape
function drawShape(shape, ctx){
    ctx.fillStyle = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b})`;
    //Determine which shape to draw
    const size = shape.size??2;
    switch(shape.type){
        case 'Square':
            ctx.fillRect(shape.pos.x-size*5, shape.pos.y-size*5, size*10, size*10);
            break;
        case 'Circle':
            ctx.beginPath();
            ctx.arc(shape.pos.x, shape.pos.y, 5*size, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'Triangle':
            ctx.beginPath();
            ctx.moveTo(shape.pos.x, shape.pos.y);
            ctx.lineTo(+shape.pos.x +size*10, shape.pos.y);
            ctx.lineTo(shape.pos.x, +shape.pos.y +size*10);
            ctx.fill();
            break;
    }
}

//Card is the object returned by the database, canvas is the html element
function render(cardInfo, canvas){
    const ctx = canvas.getContext("2d");
    const bg = cardInfo.backgroundcolor;
    ctx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cardInfo.shapes.forEach(shape => drawShape(shape,ctx));
}