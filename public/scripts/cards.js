//cards library
function clearCanvas(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawShapePreview(shape, ctx){
    clearCanvas(ctx);
    ctx.fillStyle = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b}, 0.9)`;
    //Determine which shape to draw
    const size = shape.size??20;
    ctx.strokeStyle = `rgb(${(100+shape.color.r)%256}, ${(100+shape.color.g)%256}, ${(100+shape.color.b)%256})`;
    ctx.setLineDash([Math.min(Math.ceil(size/10), 15), Math.min(Math.floor(size/10), 15)]);
    
    ctx.beginPath();
    switch(shape.type){
        case 'Square':
            ctx.rect(shape.pos.x-size/2, shape.pos.y-size/2, size, size);
            break;
        case 'Circle':
            ctx.arc(shape.pos.x, shape.pos.y, size/2, 0, 2 * Math.PI);
            break;
        case 'Triangle':
            ctx.moveTo(shape.pos.x, shape.pos.y);
            ctx.lineTo(+shape.pos.x + size, shape.pos.y);
            ctx.lineTo(shape.pos.x, +shape.pos.y +size);
            break;
    }
    ctx.fill();
    ctx.stroke();
}


//function to drawShape
function drawShape(shape, ctx){
    ctx.fillStyle = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b})`;
    //Determine which shape to draw
    const size = shape.size??20;
    switch(shape.type){
        case 'Square':
            ctx.fillRect(shape.pos.x-size/2, shape.pos.y-size/2, size, size);
            break;
        case 'Circle':
            ctx.beginPath();
            ctx.arc(shape.pos.x, shape.pos.y, size/2, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'Triangle':
            ctx.beginPath();
            ctx.moveTo(shape.pos.x, shape.pos.y);
            ctx.lineTo(+shape.pos.x + size, shape.pos.y);
            ctx.lineTo(shape.pos.x, +shape.pos.y +size);
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