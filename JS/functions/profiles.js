function openProfile(uid) {
    for (let userItem of document.getElementsByClassName('user')) {
        if (userItem.attributes.uid.value == uid) userItem.classList.add('selected');
        else userItem.classList.remove('selected');
    }

    // Will continue
}