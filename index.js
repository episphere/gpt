// Wrangling Interactive UI stuff

console.log(`${location.href}index.js loaded \n${Date()}`);

(async function(){
    gpt = await import('./export.js')
    gpt.chatUI()
})()
