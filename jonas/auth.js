// importing only the authentication bit of export.js

import { key, check4key as check_key } from "./export.js";

function double(x){
    return 2*x
}

export{
    key,
    check_key,
    double
}