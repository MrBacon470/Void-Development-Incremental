# Creating New Channels
## All Channels are stored in [main.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/main.js) at the top
## Find `let startData = { }` in the script near the top
## To Add a channel you must insert into a category (Making Categories Below)
## Example Channel
```js
let startData = {
    categories: {
        exampleCategory: {
            title: 'categoryname',
            collapsed: false,
            channels: {
                general: {
                    title: 'exampleName',
                    //types are text, voice, announcement
                    type: 'text',
                    description: "Description Text",
                    //Ping makes it display that channel has a missed message (true or false)
                    ping: true,
                    messages: []
                }
            }
        },
    }
}
```
