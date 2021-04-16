let activeTab;

function tabSwitch(chid, isVoice = false, displayName = '') {
    player.activeTab = chid;
    player.isVoice = isVoice

    for (let tab_btn of document.getElementsByClassName('channel')) {
        if (tab_btn.attributes.chid.value == chid) tab_btn.classList.add('selected');
        else tab_btn.classList.remove('selected');
    }
    document.getElementById('messages-header-type').className = isVoice ? 'fas fa-volume-up' : 'fas fa-hashtag';
}

function collapseTabGroup(chgroup) {
    for (let group_btn of document.getElementsByClassName('channel-group-header')) {
        if (group_btn.attributes.chgroup.value == chgroup) group_btn.classList.toggle('collapsed');
    }
    for (let tab_btn of document.getElementsByClassName('channel')) {
        if (tab_btn.attributes.chgroup.value == chgroup) tab_btn.classList.toggle('collapsed');
    }
}