// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface INode{
		uuid?:string,
		categories:ECategories[],
		title:string,
		description:string,
		inputs:IParamIn[],
		outputs:IParamOut[],
		compute:(TIO)=>[TIO]
	}
	
	type TPrimitive = number|string|boolean|bigint|symbol|undefined|null;
	type TObj = Record<string|number,TIO>
	type TIO = TPrimitive|Date|Record<string,TObj>|Map<string,TIO>|Set<TIO>
	type TPinType = "number"|"integer"|"float"|"string"|"boolean"|"date";
	interface IParam {
		label:string,
		type:TPinType
		value:TIO
	}
	interface IParamIn extends IParam{
		from:string|null|undefined
	}
	interface IParamOut extends IParam{
		to:string|null|undefined
	}
}

export {};

