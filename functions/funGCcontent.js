function funGCcontent(parms){
    parms = parms||{
        sequence:'AGAAGGAAAACGGGAAACTTCACAATTAGTGAATATTTAAAAACAGACTCTTAAGAAACCAAAGGATCAAGGAAGATACCACAGGGAAAAATAGAGAATA'
    }
    // calculate GC funGCcontent
    let GClength = parms.sequence.toUpperCase().split('').filter(x=>(x=='G'|x=='C')).length
    let seqLength = parms.sequence.length
    return `GC content is ${GClength}/${seqLength} = ${GClength/seqLength}`
}
