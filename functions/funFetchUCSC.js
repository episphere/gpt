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
}
