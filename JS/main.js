








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

