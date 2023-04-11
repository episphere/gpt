function buildTable(res, id) {
    let tbl = document.getElementById(id)
    tbl.innerText = ""
    let headElement = tbl.createTHead()
    let tr = headElement.insertRow()
    let cols = []
    Object.keys(res[0]).forEach(key => {
        let tc = tr.insertCell()
        tc.outerHTML = `<th>${key}</th>`
        cols.push(key)
    })
    res.forEach(row => {
        tr = headElement.insertRow()
        cols.forEach(col => {
            let tc = tr.insertCell()
            tc.innerText = row[col] ?? ""
        })
    })
}


// point 1 and point 2 should have longitude and laditude
let isPoint = (pt) => (pt) => !!(Number.parseFloat(pt.longitude) && Number.parseFloat(pt.latitude) &&
    Number.parseFloat(pt.longitude) <= 360. && Math.abs(Number.parseFloat(pt.latitude) <= 90))
let km_to_miles = (km) => km * 0.621371

function sphericalDistance(pt1, pt2) {
    if (!isPoint(pt1) || !isPoint(pt2)) throw Error('pt1 and pt2 must have valid latitude and longitude')

    let R = 6371000  // radius of Earth in meters
    let phi_1 = pt1.latitude * Math.PI/180.
    let phi_2 = pt2.latitude * Math.PI/180.

    let d_phi = (pt2.latitude - pt1.latitude) * Math.PI/180.
    let d_lambda = (pt2.longitude - pt1.longitude) * Math.PI/180.

    let a = Math.sin(d_phi/2.0)**2 + Math.cos(phi_1)*Math.cos(phi_2)*Math.sin(d_lambda/2.0)**2
    let c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

    // return in miles...
    return Math.round(R * c)/1000.
}

window.sphericalDistance=sphericalDistance

let dataURL = "https://data.montgomerycountymd.gov/resource/icn6-v9z3.json"
let crimeData = {}
let gpt = {}
let gptdiv1 = ""
fetch(dataURL)
    .then((resp) => resp.json())
    .then((obj) => {
        let ri = document.getElementById("readyindicator")
        crimeData = obj
        window.crimeData = crimeData
        ri.classList.add("ready")
        ri.insertAdjacentText("beforeend", "Montgomery county crime data loaded...")

        return import('../export.js')
    }).then((x) => {
        gptdiv1 = document.getElementById("GPTDiv_1")
        gpt = x
        return gpt.chatUI(gptdiv1)
    }).then(async () => {
        let url = "https://data.montgomerycountymd.gov/resource/icn6-v9z3.json?$where=date%3E%222023-02-1T00:00:00%22%20AND%20crimename3=%22ASSAULT%20-%20AGGRAVATED%20-%20GUN%22"
        let filteredData = await (await fetch(url)).json()


        buildTable(filteredData, "tbl1")

        let txt = filteredData.map(c => Object.entries(c).reduce((pv, cv) => `${pv} ${cv[0]} ${cv[1]}`, "")).reduce((pv, cv) => `${pv}\n${cv}`) + "\n\n"

        let question = "Tl/dr;"
        let q = txt + question
        let r = await gpt.completions(q, "gpt-3.5-turbo", "user", 0)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)


        question = "Which police district code responded to the most incidents in the data?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

        question = "According to the data, which city had the most incidents?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)


        question = "According to the data, which city had the most incidents?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

        question = "According to the data, which city had the most incidents?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)


        question = "According to the data, how many was the place a parking lot?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

        question = "According to the data, which date had the most incidents"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv1.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r.choices[0].message.content}</dd>`)

        let textArea = document.querySelector("#GPTDiv_1 textarea")
        textArea.value = txt;

        url = "https://data.montgomerycountymd.gov/resource/icn6-v9z3.json?$where=date%3E%222023-02-1T00:00:00%22%20AND%20crimename2=%22Aggravated%20Assault%22"
        let filteredData2 = await (await fetch(url)).json()
        txt = filteredData2.map(c => Object.entries(c).reduce((pv, cv) => `${pv} ${cv[0]} ${cv[1]}`, "")).reduce((pv, cv) => `${pv}\n${cv}`) + "\n\n"
        let gptdiv2 = document.getElementById("GPTDiv_2")
        buildTable(filteredData2, "tbl2")

        question = "Tl/dr;"
        q = txt + question
        r = await gpt.completions(q)
        if (r.error) {
            console.error(r.error.message)
            gptdiv2.insertAdjacentHTML("beforeend", `<div class="GPT-error">Error ${r.error.type} ${r.error.code}: ${r.error.message}</div>`)
            return;
        }
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)

        question = "Which police district code responded to the most incidents in the data?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)

        question = "According to the data, which city had the most incidents?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)


        question = "According to the data, which city had the most incidents?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)

        question = "According to the data, which city had the most incidents?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)


        question = "According to the data, how many was the place a parking lot?"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)

        question = "According to the data, which date had the most incidents"
        q = txt + question
        r = await gpt.completions(q)
        gptdiv2.insertAdjacentHTML("beforeend", `<dt>${question}</dt><dd>${r?.choices[0].message.content}</dd>`)

    })
