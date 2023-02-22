import Constants from "./Constants";
import type { ECategories } from "./ENUMS";
import Math from "./Math";
import Strings from "./Strings";

export class NodeInstance{
    private uuid = "";
    public categories:ECategories[]
    public title:string;
    public description:string;
    public inputs:IParamIn[] = [];
    public outputs:IParamOut[] = [];
    public compute:(param:TIO)=>[TIO]
    
    constructor(params:INode){
        const {title,description,categories,inputs,outputs,compute} = params;
        this.title = title;
        this.description = description;
        this.categories=categories;
        this.inputs = inputs;
        this.outputs = outputs;
        this.compute = compute;
    }

    
    public set UUID(v : string) {
        this.uuid = v;
    } 
    public get UUID() : string {
        return this.uuid; 
    }
    
    
    public get inputValues() : TIO[] {
        return this.inputs.map(i=>i.value)
    }

    public addInput(label:string,type:TPinType,value:TIO,from:string|null=null){
        this.inputs.push({
            label,
            type,
            value,
            from
        });
        return this
    }

    public addOutput(label:string,type:TPinType,value:TIO,to:string|null=null){
        this.outputs.push({
            label,
            type,
            value,
            to
        });
        return this
    }

    public setOutputTo(index:number,nodeUUID:string){
        this.outputs[index].to = nodeUUID
    }
    public setInputFrom(index:number,nodeUUID:string){
        this.inputs[index].from = nodeUUID;
    }
}
const allNodes:INode[] = [
    ...Constants,
    ...Math,
    ...Strings
]

export default allNodes