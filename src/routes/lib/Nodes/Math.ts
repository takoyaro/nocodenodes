import { ECategories } from "./ENUMS";

const NODE_MATH_ADD: INode = {
  categories: [ECategories.MATH],
  title: "Add",
  description: "Add two numbers",
  inputs: [
    {
      label: "Number #1",
      type: "number",
      value: 0,
      from: null,
    },
    {
      label: "Number #2",
      type: "number",
      value: 0,
      from: null,
    },
  ],
  outputs: [
    {
      label: "Result",
      type: "number",
      value: 0,
      to: null,
    },
  ],
  compute: (n: INode) => {
    return [n.inputs.map((n) => n.value).reduce((a, b) => +a + +b)];
  },
};
const NODE_MATH_SUB: INode = {
  categories: [ECategories.MATH],
  title: "Subtract",
  description: "Subtract two numbers",
  inputs: [
    {
      label: "Number #1",
      type: "number",
      value: 0,
      from: null,
    },
    {
      label: "Number #2",
      type: "number",
      value: 0,
      from: null,
    },
  ],
  outputs: [
    {
      label: "Result",
      type: "number",
      value: 0,
      to: null,
    },
  ],
  compute: (n: INode) => {
    return [n.inputs.map((n) => n.value).reduce((a, b) => +a - +b)];
  },
};
const NODE_MATH_DIVIDE: INode = {
  categories: [ECategories.MATH],
  title: "Divide",
  description: "Divide two numbers",
  inputs: [
    {
      label: "Number #1",
      type: "number",
      value: 0,
      from: null,
    },
    {
      label: "Number #2",
      type: "number",
      value: 0,
      from: null,
    },
  ],
  outputs: [
    {
      label: "Result",
      type: "number",
      value: 0,
      to: null,
    },
  ],
  compute: (n: INode) => {
    return [+n.inputs[0].value / +n.inputs[1].value];
  },
};
const NODE_MATH_MULTIPLY: INode = {
  categories: [ECategories.MATH],
  title: "Multiply",
  description: "Multiply two numbers",
  inputs: [
    {
      label: "Number #1",
      type: "number",
      value: 0,
      from: null,
    },
    {
      label: "Number #2",
      type: "number",
      value: 0,
      from: null,
    },
  ],
  outputs: [
    {
      label: "Result",
      type: "number",
      value: 0,
      to: null,
    },
  ],
  compute: (n: INode) => {
    return [+n.inputs[0].value * +n.inputs[1].value];
  },
};
export default [
  NODE_MATH_ADD,
  NODE_MATH_SUB,
  NODE_MATH_DIVIDE,
  NODE_MATH_MULTIPLY,
];
