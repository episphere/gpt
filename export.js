// exploring GPT APIs
// documentation: https://platform.openai.com/docs/api-reference/making-requests?lang=curl
// convert curl to fetch: https://www.scrapingbee.com/curl-converter/javascript-fetch

console.log(`${location.href}export.js imported`)

const hello=`hello GPT at ${Date()}`;
import showdown from 'https://cdn.jsdelivr.net/npm/showdown@2.1.0/+esm'  // markdown>html

var key = null //'null'
var models = false
let msgs=[]

async function check4key(k){
    if(!k){
        const msgTrue = 'API key found, provided to SDK'
        const msgFalse = 'No GPT API Key found, please generate one at https://platform.openai.com/account/api-keys'
        if((localStorage.GPT_API_key)&&(localStorage.GPT_API_key!='null')&&(localStorage.GPT_API_key.length>0)){
            console.log(msgTrue)
        }else{
            console.log(msgFalse)
            localStorage.GPT_API_key=prompt(msgFalse+' and provide it here: ')
        }
        // check that key is valid
        let backupKey = key
        key=localStorage.GPT_API_key
        let res = await completions('say hello')
        if(!res.error){
            console.log('key tested successfuly:',res)
        }else{
            key=backupKey // reinstate previous key
            localStorage.GPT_API_key=key
            console.log(res.error.message)
            localStorage.GPT_API_key=prompt('Unable to validate key. You can generate a new one at please generate one at https://platform.openai.com/account/api-keys. Please try again:')
            check4key()
        }
        // delete localStorage.GPT_API_key // if this machine cannot be trusted with a persistent API key
    }else{
        localStorage.GPT_API_key=k
        check4key()
    }
        
}

//async function completions(content='Say this is a test!',model='gpt-3.5-turbo',role='user',temperature=0.7){
async function completions(content='Say this is a test!',model='gpt-3.5-turbo-16k-0613',role='user',temperature=0.7,functionsImport){
    if(!model){
        model='gpt-3.5-turbo-16k-0613'
    }
    if(!role){
        role='user'
    }
    if(!temperature){
        temperature=0.7
    }

    let functionCall={}
    let obj = {
        model:model,
        messages:[
            {
                role:role,
                content:content
            }
        ],
        temperature:parseFloat(temperature),
    }
    if((obj.messages.length==1)&(obj.messages[0].content[0]=='[')){ //parse array if bassed back stringified
        obj.messages=JSON.parse(obj.messages[0].content)
    }
    if(functionsImport){ // functions being checked
        if(functionsImport.slice(0,4)=='http'){
            obj.functions=[]
            let funs = await import(functionsImport)
            Object.keys(funs).forEach(k=>{
                if(typeof(funs[k])=='object'){
                    obj.functions.push(funs[k])
                }else{
                    functionCall[k]=funs[k]
                }
            }) 
            //debugger
        }
    }
    console.log('obj',obj)
    //return await 
    let res = await
        (await fetch(`https://api.openai.com/v1/chat/completions`,
             {
                 method:'POST',
                 headers:{
                     'Authorization':`Bearer ${key}`,
                     'Content-Type': 'application/json',
                 },
                 body:JSON.stringify(obj)
             })
         ).json()
    if(res.error){
        let newKey = prompt(`Error: "${res.error.message}" :-(
        \n Please fix it and reset or provide new key` )
        if(newKey){
            if(newKey&(newKey.length>0)){
                localStorage.GPT_API_key=newKey
            }
        }
        debugger
    }
    if(res.choices[0].message.function_call){
        res.choices[0].message.content= await functionCall[res.choices[0].message.function_call.name](JSON.parse(res.choices[0].message.function_call.arguments))
    }
    /*
    res.choices.forEach(async c=>{
        if(c.finish_reason=='function_call'){
            res
            functionCall[c.message.function_call.name](JSON.parse(c.message.function_call.arguments))
            //functionCall[c.message.function_call.name](JSON.parse(c.message.function_call.arguments)).then(console.log)
        }
    })
    */
    return res
}

async function embeddings(content, model="text-embedding-ada-002") {
    return await 
        (await fetch(`https://api.openai.com/v1/embeddings`, {
            method:'POST',
            headers:{
            'Authorization':`Bearer ${key}`,
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                model: model,
                input: content
            })
        })).json()
}

