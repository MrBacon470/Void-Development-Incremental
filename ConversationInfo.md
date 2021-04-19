# Adding New Conversations
## Conversation Data is in [conversations.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/conversations.js)
## For Adding Random Conversations find `const nothingConversations = []` which is around line 242
```js
    //Adding Conversations is Easy
    //Just add a new 'conversation' to the array
    const nothingConversations = [
        'convo1',
        'convo2'
    ]
```
# Adding Welcome Messages
## Find `const welcomeMessages = []` at the bottom of the script
## Example Welcome messages
```js
const welcomeMessages = [
    '[!!{username}!!](usernameOnClick) Welcome :blobwavestill:',
    'Hey where did you come from, [!!{username}!!](usernameOnClick) Just Appeared'
]
```
## Why `[!!{username}!!](usernameOnClick)`? 
`[!!{username}!!](usernameOnClick)` is used to detect the player userName that joined and have a clickable name
