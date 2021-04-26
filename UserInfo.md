# Adding a New User
All User Data is located in [userData.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/userdata.js) <br>
Main/hero user data is located at the top of the script
## User Components 
-`profileImage: 'filePath'` All avatars are stored as .png files inside of the file path [VDI/public/avatars](https://github.com/MrBacon470/Void-Development-Incremental/tree/main/public/avatars) all you have to do is put the new avatar in the folder and link the path to the component<br>
-`username: 'name'` The username component is the display name for the hero user so `username: "VoidCloud"` would display VoidCloud for the hero's name in game<br>
-`role: 'rolename'` The role component is what gives the hero a place on the hierarchy, and a color in game (roles are located at the bottom of the userData.js script)<br>
-`status: 'status'` The status component is what colors the status circle, default acceptable inputs are (Online, Idle, DND, Offline)
-`customStatus: 'Status'` or `playing: 'GameName` are the determiners for a hero's status only one can be used in a user, The inputs are whatever you want them to be<br>
## Example User
``` js
"userIdNumber": {
    profileImage: 'avatars/fileName.png',
    username: "Gamening,
    role: 'rolename',
    status: 'Online',
    customStatus: 'Status',
}
```
## How to obtain various user data
(Obtaining User ID) Be in discord dev mode right click on a discord user and click "Copy ID"<br>
(Obtaining User Profile Picture) Use a bot like Carl Bot's ?avatar command to obtain the profile picture link and download the png version
# Adding a New Role
All role data is located in [userData.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/userdata.js) <br>
Look at the bottom of the script to find roles
## Role Components
-`'rolename': { }` This is what holds all role components, and the role's data, the 'rolename' input is also what is the input in a hero's `role: 'rolename'` component<br>
-`title: 'ROLE NAME'` This is what the role display name is, and it will be in all caps in game<br>
-`color: 'CSS Color Input'` The color component is what determines the role's color in game any CSS Color value is accepted, ex:`rgb(r,g,b) hsl(50%,50%,50%), #FF0000, #F00`
## Example Role
```js
    'rolename': { title: 'ROLE NAME', color: 'rgb(r, g, b)' }
```

