function tabSwitch(chid) {
    for (let tab_btn of document.getElementsByClassName('channel')) {
        if (tab_btn.attributes.chid.value == chid) tab_btn.classList.add('selected');
        else tab_btn.classList.remove('selected');
    }
}