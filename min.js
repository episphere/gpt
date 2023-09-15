// importing only basic functionality of export.js
// no UI components included, no auth thrigger

import { 
    key,
    check4key,
    completions,
    embeddings,
    listModels,
    retrieveModel,
    models 
} from "https://episphere.github.io/gpt/export.js";

// note check4key() auth trigger not included

export {
    key,
    check4key,
    completions,
    embeddings,
    listModels,
    retrieveModel,
    models 
}
