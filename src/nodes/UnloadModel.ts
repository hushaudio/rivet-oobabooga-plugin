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

// This defines the data that your new node will store.
export type OobaboogaUnloadModelNodeData = {
};

// This defines your new type of node.
export type OobaboogaUnloadModelNode = ChartNode<
  "oobaboogaUnloadModel",
  OobaboogaUnloadModelNodeData
>;

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function oobaboogaUnloadModelNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const OobaboogaUnloadModelNodeImpl: PluginNodeImpl<OobaboogaUnloadModelNode> = {
    // This should create a new instance of your node type from scratch.
    create(): OobaboogaUnloadModelNode {
      const node: OobaboogaUnloadModelNode = {
        id: rivet.newId<NodeId>(),
        type: 'oobaboogaUnloadModel',
        data: {
        },
        title: 'Oobabooga Unload Model',
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
      data: OobaboogaUnloadModelNodeData,
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
      _data: OobaboogaUnloadModelNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: 'success' as PortId,
          dataType: 'boolean',
          title: 'Success',
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        group: ['AI', 'Oobabooga'],
        contextMenuTitle: 'Oobabooga Unload Model',
        infoBoxTitle: 'Oobabooga Unload Model Node',
        infoBoxBody: 'Oobabooga Unload Model',
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: OobaboogaUnloadModelNodeData
    ): EditorDefinition<OobaboogaUnloadModelNode>[] {
      return [
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: OobaboogaUnloadModelNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return `Unload Currently Loaded Model`;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: OobaboogaUnloadModelNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {

      const baseUrl = _context.getPluginConfig('oobaboogaBaseURL');
      const api = new OobaboogaAPI(baseUrl);
  
      let completed = await api.modelApi({ action: 'unload' });
      
      if (completed.result?.model_name == null) { return {
          ['success' as PortId]: {
            type: 'boolean',
            value: true
          },
        }; 
      } else {
        return {
          ['success' as PortId]: {
            type: 'boolean',
            value: false
          },
        }; 
      }
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const oobaboogaUnloadModelNode = rivet.pluginNodeDefinition(
    OobaboogaUnloadModelNodeImpl,
    "Oobabooga Unload Model Node"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return oobaboogaUnloadModelNode;
}
