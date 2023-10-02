// GPT test functions
// https://platform.openai.com/docs/api-reference/chat/create#chat/create-functions
// https://openai.com/blog/function-calling-and-other-api-updates 

const loaded=Date()

const hello = {
    "name": "say_hello",
    "description": "say hello to functions",
    "parameters": {
        "type": "object",
        "properties": {
            "date": {
                "type": "string",
                "description": "date string"
            },
        }
    }
}

const bye = {
    "name": "say_goodbye",
    "description": "say goodbye to functions",
    "parameters": {
        "type": "object",
        "properties": {
            "date": {
                "type": "string",
                "description": "date string"
            },
        }
    }
}

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

function say_hello(date){
    console.log(`hello functions at`,date)
    console.log(`signed in to functions at ${Date()}`)
}

function say_goodbye(date){
    console.log(`goodbye functions at`,date)
    console.log(`signed out of functions at ${Date()}`)
}

async function weather_nci(when){
    let x = await (await fetch('https://api.weather.gov/gridpoints/LWX/90,80/forecast')).json()
    let y = x.properties.periods.filter(xi=>xi.name==when.when)[0]
    console.log('weather at NCI Shady Grove:',y)
    return `Weather forecast for ${when.when}: ${y.detailedForecast}`
}

/*
async fetchUCSC = async function(pams){
    parms = parms|{
        genome:'hg38',
        chr:1,
        start:100000,
        end:100100
    }
    genome=hg38&chrom=1&start=100000&end=100100
}

function hello(){
    console.log(`hello functions at ${loaded}`)
    return {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"]
              }
            },
            "required": ["location"]
        }
    }
}
*/

export{
    hello,
    bye,
    weather,
    say_hello,
    say_goodbye,
    weather_nci
}