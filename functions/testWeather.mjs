// GPT test functions
// https://platform.openai.com/docs/api-reference/chat/create#chat/create-functions
// https://openai.com/blog/function-calling-and-other-api-updates 

const weather = {   // at NCI Shady Grove
    "name": "weather_nci",
    "description": "weather forecast at NCI Shady Grove",
    "parameters": {
        "type": "object",
        "properties": {
            "when": {
                "type": "string",
                "enum": ["Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday","Sunday"]
            }
        }
    }
}

async function weather_nci(when){
    let x = await (await fetch('https://api.weather.gov/gridpoints/LWX/90,80/forecast')).json()
    let y = x.properties.periods.filter(xi=>xi.name==when.when)[0]
    console.log('weather at NCI Shady Grove:',y)
}

export{
    weather,
    weather_nci
}