
import React, { Component } from 'react';
import Queue from './Queue';
import uuid from 'uuid'

// Testing for string or number data type
const isId = x => !!~['string', 'number'].indexOf(typeof x)

/**
 * Graph Data Structure
 */
class Graph extends Component{

  constructor() {
    super()
    this.nodes = {}
    this.edges = []
  }

  /**
   * Creator for the new haters :)
   *
   * @returns {Graph} a new graph instance
   */
  static create() {
    return new Graph()
  }


  addNodeWithFunc(id, func,arg,true_id,false_id,nodeData) {
    // Node initialisation shorthands
    if (!nodeData) {
      nodeData = isId(id) ? { id } : id
    } else {
      nodeData.id = id
    }
    if (!nodeData.id) {
      nodeData.id = uuid()
      // Don't create a new node if it already exists
    } else if (this.nodes[nodeData.id]) {
      var node=  this.nodes[nodeData.id]
      node.func = func
      node.arg = arg
      if( true_id !== null ) {
        node.true_id = true_id
      }
      if ( false_id !== null ) {
        node.false_id = false_id
      }
      this.nodes[nodeData.id] = node
      return node
    }
    nodeData.edges = []
    nodeData.neighbour = []
    nodeData.func = func
    nodeData.arg = arg
    if( true_id !== null ) {
      nodeData.true_id = true_id
    }
    if ( false_id !== null ) {
      nodeData.false_id = false_id
    }
    this.nodes[nodeData.id] = nodeData
    return nodeData
  }

  /**
   * Add node if it doesn't exist yet.
   *
   * This method does not update an existing node.
   * If you want to update a node, just update the node object.
   *
   * @param {string|number|object} id or node data
   * @param {object|} nodeData (optional)
   * @returns {Node} the new or existing node
   */
  addNode(id, nodeData) {
    if (!nodeData) {
      nodeData = isId(id) ? { id } : id
    } else {
      nodeData.id = id
    }
    if (!nodeData.id) {
      nodeData.id = uuid()
    } else if (this.nodes[nodeData.id]) {
      return this.nodes[nodeData.id]
    }
    nodeData.edges = []
    nodeData.neighbour = []
    this.nodes[nodeData.id] = nodeData
    return nodeData

  }

  getNode(id) {
    return this.nodes[id]
  }


  isCyclic(queue,visited) {
     while(queue.getLength() > 0 ) {
       var node = queue.dequeue()
       if( visited[node.id] ) {
         return true;
       }
       else {
         visited[node.id] = true
         node.neighbour.forEach((x) =>  {
           queue.enqueue(x)
         });
       }
     }
     return false;
  }

  executeNode( node,timedelay ) {
    var func = node.func
    var arg = node.arg
    var result = func(arg)
    this.nodeAnimate(node,timedelay)
    if( result ) {
      if( node.true_id != null ) {
        this.executeNode (this.getNode(node.true_id),timedelay+1000)
      }
      else {
        return
      }
    }
    else {
      if( node.false_id != null ) {
        this.executeNode(this.getNode(node.false_id),timedelay+1000)
      }
      else {
        return
      }
    }
  }

  startExecution(start_node) {
    var timedelay = 0
    this.executeNode(start_node,timedelay)
  }

  nodeAnimate(currNode,timedelay) {

    currNode.shape.items.forEach((item) => {
      if( item.type !== 'text') {
          setTimeout(function(){ item.animate({ 'fill-opacity': 0.2 }, 500);},
              timedelay);
      }
    })
  }

  /**
   * @param {string|number|object} source node or ID
   * @param {string|number|object} target node or ID
   * @param the function that needs to be executed for node
   * @param the argument for the function
   * @param {object|} (optional) edge data, e.g. styles
   * @returns {Edge}
   */
  addEdge(source, target,func,arg,true_id,false_id, edgeData = {}) {
    const sourceNode = this.addNodeWithFunc(source,func,arg,true_id,false_id)
    const targetNode = this.addNode(target)
    edgeData.source = sourceNode
    edgeData.target = targetNode
    this.edges.push(edgeData)
    sourceNode.edges.push(edgeData)
    targetNode.edges.push(edgeData)
    sourceNode.neighbour.push(targetNode)
    return edgeData
  }

  /**
   * @param {string|number|Node} node node or ID
   * @return {Node}
   */
  removeNode(node) {
    const id = isId(node) ? node : node.id
    node = this.nodes[id]
    // Delete node from index
    delete this.nodes[id]
    // Delete node from all the edges
    this.edges.forEach((edge) => {
      if (edge.source === node || edge.target === node) {
        this.removeEdge(edge)
      }
    })
    return node
  }

  /**
   * Remove an edge by providing either two nodes (or ids) or the edge instance
   * @param {string|number|Node|Edge} node edge, node or ID
   * @param {string|number|Node} node node or ID
   * @return {Edge}
   */
  removeEdge(source, target) {
    let found
    // Fallback to only one parameter
    if (!target) {
      target = source.target
      source = source.source
    }
    // Normalise node IDs
    if (isId(source)) source = { id: source }
    if (isId(target)) target = { id: target }
    // Find and remove edge
    this.edges = this.edges.filter((edge) => {
      if (edge.source.id === source.id && edge.target.id === target.id) {
        found = edge
        return false
      }
      return true
    })
    if (found) {
      found.source.edges = found.source.edges.filter(edge => edge !== found)
      found.target.edges = found.target.edges.filter(edge => edge !== found)
    }
    // Return removed edge
    return found
  }

  toJSON() {
    return { nodes: this.nodes, edges: this.edges }
  }

}


export default Graph;
