
const fs = require('fs')

const createImgResponse = (status,img) => ({
    statusCode:status,
    body:img
})

exports.getCompareProduct = (event, ctx, cb) =>{
    ctx.callbackWaitsForEmptyEventLoop = false;
    let imgName = event.pathParameters.img;
    fs.exists(__dirname+'/'+imgName, (exists)=>{
        if(exists){
            fs.readFile(__dirname+'/'+imgName, (err,img) =>{
                createImgResponse(200,img)
            })
        }else{
            return cb(null, {statusCode:500});
        }
    })
}