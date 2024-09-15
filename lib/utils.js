const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const currentTime = () => {
    let date_ob = new Date();
    let day = zeroPad(date_ob.getDate())
    let month = zeroPad(date_ob.getMonth())
    let hours = zeroPad(date_ob.getHours())
    let minutes = zeroPad(date_ob.getMinutes())
    let seconds = zeroPad(date_ob.getSeconds())
    let milsec = zeroPad(date_ob.getMilliseconds(), true)

    return day + "/" + month + " " + hours + ":" + minutes + ":" + seconds + ":" + milsec
}
const zeroPad = (str, s = false) => {
    str = str.toString()
    if (s) {
        str = (str.length > 2) ? str.substring(0, 2) : str
    }
    return (str.length >= 2) ? str : "0" + str
}
module.exports = { sleep, currentTime }