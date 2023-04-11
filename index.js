// Wrangling Interactive UI stuff

console.log(`${location.origin+location.pathname}index.js loaded \n${Date()}`);

(async function(){
    // check for key as a hash first
    let parms={}
    location.hash.slice(1).split('&').forEach(av=>{
        av=av.split('=')
        parms[av[0]]=av[1]
    })
    //console.log(parms)
    if(parms.key){
        localStorage.GPT_API_key=parms.key
        location.hash=location.hash.replace(`key=${parms.key}`,'') // extract key
        location.hash=location.hash.replace('#&','').replace('&&','&') //clean-up
    }
    gpt = await import('./export.js')
    gpt.chatUI()
})()
