import { ECategories } from "./ENUMS";

const NODE_STRINGS_SLICE:INode = {
    categories:[ECategories.STRINGS],
    title:"Slice",
    description:"Slice a string",
    inputs:[
        {
            label:"String to slice",
            type:"string",
            value:"",
            from:null
        },
        {
            label:"Slice Start",
            type:"number",
            value:null,
            from:null
        },
        {
            label:"Slice End",
            type:"number",
            value:null,
            from:null
        }
    ],
    outputs:[
        {
            label:"Result",
            type:"string",
            value:0,
            to:null
        }
    ],
    compute:(n:INode)=>{
        const [string,start,end] = n.inputs.map(i=>i.value);
        if(string=="" || (!start && !end)){return [string]}
        else if(start && !end){
            return [string.slice(start)]
        }
        return [
            string.slice(start,end)
        ]
    }
};

const NODE_STRINGS_REPLACE:INode = {
    categories:[ECategories.STRINGS],
    title:"Replace",
    description:"Replace part of, or all occurences of, a string with another string",
    inputs:[
        {
            label:"String to manipulate",
            type:"string",
            value:null,
            from:null
        },
        {
            label:"Substring to replace",
            type:"string",
            value:null,
            from:null
        },
        {
            label:"String to replace it with",
            type:"string",
            value:null,
            from:null
        }
    ],
    outputs:[
        {
            label:"Replaced string",
            type:"string",
            value:null,
            to:null
        }
    ],
    compute:(n:INode)=>{
        type params = [string,string,string];
        const [inString,reg,rep] = n.inputs.map(i=>i.value) as params;
        const r = new RegExp(reg,"g");
        if(!reg){return [null]}
        return [inString.replace(r,rep)]
    }
}

const NODE_STRINGS_LENGTH:INode = {
    categories:[ECategories.STRINGS],
    title:"Length",
    description:"Get the length of a string",
    inputs:[
        {
            label:"String to get length from",
            type:"string",
            value:null,
            from:null
        }
    ],
    outputs:[
        {
            label:"Length",
            type:"integer",
            value:null,
            to:null
        }
    ],
    compute:(n:INode)=>{
        return [n.inputs[0].value.length || NaN]
    }
}
export default [
    NODE_STRINGS_SLICE,
    NODE_STRINGS_REPLACE,
    NODE_STRINGS_LENGTH
]