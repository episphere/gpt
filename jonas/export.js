// exploring GPT APIs

console.log('jonas/export.js imported')

const hello=`hello GPT at ${Date()}`;

var key = null //'null'

function check4key(){
    const msgTrue = 'API key found, provided to SDK'
    const msgFalse = 'No GPT API Key found, please generate one at https://platform.openai.com/account/api-keys'
    if((localStorage.GPT_API_key)&&(localStorage.GPT_API_key!='null')&&(localStorage.GPT_API_key.length>0)){
        console.log(msgTrue)
    }else{
        console.log(msgFalse)
        localStorage.GPT_API_key=prompt(msgFalse+' and provide it here: ')
    }
    key=localStorage.GPT_API_key
    // delete localStorage.GPT_API_key // if this machine cannot be trusted with a persistent API key
}

async function send(txt){ // to GPT
    // ...
}

check4key()

export{
    hello,
    key,
    check4key
}
