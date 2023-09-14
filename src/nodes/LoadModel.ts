// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";

import OobaboogaAPI from "../helpers/Oobabooga";

const api = new OobaboogaAPI()

// This defines the data that your new node will store.
export type OobaboogaLoadModelNodeData = {
  model: string;
};

// This defines your new type of node.
export type OobaboogaLoadModelNode = ChartNode<
  "oobaboogaLoadModel",
  OobaboogaLoadModelNodeData
>;

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function oobaboogaLoadModelNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const OobaboogaLoadModelNodeImpl: PluginNodeImpl<OobaboogaLoadModelNode> = {
    // This should create a new instance of your node type from scratch.
    create(): OobaboogaLoadModelNode {
      const node: OobaboogaLoadModelNode = {
        id: rivet.newId<NodeId>(),
        type: 'oobaboogaLoadModel',
        data: {
          model: ''
        },
        title: 'Oobabooga Model Loader',
        visualData: {
          x: 0,
          y: 0,
          width: 300,
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: OobaboogaLoadModelNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];
      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: OobaboogaLoadModelNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: 'output' as PortId,
          dataType: 'boolean',
          title: 'Success',
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        group: ['AI', 'Oobabooga'],
        contextMenuTitle: 'Oobabooga Model Loader',
        infoBoxTitle: 'Oobabooga Model Loader Node',
        infoBoxBody: 'Oobabooga Model Loader',
      };
    },

    // This function defines all editors that appear when you edit your node.
    async getEditors(): Promise<EditorDefinition<OobaboogaLoadModelNode>[]> {
      const data = await api.listModels()
      return [
        {
          type: 'dropdown',
          label: 'Model',
          dataKey: 'model',
          options: data.map((model:string) => ({ value: model, label: model })),
        }
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: OobaboogaLoadModelNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return `Load Oobabooga Model: ${data?.model || "none"}`;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: OobaboogaLoadModelNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const model = rivet.getInputOrData(data, inputData, 'model');
  
      if(!model) return {
        ['output' as PortId]: {
          type: 'boolean',
          value: true
        },
      };
  
      const api = new OobaboogaAPI(); 
  
      let result = await api.loadModel(model);
      
      if (result == null) { return {
          ['output' as PortId]: {
            type: 'boolean',
            value: false
          },
        }; 
      }
  
      return {
        ['output' as PortId]: {
          type: 'boolean',
          value: true
        },
      };
    }
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const oobaboogaLoadModelNode = rivet.pluginNodeDefinition(
    OobaboogaLoadModelNodeImpl,
    "Example Plugin Node"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return oobaboogaLoadModelNode;
}
