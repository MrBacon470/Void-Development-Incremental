let activeTab;

function tabSwitch(chid, isVoice = false, displayName = '') {
    activeTab = chid;
    for (let tab_btn of document.getElementsByClassName('channel')) {
        if (tab_btn.attributes.chid.value == chid) tab_btn.classList.add('selected');
        else tab_btn.classList.remove('selected');
    }
    document.getElementById('messages-header-channel').innerText = displayName === '' ? chid : displayName;
    document.getElementById('messages-header-type').className = isVoice ? 'fas fa-volume-up' : 'fas fa-hashtag';
    if (isVoice) {
        document.getElementById('messages').style.display = 'none';
    } else {
        document.getElementById('messages').style.display = '';
        document.getElementById('messages-input').placeholder = 'Message #' + chid;
        document.getElementById('messages-input').focus();
    }
}

function collapseTabGroup(chgroup) {
    for (let group_btn of document.getElementsByClassName('channel-group-header')) {
        if (group_btn.attributes.chgroup.value == chgroup) group_btn.classList.toggle('collapsed');
    }
    for (let tab_btn of document.getElementsByClassName('channel')) {
        if (tab_btn.attributes.chgroup.value == chgroup) tab_btn.classList.toggle('collapsed');
    }
}