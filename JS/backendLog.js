
var fs = require("fs");
var path = require("path");

function getCurrentDayTime() {
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}
  
export function LogBackend(text) {
    fs.open(path.join(__dirname, 'BACKEND_log.txt'), 'a', 666, function (e, id) {
  
        const textTooWrite = getCurrentDayTime() + "   " + text
  
        fs.write(id, textTooWrite + "\n", null, 'utf8', function () {
            fs.close(id, function () {
                console.log('LogBackend file is updated: ' + text);
            });
        });
    });
}

export function ParsePathGiveID(_url){

    const params = _url.split("?");
    if(params.length != 2){
        return -1;
    }

    const id = params[1].split("=");
    if(id.length != 2){
        return -1;
    }

    return id[1];
}