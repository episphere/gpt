// exploring GPT APIs

console.log('jonas/export.js imported')

const hello=`hello GPT at ${Date()}`;

var key = null //'null'
var models = false

function check4key(k){
    if(!k){
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
    }else{
        localStorage.GPT_API_key=k
        check4key()
    }
        
}

async function send(url='https://api.openai.com/v1/models',opt={headers:{'Authorization':`Bearer ${key}`}}){ // list of models by default
    return await (await fetch('https://api.openai.com/v1/models',{headers:{'Authorization':`Bearer ${mod.key}`}})).json()
    // ...
}

async function listModels(){
    if(!models){
        models = await (await fetch('https://api.openai.com/v1/models',{headers:{'Authorization':`Bearer ${key}`}})).json()
    }
    return models    
}

async function retrieveModel(){
    return await (await fetch('https://api.openai.com/v1/models',{headers:{'Authorization':`Bearer ${key}`}})).json()
}

check4key() // checking for a key by default

export{
    hello,
    key,
    check4key,
    listModels,
    models,
    send
}
