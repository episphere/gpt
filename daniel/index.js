function buildTable(res,id){
    let tbl= document.getElementById(id)
    tbl.innerText=""
    let headElement=tbl.createTHead()
    let tr=headElement.insertRow()
    let cols=[]
    Object.keys(res[0]).forEach(key=>{
        let tc=tr.insertCell()
        tc.outerHTML=`<th>${key}</th>`
        cols.push(key)
    })
    res.forEach(row => {
        tr=headElement.insertRow()
        cols.forEach(col=>{
            let tc=tr.insertCell()
            tc.innerText=row[col] ?? ""
        })
    })
}


let dataURL="https://data.montgomerycountymd.gov/resource/icn6-v9z3.json"
let crimeData = {}
let gpt={}
let gptdiv1 = ""
fetch(dataURL)
.then( (resp) => resp.json() )
.then( (obj)=>{
    let ri=document.getElementById("readyindicator")
    crimeData = obj
    window.crimeData = crimeData
    ri.classList.add("ready")
    ri.insertAdjacentText("beforeend","Montgomery county crime data loaded...")
    
    return import('../export.js')
}).then( (x) =>{
    gptdiv1=document.getElementById("GPTDiv_1")
    gpt=x
    return gpt.chatUI(gptdiv1)
}).then( async () =>{
    let url = "https://data.montgomerycountymd.gov/resource/icn6-v9z3.json?$where=date%3E%222023-02-1T00:00:00%22%20AND%20crimename3=%22ASSAULT%20-%20AGGRAVATED%20-%20GUN%22"
    let filteredData = await (await fetch(url)).json()


    buildTable(filteredData,"tbl1")

    let txt = filteredData.map(c=>Object.entries(c).reduce( (pv,cv)=> `${pv} ${cv[0]} ${cv[1]}`,"") ).reduce( (pv,cv)=>`${pv}\n${cv}`) +"\n\n"

    let question = "Tl/dr;"
    let q = txt + question
    let r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)


    question = "Which police district code responded to the most incidents in the data?"
    q = txt + question
    r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

    question = "According to the data, which city had the most incidents?"
    q = txt + question
    r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)
 

    question = "According to the data, which city had the most incidents?"
    q = txt + question
    r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

    question = "According to the data, which city had the most incidents?"
    q = txt + question
    r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)


    question = "According to the data, how many was the place a parking lot?"
    q = txt + question
    r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

    question = "According to the data, which date had the most incidents"
    q = txt + question
    r=await gpt.completions(q)
    gptdiv1.insertAdjacentHTML("beforeend",`<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

    console.log(filteredData)
    let textArea = document.querySelector("#GPTDiv_1 textarea")
    console.log(textArea)
    window.txt=txt;
    textArea.value=txt;
})
