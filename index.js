const { ethers } = require("ethers")
const dailyDonutABI = require("./abi/DailyDonut.json")
const { sleep, currentTime } = require('./lib/utils')
const { discordWebhook } = require("./lib/webhook")
const rpc = "https://api.roninchain.com/rpc"
const provider = new ethers.JsonRpcProvider(rpc)
const CONTRACT = "0xe969cc48458ed2e40fa63d5287a81a4e4748b98b"
const run = async () => {
    try {
        const wallet = new ethers.Wallet(process.env.pk, provider)
        const walletAddress = await wallet.getAddress()
        const contract = new ethers.Contract(CONTRACT, dailyDonutABI, wallet)
        const nextClaim = await contract.timeUntilNextClaim(walletAddress)
        if (nextClaim == 0) {
            console.log(`[${currentTime()}]`, "Claiming donut...")
            const claimTx = await contract.claimDonut()
            console.log(`[${currentTime()}]`, "Tx sent.")
            console.log(`[${currentTime()}]`, "Waiting for receipt")
            const receipt = await getReceipt(claimTx)
            console.log(`[${currentTime()}]`, "Tx =>", `https://app.roninchain.com/tx/${receipt.hash}`)
            if (process.env.webhook_discord) {
                await discordWebhook(process.env.webhook_discord, receipt)
            }
        } else {
            console.log(`[${currentTime()}]`, "Donut not available.", `Next claim in ${moduloTangIna(parseInt(nextClaim))}`)
            await sleep(parseInt(nextClaim) * 1000)
        }
        return await run()
    } catch (err) {
        console.log(`[${currentTime()}]`, "FAILED CLAIM DONUT")
    }
}
const getReceipt = async (tx) => {
    try {
        const rawTx = await tx.wait()
        return rawTx
    } catch (err) {
        return await getReceipt(tx)
    }
}
const moduloTangIna = (ms) => {
    let txt = []
    let hrs = Math.floor(ms / (60 * 60))
    if (hrs > 0) txt.push(`${hrs}h`)
    let min = ms % 60
    if (min > 0) txt.push(`${min}m`)
    return txt.join(" ")
}
run()