async function listModels(){
    if(!models){
        models = await (await fetch('https://api.openai.com/v1/models',{headers:{'Authorization':`Bearer ${key}`}})).json()
    }
    return models   
}

async function retrieveModel(model='gpt-3.5-turbo-16k-0613'){
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
    div.classList.add('chatUIdiv')
    div.style.margin='20px'
    div.style.color='navy'
    function txt2html(txt){
        //showdown
        /*
        if(txt[0]=='<'){ // html
            return txt
        }else{
            return '<p>'+txt.replaceAll('\n','<br>')+'</p>'
        }
        */
        let cv = new showdown.Converter({
            //optionKey: 'value',
            //extensions:['twitter'],
        })
        return cv.makeHtml(txt)
        //return txt
    }
    div.innerHTML='<h3>A simple OpenAI Chat</h3>Model, Role, temperature (<span id="temperatureValue">0.7</span>) and Functions.<br>'
    // select model
    let selectModel=document.createElement('select')
    await listModels()
    models.data.forEach(m=>{
        let opt = document.createElement('option')
        selectModel.appendChild(opt)
        opt.value=m.id
        opt.textContent=m.id
    })
    selectModel.value='gpt-3.5-turbo-16k-0613'
    div.appendChild(selectModel)
    // select role
    let selectRole=document.createElement('select')
    selectRole.id = "selectRole"
    div.appendChild(selectRole);
    ['system','user','assistant'].forEach(r=>{
        let opt = document.createElement('option')
        selectRole.appendChild(opt)
        opt.value=r
        opt.textContent=r
    })
    selectRole.onchange=function(){
        if(this.value=='user'){
            selectFunctions.hidden=false
        }else{
            selectFunctions.hidden=true
        }
    }
    //selectRole.value='user'
    // set temperature
    let rangeTemperature=document.createElement('input')
    rangeTemperature.type='range'
    rangeTemperature.min=0
    rangeTemperature.max=2
    rangeTemperature.step=0.01
    rangeTemperature.value=0.7
    div.appendChild(rangeTemperature);
    rangeTemperature.onchange=()=>{
        div.querySelector('#temperatureValue').textContent=rangeTemperature.value
    }
    let selectFunctions=document.createElement('select');
    [
        "no functions",
        "http://localhost:8000/gpt/functions/testFunctions.mjs",
        "https://episphere.github.io/gpt/functions/testFunctions.mjs"
    ].forEach(url=>{
        let opt = document.createElement('option')
        opt.textContent= opt.value = url
        selectFunctions.appendChild(opt)
    })
    selectFunctions.hidden=true;
    div.appendChild(selectFunctions);
    let ta = document.createElement('textarea')
    ta.value='you are a helpful assistant'
    div.appendChild(ta)
    let btCopy = document.createElement('button')
    btCopy.textContent='copy'
    div.appendChild(btCopy)
    btCopy.onclick=function(){
        navigator.clipboard.writeText(ta.value)
    }
    let btClear = document.createElement('button')
    btClear.textContent='clear'
    btClear.onclick=function(){ta.value=''}
    div.appendChild(btClear)
    ta.style.width="100%"
    ta.style.height='5em'
    ta.style.color='blue'
    let count=0
    ta.onkeyup=async function(evt){
        if((evt.key=='Enter')&&(evt.shiftKey==false)){
            console.log('-------\nPrompt:\n\n'+ta.value)
            let prompt = ta.value.replace(/\s$/,'')
            ta.focus()
            ta.value=''
            let promptDiv = document.createElement('div')
            promptDiv.i=count
            //divDialog.appendChild(promptDiv)
            divDialog.prepend(promptDiv)
            promptDiv.classList.add(`prompt`)
            //promptDiv.innerHTML=`<span style="color:darkgreen;background-color:yellow;cursor:pointer" id="copySpan">${count+1})</span> ${prompt} [<span style='color:red;background-color:yellow;cursor:pointer' id="removeQA">remove</span>][<span style='color:blue;background-color:yellow;cursor:pointer' id="embedThis">embed this</span>][<span style='color:blue;background-color:yellow;cursor:pointer' id="embedSofar">embed so far</span>]`
            promptDiv.innerHTML=`<p style="background-color:lightgray"><span style="color:darkgreen;background-color:yellow;cursor:pointer" id="copySpan">${count+1})</span> (${selectRole.value}) [<span style='color:blue;background-color:yellow;cursor:pointer' id="embedThis">embed this</span>][<span style='color:blue;background-color:yellow;cursor:pointer' id="embedSofar">embed so far</span>]</p>${txt2html(prompt)}`
            //promptDiv.style.backgroundColor='lightgray'
            promptDiv.style.color='blue'
            promptDiv.querySelector('#copySpan').onclick=function(){
                this.parentElement.parentElement.parentElement.querySelector('textarea').value = prompt
            }
            //promptDiv.querySelector('#removeQA').onclick=async function(){
            //    await this.parentElement.parentElement.childNodes[count].remove();
            //    await this.parentElement.parentElement.childNodes[count].remove();
            //    count--
            //}
            promptDiv.querySelector('#embedThis').onclick=async function(){
                ta.value='...'
                let i = this.parentElement.parentElement.i
                let ebi= await embeddings(msgs[i].content)
                ta.value=ebi.data[0].embedding
            }
            promptDiv.querySelector('#embedSofar').onclick=async function(){
                ta.value='...'
                let i = this.parentElement.i
                let ebi= await embeddings(msgs.map(x=>x.content).join('; '))
                ta.value=ebi.data[0].embedding
            }
            let responseDiv = document.createElement('div')
            //divDialog.appendChild(responseDiv)
            divDialog.prepend(responseDiv)
            msgs.push({
                role:selectRole.value,
                content:prompt
            })
            count++
            if(selectRole.value=='user'){
                responseDiv.innerHTML='...'
                // check for functions
                
                completions(JSON.stringify(msgs),selectModel.value,selectRole.value,rangeTemperature.value,selectFunctions.value).then(x=>{
                    //console.log([prompt,selectModel.value,selectRole.value,rangeTemperature.value])
                    let res=x.choices[0].message.content
                    if(res){
                        if(res[0]=='{'){
                            res=JSON.parse(x.choices[0].message.content).content
                        }else if(res[0]=='['){
                            res=JSON.parse(res)[0].content
                        }
                    }  
                    responseDiv.innerHTML=txt2html(res)
                    //responseDiv.innerHTML=txt2html(x.choices[0].message.content)
                    //responseDiv.innerHTML=JSON.parse(x.choices[0].message.content)[0].content
                    //console.log('-------\nReply:\n\n'+x.choices[0].message.content)
                    //console.log('-------\nReply:\n\n'+responseDiv.innerHTML)
                    console.log('-------\nReply:\n\n'+res);
                    [...(responseDiv.querySelectorAll('pre>code.language-html'))].forEach(x=>{
                        let p = document.createElement('p')
                        p.innerHTML=x.innerText
                        x.parentElement.after(p)
                    })
                    if(x.choices[0].finish_reason=="function_call"){
                        console.log(`function_call:`,x)
                        let msg=x.choices[0].message
                        msgs.push(msg)
                        // show result in the UI
                        // continue back to the loop
                        //completions(JSON.stringify(msgs),selectModel.value,x.choices[0].message.role,rangeTemperature.value,selectFunctions.value).then(x=>{
                        // call with original message, this time without the function
                        // let xx = completions(JSON.stringify(msgs),selectModel.value,x.choices[0].message.role,rangeTemperature.value)
                        //    4
                        //})
                        ta.value=msgs.slice(-2)[0].content
                        // let oldFun=selectFunctions.value
                        selectFunctions.value = "no functions"
                        // ta.onkeyup({key:'Enter',shiftKey:false})
                        
                        
                    }else{
                        msgs.push(x.choices[0].message)
                        //msgs.push({
                        //    role:'assistant',
                        //    content:x.choices[0].message.content
                        //})
                        4
                    }   
                    //console.log(msgs)
                })
                //let funContent = await x.choices[0].message.function_call['name'](JSON.parse(x.choices[0].message.function_call.arguments))
            }else{  // move to user after system or assistant. Handle function role elsewhere
                selectRole.value='user'
                selectFunctions.hidden=false
            }
            console.log(msgs)
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
    embeddings,
    listModels,
    retrieveModel,
    models,
    chatUI,
    msgs
}
