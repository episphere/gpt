// GPT test functions
// https://platform.openai.com/docs/api-reference/chat/create#chat/create-functions

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

function say_hello(date=Date()){
    console.log(`hello functions at`,date)
}

function say_goodbye(date=Date()){
    console.log(`hello functions at`,date)
}

/*

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
    say_hello
}