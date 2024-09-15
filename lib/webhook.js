const { default: axios } = require("axios")
const { currentTime } = require("./utils")

const discordWebhook = async (url, tx) => {
    let gas = parseInt(tx.gasUsed) / parseInt(tx.gasPrice) * 2
    try {
        const request = await axios.post(url, {
            "content": null,
            "embeds": [
                {
                    "title": "Daily Donut",
                    "description": "Daily donut successfully claimed at [tx](https://app.roninchain.com/tx/" + tx.hash + ").\nGas fee: " + gas.toString().toLocaleString() + " RON",
                    "color": 16763904,
                    "footer": {
                        "text": currentTime()
                    },
                    "thumbnail": {
                        "url": "https://donuts.forgottenrunes.com/img/donuts/PinkSprinkle.png"
                    }
                }
            ],
            "username": "Forgotten Runes",
            "avatar_url": "https://pbs.twimg.com/profile_images/1823101079980068865/z9myNiLS_400x400.png",
            "attachments": []
        })
    } catch (err) { }
}


module.exports = { discordWebhook }