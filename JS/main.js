
let player = {
  "welcome": {
    messages: [
      {
        timestamp: Date.now(),
        content: "Testerest",
        userId: 350057688182292482,
        first: true
      },
      {
        timestamp: Date.now(),
        content: "Testerest",
        userId: 350057688182292482,
        first: true
      }
    ],
    description: ":blobwave:"
  },
  "general": {
    description: "This is where talk about things | Be nice :)"
  },
  activeTab: "welcome"
}

window.setInterval(function () {
    Save()
}, 1000)

function Notate(x) {
    let exponent = Math.floor(Math.log10(Math.abs(x)));
    let mantissa = x / Math.pow(10, exponent);
    if(x >= 1e3)
        return `${mantissa.toFixed(2)}e${exponent}`
    else if(x < 1e3)
        return `${x.toFixed(2)}`;
    else if(x == 0)
        return '0';
}

