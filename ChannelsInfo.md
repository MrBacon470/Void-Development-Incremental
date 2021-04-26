# Creating New Channels
## Channels are stored in [main.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/main.js)
Find `let startData = { }` in the script near the top. To add a channel you must create it inside a category (Making Categories in the Next Section)<br>
All channels go inside the following path `categoryName: { channels: { //Channels Go Here } }`
## Channel Components and Setup
Adding a channel is simple once you are inside a categories `channels: { }` component just type something like `channelName: { }` there you created your first channel and are ready to add components<br>
-`title: 'name'` The title component is what is displayed in game for that channel ex: `title: 'store'` would display store<br>
-`type: 'type'` The type component determines specific things about the channel mainly the display Icon and UI. Types are (text, voice, announcement, store)<br>
-`description: 'Description'` The description component also displays in game telling players what the channel is for ex: `description: 'Purchase Stuff'` would display in the channel description 'Purchase Stuff'<br>
-`messages: []` The messages component is usually left empty because messages are not usually generated to start indicated by the empty []<br>

`//Note that it is possible to have messages in a channel when starting the game`<br>

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
                    type: 'text',
                    description: "Description Text",
                    messages: []
                }
            }
        },
    }
}
```
# Creating New Categories
## All Categories are stored in [main.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/main.js) at the top
Find `let startData = { }` in the script near the top<br> 
All categories go inside the following path `let startData = { categories: { //Categories go here } }`
## Category Components and setup
Once you have found your way inside the `categories: { }` area then simply type something like `categoryName: { }` then boom you created a category now go ahead and components and channels how ever you would like<br>
-`title: 'name'` The title component is almost the exact same to the channel title the only difference is it displays only for the category header<br>
-`collapsed: bool` The collapsed component allows for the category to be collapsed/minimized on start, the accepted value of the component is a boolean so true or false
-`channels: { }`
## Example Category
```js
let startData = {
    categories: {
        categoryName: {
            title: 'categoryname',
            collapsed: false, 
            channels: {
                //Insert your channels here
            }
        } // Add a comma at the end of the } to add another category underneath
    }
}
```
