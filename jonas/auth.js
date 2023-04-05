// importing only the authentication bit of export.js

import { key, check4key } from "./export.js";

// Note export.js runs check3key automatically. 
// Look for the line with:

check4key() 

export{
    key,
    //check4key
}