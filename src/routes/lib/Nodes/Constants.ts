import { ECategories } from "./ENUMS";

const NODE_CONST_INT: INode = {
  categories: [ECategories.CONSTS, ECategories.MATH],
  title: "Integer Constant",
  description: "A constant integer",
  inputs: [],
  outputs: [
    {
      label: "Integer",
      type: "number",
      value: 0,
      to: null,
    },
  ],
  compute: (n: INode) => {
    return [n.outputs[0].value];
  },
};
const NODE_CONST_STRING: INode = {
  categories: [ECategories.CONSTS, ECategories.STRINGS],
  title: "String Constant",
  description: "A constant string",
  inputs: [],
  outputs: [
    {
      label: "String",
      type: "string",
      value: "",
      to: null,
    },
  ],
  compute: (n: INode) => {
    return [n.outputs[0].value];
  },
};

export default [NODE_CONST_INT, NODE_CONST_STRING];
