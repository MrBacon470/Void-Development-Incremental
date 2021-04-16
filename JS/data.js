function Save() {
    localStorage.setItem("VDI",JSON.stringify(player))
}

function Load() {

    let saveData = localStorage.getItem("data")

    if (!saveData) {
        tabSwitch("welcome")
        return
    } else {
        player = JSON.parse(saveData)
    }
}
Load()
