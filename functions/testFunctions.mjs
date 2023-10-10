// GPT test functions
// https://platform.openai.com/docs/api-reference/chat/create#chat/create-functions
// https://openai.com/blog/function-calling-and-other-api-updates 

import wilcoxon from 'https://cdn.jsdelivr.net/gh/stdlib-js/stats-wilcoxon@esm/index.mjs';

const loaded=Date()

async function weather_nci(when){
    let x = await (await fetch('https://api.weather.gov/gridpoints/LWX/90,80/forecast')).json()
    let y = x.properties.periods.filter(xi=>xi.name==when.when)[0]
    console.log('weather at NCI Shady Grove:',y)
    return `Weather forecast for ${when.when}: ${y.detailedForecast}`
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
};

async function funFetchUCSC(parms){
    parms = parms||{
        genome:'hg38',
        chrom:'chr1',
        start:100000,
        end:100100
    }
    parms.genome=parms.genome||'hg38' // default assembly
    console.log('parms:',parms)
    //genome=hg38&chrom=1&start=100000&end=100100
    let url = 'https://api.genome.ucsc.edu/getData/sequence'
    Object.keys(parms).forEach((k,i)=>{
        if(i==0){
            url+=`?${k}=${parms[k]}`
        }else{
            url+=`;${k}=${parms[k]}`
        }
    })
    console.log(url)
    let res = await (await fetch(url)).json()
    return res.dna.toUpperCase()
    //return JSON.stringify(res)
    //debugger
}
const fetchUCSC = {   // at NCI Shady Grove
    "name": "funFetchUCSC",
    "description": "get sequence from human genome at chromossome position, from start to end of segment",
    "parameters": {
        "type": "object",
        "properties": {
            "genome": {
                "type": "string",
                "description":'genome assembly defined as "genome=hg<num>"',
                "enum": ["hg38", "hg37"]
            },
            "chrom": {
                "type": "string",
                "description":'chromossome number or letter, tipically "chr<num>"',
            },
            "start": {
                "type": "integer",
                "description":'starting position in the chromossome, use 100000 as the default value',
            },
            "end": {
                "type": "integer",
                "description":'end position in the chromossome, use 100100 as the default value',
            },
        }
    }
};

async function rankSumTest(parms){
    // lets do t-test to warm things up
    parms=parms||{
        population1:[1.83, 0.5, 1.62, 2.48, 1.68, 1.88, 1.55, 3.06, 1.3],
        population2:[0.878, 0.647, 0.598, 2.05, 1.06, 1.29, 1.06, 3.14, 1.29]
    }
    // get simple-statistics library
    // let st=await import('https://esm.sh/simple-statistics@7.8.3')
    // let z = st.tTestTwoSample(parms.population1,parms.population2)
    // return `the comparison of population [${parms.population1}] with [${parms.population2}] by a rank sum test assigns a p = ${st.cumulativeStdNormalProbability(z)} to the null hypothesis that they are similar`
    let wcTest = wilcoxon(parms.population1,parms.population2)
    wcTest.pValue
    return `the comparison of population [${parms.population1}] with [${parms.population2}] by Wilcoxon Rank Sum Test assigns a p = ${wcTest.pValue} to the null hypothesis that they are similar`
}

const rankSumTestDescription = {   // at NCI Shady Grove
    "name": "rankSumTest",
    "description": "statistical test comparing two popuations for significant distribution difference",
    "parameters": {
        "type": "object",
        "properties": {
            "population1": {
                "type": "array",
                "items": {
                  "type": "number"
                }
            },
            "population2": {
                "type": "array",
                "items": {
                  "type": "number"
                }
            }
        }
    }
};

export{
    weather,
    weather_nci,
    fetchUCSC,
    funFetchUCSC,
    rankSumTest,
    rankSumTestDescription
}