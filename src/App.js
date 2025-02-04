import React, { useState, useEffect } from "react";
import * as d3 from "d3";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // Add height property for balancing
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  rotateLeft(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  insert(value) {
    this.root = this._insertNode(this.root, value);
  }

  _insertNode(node, value) {
    if (!node) return new TreeNode(value);

    if (value < node.value) node.left = this._insertNode(node.left, value);
    else if (value > node.value)
      node.right = this._insertNode(node.right, value);
    else return node; // Duplicate values not allowed

    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    return this._balance(node);
  }

  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }

  _deleteNode(node, value) {
    if (!node) return null;

    if (value < node.value) node.left = this._deleteNode(node.left, value);
    else if (value > node.value)
      node.right = this._deleteNode(node.right, value);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let minNode = this._getMin(node.right);
      node.value = minNode.value;
      node.right = this._deleteNode(node.right, minNode.value);
    }

    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    return this._balance(node);
  }

  _getMin(node) {
    while (node.left) node = node.left;
    return node;
  }

  _balance(node) {
    let balance = this.getBalanceFactor(node);

    if (balance > 1) {
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left);
      }
      return this.rotateRight(node);
    }

    if (balance < -1) {
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right);
      }
      return this.rotateLeft(node);
    }

    return node;
  }

  clone() {
    const newTree = new AVLTree();
    newTree.root = this._cloneNode(this.root);
    return newTree;
  }

  _cloneNode(node) {
    if (!node) return null;
    const newNode = new TreeNode(node.value);
    newNode.left = this._cloneNode(node.left);
    newNode.right = this._cloneNode(node.right);
    newNode.height = node.height;
    return newNode;
  }
}

const BSTVisualizer = () => {
  const [bst, setBst] = useState(new AVLTree());
  const [treeData, setTreeData] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    drawTree();
  }, [treeData]);

  const handleInsert = () => {
    if (value === "") return;
    const newBst = bst.clone();
    newBst.insert(parseInt(value));
    setBst(newBst);
    setTreeData(newBst.root);
    setValue("");
  };

  const handleDelete = () => {
    if (value === "") return;
    const newBst = bst.clone();
    newBst.delete(parseInt(value));
    setBst(newBst);
    setTreeData(newBst.root);
    setValue("");
  };

  const handleReset = () => {
    setBst(new AVLTree());
    setTreeData(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInsert();
    }
  };

  const drawTree = () => {
    d3.select("#tree-container").selectAll("svg").remove();
    if (!treeData) return;

    const width = 800;
    const height = 380;
    const svg = d3
      .select("#tree-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const hierarchy = d3.hierarchy(treeData, (d) => {
      if (!d) return null;
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children;
    });

    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(hierarchy);

    svg
      .selectAll("line")
      .data(hierarchy.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x + 50)
      .attr("y1", (d) => d.source.y + 50)
      .attr("x2", (d) => d.target.x + 50)
      .attr("y2", (d) => d.target.y + 50)
      .attr("stroke", "black");

    svg
      .selectAll("circle")
      .data(hierarchy.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x + 50)
      .attr("cy", (d) => d.y + 50)
      .attr("r", 20)
      .style("fill", "lightblue");

    svg
      .selectAll("text")
      .data(hierarchy.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 50)
      .attr("y", (d) => d.y + 55)
      .attr("text-anchor", "middle")
      .text((d) => d.data.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">
          Binary Search Tree Visualizer 🌳
        </h1>

        <div className="flex gap-3 justify-center mb-6">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border px-4 py-2 rounded-md text-lg shadow-sm w-40 text-center outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter a number"
          />
          <button
            onClick={handleInsert}
            className="bg-green-500 px-4 py-2 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition transform hover:scale-105"
          >
            Insert
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 px-4 py-2 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition transform hover:scale-105"
          >
            Delete
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 px-4 py-2 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition transform hover:scale-105"
          >
            Reset
          </button>
        </div>

        <div
          id="tree-container"
          className="border p-4 w-full h-96 bg-gray-50 rounded-lg shadow-md"
        ></div>
      </div>
    </div>
  );
};
export default BSTVisualizer;
