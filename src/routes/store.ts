import {writable,readable, type Writable} from 'svelte/store';
import type NodeComponent from './lib/Nodes/Node.svelte';

export const startTick=readable(performance.now())
export const mouse:Writable<MouseEvent>=writable();
export const mouseClicks:Writable<{down:MouseEvent|null,up:MouseEvent|null}> = writable({down:null,up:null});
export const keyEvents = writable();
export const isPanning=writable(false);
export const iW=writable(1366);
export const iH=writable(768);
export const Zoom=writable(1);
export const viewBox=writable([0,0]);
export const contextVisible = writable(false);

export const isLinking = writable(false);
export const LinkBuilder:Writable<{from:{node:NodeComponent|undefined|null,pinIndex:number|null},to:{node:NodeComponent|undefined|null,pinIndex:number|null}}> = writable({
	from:{
		node:null,
		pinIndex:null
	},
	to:{
		node:null,
		pinIndex:null
	}
});
export const nodes:Writable<Map<string,NodeComponent>> = writable(new Map());
Zoom.subscribe((z)=>{
	if(z<1){
		Zoom.set(1);
	}
})