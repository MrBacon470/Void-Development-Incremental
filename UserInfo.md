# Adding a New User
## All Main User Data is located in [userData.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/userdata.js) near the top of the script
## Formatting a new user
``` js
"userIdNumber": {
    profileImage: 'discord avatar link',
    username: "User Display Name",
    role: 'roleName (casesensitive)',
    status: 'Online, Idle, DND or Offline',
    //This next one is either customStatus or playing
    customStatus: 'Status',
    playing: 'Game Name'
}
```
## How to Obtain User Id
Be in discord dev mode right click on a discord user and click "Copy ID"
##How to Obtain User Profile Picture
Use a bot like Carl Bot's ?avatar command to obtain the profile picture link
# Adding a New Role
## All Roles are located in [userData.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/userdata.js) at the bottom
## Formatting Roles
```js
    'rolename': { title: 'ROLE NAME', color: 'rgb(r, g, b)' }
```
## Colors are any CSS color value ex:`rgb(r,g,b) hsl(50%,50%,50%), #FF0000, #F00`

