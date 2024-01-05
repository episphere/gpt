
const soccer = { 
    "name": "nci_soccer_v2",
    "description": "Occupational coding",
    "parameters": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "What is your Job Title"
            },
            "task": {
                "type": "string",
                "description":"What do you do at work"
            },
        }
    }
};
async function soccerFunction(params){
    params.n=1
    params.title=params.title||''
    params.task=params.task||''
    console.log('params:',params)
    
    //genome=hg38&chrom=1&start=100000&end=100100
    let function_params = new URLSearchParams(params)
    let url = 'https://soccer-myconnect.cancer.gov/soccer/code?'+function_params.toString()
    
    let res = await (await fetch(url)).json()
    return `SOCcer thinks the best code is ${res[0].code} ${res[0].label} with a score of ${res[0].score}`
    //return JSON.stringify(res)
    //debugger
}

window.soccerFunction=soccerFunction