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

// This defines your new type of node.
export type OobaboogaChatNode = ChartNode<
  "oobaboogaChat",
  OobaboogaChatNodeData
>;

// This defines the data that your new node will store.
export type OobaboogaChatNodeData = {
  prompt: string;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function oobaboogaChatNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const OobaboogaChatNodeImpl: PluginNodeImpl<OobaboogaChatNode> = {
    // This should create a new instance of your node type from scratch.
    create(): OobaboogaChatNode {
      const node: OobaboogaChatNode = {
        id: rivet.newId<NodeId>(),
        type: 'oobaboogaChat',
        data: {
          prompt: ''
        },
        title: 'Oobabooga Chat',
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
      data: OobaboogaChatNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      inputs.push({
        id: 'prompt' as PortId,
        dataType: 'string',
        title: 'Prompt',
        required: true,
      });

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: OobaboogaChatNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: 'output' as PortId,
          dataType: 'string',
          title: 'Output',
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        group: ['AI', 'Oobabooga'],
        contextMenuTitle: 'Oobabooga Chat',
        infoBoxTitle: 'Oobabooga Chat Node',
        infoBoxBody: 'Chat using the Oobabooga API',
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: OobaboogaChatNodeData
    ): EditorDefinition<OobaboogaChatNode>[] {
      return [
        {
          type: 'string',
          label: 'Prompt',
          dataKey: 'prompt',
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: OobaboogaChatNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return `Send chat to Oobabooga API`;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: OobaboogaChatNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const prompt = rivet.getInputOrData(data, inputData, 'prompt');
  
      const api = new OobaboogaAPI(); 
      let result = await api.run(prompt) as string;
  
      if (result == null) { result = 'Error' }
  
      return {
        ['output' as PortId]: {
          type: 'string',
          value: result
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const oobaboogaChatNode = rivet.pluginNodeDefinition(
    OobaboogaChatNodeImpl,
    "Example Plugin Node"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return oobaboogaChatNode;
}