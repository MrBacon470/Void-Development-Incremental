# Creating New Channels
## All Channels are stored in [main.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/main.js) at the top
## Find `let startData = { }` in the script near the top
## To add a channel you must insert into a category (Making Categories in the Next Section)
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
# Creating New Categories
## All Categories are stored in [main.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/main.js) at the top
## Find `let startData = { }` in the script near the top 
## You must add all categories inside of `categories: { }`
## Example Category
```js
let startData = {
    categories: {
        categoryName: {
            title: 'categoryname',
            collapsed: false, //This is just like discord and the options are true or false
            channels: {
                //Insert your channels here
            }
        } // Add a comma at the end of the } to add another category underneath
    }
}
```
