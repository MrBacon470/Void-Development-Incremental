function Save() {
    let data = {
    }
    localStorage.setItem("VDI",JSON.stringify(data))
}

function Load() {

    let saveData = localStorage.getItem("data")

    if(!saveData) {
        return
    }
    else {
        saveData = JSON.parse(saveData)
    }
/*
    if(typeof saveData.watts !== "undefined"){
        watts = saveData.watts
    }
    for(let i = 0; i < 8; i++) {
        if(typeof saveData.genLevels !== "undefined") genLevels[i] = saveData.genLevels[i]
    }
 */

}
console.log(localStorage.getItem("VDI"))


Load()
