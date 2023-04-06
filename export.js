// exploring GPT APIs
// documentation: https://platform.openai.com/docs/api-reference/making-requests?lang=curl
// convert curl to fetch: https://www.scrapingbee.com/curl-converter/javascript-fetch

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

async function completions(content='Say this is a test!',model='gpt-3.5-turbo-0301',role='user',temperature=0.7){
    return await 
        (await fetch(`https://api.openai.com/v1/chat/completions`,
             {
                 method:'POST',
                 headers:{
                     'Authorization':`Bearer ${key}`,
                     'Content-Type': 'application/json',
                 },
                 body:JSON.stringify({
                     model:model,
                     messages:[
                         {
                             role:role,
                             content:content
                         }
                     ]
                 })
             })
         ).json()
}

async function listModels(){
    if(!models){
        models = await (await fetch('https://api.openai.com/v1/models',{headers:{'Authorization':`Bearer ${key}`}})).json()
    }
    return models    
}

async function retrieveModel(model='gpt-3.5-turbo-0301'){
    return await (await fetch(`https://api.openai.com/v1/models/${model}`,{headers:{'Authorization':`Bearer ${key}`}})).json()
}

async function chatUI(div){ // cerate a simple chat div
    if(!div){
        div = document.createElement('div')
        document.body.appendChild(div)
    }
    if(typeof(div)=='string'){
        div = document.getElementById(div)
    }
    function txt2html(txt){
        if(txt[0]=='<'){ // html
            return txt
        }else{
            return '<p>'+txt.replaceAll('\n','<br>')+'</p>'
        }
    }
    div.innerHTML='<h3>A simple OpenAI Chat</h3>Model, Role and temperature (<span id="temperatureValue">0.7</span>).<br>'
    // select model
    let selectModel=document.createElement('select')
    await listModels()
    models.data.forEach(m=>{
        let opt = document.createElement('option')
        selectModel.appendChild(opt)
        opt.value=m.id
        opt.textContent=m.id
    })
    selectModel.value='gpt-3.5-turbo-0301'
    div.appendChild(selectModel)
    // select role
    let selectRole=document.createElement('select')
    div.appendChild(selectRole);
    ['system','user','assistant'].forEach(r=>{
        let opt = document.createElement('option')
        selectRole.appendChild(opt)
        opt.value=r
        opt.textContent=r
    })
    selectRole.value='user'
    // set temperature
    let rangeTemperature=document.createElement('input')
    rangeTemperature.type='range'
    rangeTemperature.min=0
    rangeTemperature.max=1
    rangeTemperature.step=0.01
    rangeTemperature.value=0.7
    div.appendChild(rangeTemperature);
    rangeTemperature.onchange=()=>{
        div.querySelector('#temperatureValue').textContent=rangeTemperature.value
    }
    let ta = document.createElement('textarea')
    div.appendChild(ta)
    ta.style.width="100%"
    ta.style.height='5em'
    let count=0
    ta.onkeyup=async function(evt){
        if((evt.key=='Enter')&&(evt.shiftKey==false)){
            console.log('-------\nPrompt:\n\n'+ta.value)
            let prompt = ta.value
            ta.focus()
            ta.value=''
            let promptDiv = document.createElement('div')
            //divDialog.appendChild(promptDiv)
            divDialog.prepend(promptDiv)
            promptDiv.classList.add("promptDiv")
            count++
            promptDiv.innerHTML=`<span style="color:darkgreen;background-color:yellow;cursor:pointer" id="copySpan">${count})</span> ${prompt}`
            promptDiv.style.backgroundColor='lightgray'
            promptDiv.style.color='maroon'
            promptDiv.querySelector('#copySpan').onclick=function(){
                this.parentElement.parentElement.parentElement.querySelector('textarea').value = prompt
            }
            let responseDiv = document.createElement('div')
            //divDialog.appendChild(responseDiv)
            divDialog.prepend(responseDiv)
            responseDiv.innerHTML='...'
            completions(prompt,selectModel.value,selectRole.value,rangeTemperature.value).then(x=>{
                //console.log([prompt,selectModel.value,selectRole.value,rangeTemperature.value])
                responseDiv.innerHTML=txt2html(x.choices[0].message.content)
                console.log('-------\nReply:\n\n'+x.choices[0].message.content)
            })
            
        }
    }
    let divDialog = document.createElement('div')
    div.appendChild(divDialog)
    return div
}

check4key() // checking for a key by default

export{
    hello,
    key,
    check4key,
    completions,
    listModels,
    retrieveModel,
    models,
    chatUI
}
