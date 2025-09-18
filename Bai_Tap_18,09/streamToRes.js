let fs = require('fs');
module.exports={
    ReadFileToRes:function(filePath,res){
        let data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    }
}


