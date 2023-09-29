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

import OobaboogaAPI, { LoaderTypes } from "../helpers/Oobabooga";

// This defines the data that your new node will store.
export type OobaboogaLoadModelNodeData = {
  model: string;
  loras: string;
  mode: string;
  loadIn8Bit: boolean;
  loader: LoaderTypes;
  bf16: boolean;
  groupsize: number;
  wbits: number;
  threads: number;
  n_batch: number;
  no_mmap: boolean;
  mlock: boolean;
  cache_capacity: any;
  n_gpu_layers: number;
  n_ctx: number;
  rwkv_strategy: any;
  rwkv_cuda_on: boolean;
  load_in_4bit: boolean;
  compute_dtype: string;
  quant_type: string;
  use_double_quant: boolean;
  cpu: boolean;
  auto_devices: boolean;
  gpu_memory: any;
  cpu_memory: any;
  disk: boolean;
  disk_cache_dir: string;
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
          model: '',
          loras: '',
          mode: 'instruct',
          loadIn8Bit: false,
          loader: 'AutoGPTQ',
          bf16: false,
          groupsize: 0,
          wbits: 0,
          threads: 0,
          n_batch: 512,
          no_mmap: false,
          mlock: false,
          cache_capacity: null,
          n_gpu_layers: 0,
          n_ctx: 2048,
          rwkv_strategy: null,
          rwkv_cuda_on: false,
          load_in_4bit: false,
          compute_dtype: 'float16',
          quant_type: 'nf4',
          use_double_quant: false,
          cpu: false,
          auto_devices: false,
          gpu_memory: null,
          cpu_memory: null,
          disk: false,
          disk_cache_dir: 'cache',
        },
        title: 'Oobabooga Load Model',
        visualData: {
          x: 0,
          y: 0,
          width: 400,
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
        {
          id: 'message' as PortId,
          dataType: 'string',
          title: 'Message',
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        group: ['AI', 'Oobabooga'],
        contextMenuTitle: 'Oobabooga Load Model',
        infoBoxTitle: 'Oobabooga Load Model Node',
        infoBoxBody: 'Oobabooga Model Loader - For this to work correctly you want to first load your model in Oobabooga with working settings, and then save the settings in Oobabooga.  Every time you load that model it will use those settings from then on',
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(): EditorDefinition<OobaboogaLoadModelNode>[] {
      return [
        {
          type: 'string',
          label: 'Model',
          dataKey: 'model'
        },
        {
          type: 'string',
          label: 'Loras (comma separated)',
          dataKey: 'loras'
        },
        {
          type: 'string',
          label: 'Mode',
          dataKey: 'mode'
        },
        {
          type: 'toggle',
          label: 'Load in 8 Bit',
          dataKey: 'loadIn8Bit'
        },
        {
          type: 'dropdown',
          label: 'Loader',
          dataKey: 'loader',
          options: [
            {
              value: 'AutoGPTQ',
              label: 'AutoGPTQ'
            },
            {
              value: 'Transformers',
              label: 'Transformers'
            }, 
            {
              value: 'ExLlama' ,
              label: 'ExLlama'
            },
            {
              value: 'ExLlama_HF',
              label: 'ExLlama_HF'
            },
            {
              value: 'GPTQ-for-LLaMa',
              label: 'GPTQ-for-LLaMa'
            },
            {
              value: 'llama.cpp',
              label: 'llama.cpp'
            },
            {
              value: 'llamacpp_HF',
              label: 'llamacpp_HF'
            },
            {
              value: 'ctransformers',
              label: 'ctransformers'
            }
          ]
        },
        {
          type: 'toggle',
          label: 'Load in 4 Bit',
          dataKey: 'load_in_4bit'
        },
        {
          type: 'string',
          label: 'Compute DType',
          dataKey: 'compute_dtype'
        },
        {
          type: 'string',
          label: 'Quant Type',
          dataKey: 'quant_type'
        },
        {
          type: 'toggle',
          label: 'Use Double Quant',
          dataKey: 'use_double_quant'
        },
        {
          type: 'toggle',
          label: 'BF16',
          dataKey: 'bf16'
        },
        {
          type: 'number',
          label: 'Group Size',
          dataKey: 'groupsize'
        },
        {
          type: 'number',
          label: 'WBits',
          dataKey: 'wbits'
        },
        {
          type: 'number',
          label: 'Threads',
          dataKey: 'threads'
        },
        {
          type: 'number',
          label: 'N Batch',
          dataKey: 'n_batch'
        },
        {
          type: 'toggle',
          label: 'No MMap',
          dataKey: 'no_mmap'
        },
        {
          type: 'toggle',
          label: 'MLock',
          dataKey: 'mlock'
        },
        {
          type: 'string',
          label: 'Cache Capacity',
          dataKey: 'cache_capacity'
        },
        {
          type: 'number',
          label: 'N GPU Layers',
          dataKey: 'n_gpu_layers'
        },
        {
          type: 'number',
          label: 'N CTX',
          dataKey: 'n_ctx'
        },
        {
          type: 'string',
          label: 'RWKV Strategy',
          dataKey: 'rwkv_strategy'
        },
        {
          type: 'toggle',
          label: 'RWKV CUDA On',
          dataKey: 'rwkv_cuda_on'
        },
        {
          type: 'toggle',
          label: 'Auto Devices',
          dataKey: 'auto_devices'
        },
        {
          type: 'string',
          label: 'GPU Memory',
          dataKey: 'gpu_memory'
        },
        {
          type: 'toggle',
          label: 'CPU',
          dataKey: 'cpu'
        },
        {
          type: 'string',
          label: 'CPU Memory',
          dataKey: 'cpu_memory'
        },
        {
          type: 'toggle',
          label: 'Disk',
          dataKey: 'disk'
        },
        {
          type: 'string',
          label: 'Disk Cache Dir',
          dataKey: 'disk_cache_dir'
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
      
      // we dont want to send an empty string or array to the API
      // or it will try to load it as a lora path
      let loras = rivet.getInputOrData(data, inputData, 'loras')
                    .split(',')
                    .map(l => l.trim())
                    .filter(l => l !== '')

      const mode = rivet.getInputOrData(data, inputData, 'mode');
      const load_in_8bit = rivet.getInputOrData(data, inputData, 'loadIn8Bit');
    
      // New Parameters
      const loader = rivet.getInputOrData(data, inputData, 'loader') as LoaderTypes
      const bf16 = rivet.getInputOrData(data, inputData, 'bf16');
      const groupsize = rivet.getInputOrData(data, inputData, 'groupsize') as any as number;
      const wbits = rivet.getInputOrData(data, inputData, 'wbits');
      const threads = rivet.getInputOrData(data, inputData, 'threads');
      const n_batch = rivet.getInputOrData(data, inputData, 'n_batch');
      const no_mmap = rivet.getInputOrData(data, inputData, 'no_mmap');
      const mlock = rivet.getInputOrData(data, inputData, 'mlock');
      const cache_capacity = rivet.getInputOrData(data, inputData, 'cache_capacity');
      const n_gpu_layers = rivet.getInputOrData(data, inputData, 'n_gpu_layers');
      const n_ctx = rivet.getInputOrData(data, inputData, 'n_ctx');
      const rwkv_strategy = rivet.getInputOrData(data, inputData, 'rwkv_strategy');
      const rwkv_cuda_on = rivet.getInputOrData(data, inputData, 'rwkv_cuda_on');
      const load_in_4bit = rivet.getInputOrData(data, inputData, 'load_in_4bit');
      const compute_dtype = rivet.getInputOrData(data, inputData, 'compute_dtype');
      const quant_type = rivet.getInputOrData(data, inputData, 'quant_type');
      const use_double_quant = rivet.getInputOrData(data, inputData, 'use_double_quant');
      const cpu = rivet.getInputOrData(data, inputData, 'cpu');
      const auto_devices = rivet.getInputOrData(data, inputData, 'auto_devices');
      const gpu_memory = rivet.getInputOrData(data, inputData, 'gpu_memory');
      const cpu_memory = rivet.getInputOrData(data, inputData, 'cpu_memory');
      const disk = rivet.getInputOrData(data, inputData, 'disk');
      const disk_cache_dir = rivet.getInputOrData(data, inputData, 'disk_cache_dir');
    
      console.log
      if (!model && !loras) return {
        ['output' as PortId]: {
          type: 'boolean',
          value: false
        },
      };
    
      if (!model && loras) return {
        ['output' as PortId]: {
          type: 'boolean',
          value: false
        },
        ['message' as PortId]: {
          type: 'string',
          value: "You must select a model to a load a LoRA"
        },
      };

      const reqBody = {
        lora: loras.length > 0 ? loras : [],
        mode: mode as 'chat'|'instruct',
        load_in_8bit: load_in_8bit ? true : false,
        loader,
        bf16: bf16 ? true : false,
        load_in_4bit,
        groupsize,
        wbits,
        threads,
        n_batch,
        no_mmap,
        mlock,
        cache_capacity,
        n_gpu_layers,
        n_ctx,
        rwkv_strategy,
        rwkv_cuda_on,
        compute_dtype,
        quant_type,
        use_double_quant,
        cpu,
        auto_devices,
        gpu_memory,
        cpu_memory,
        disk,
        disk_cache_dir
      }
      console.log(reqBody);
      
      const baseUrl = _context.getPluginConfig('oobaboogaBaseURL');
      const api = new OobaboogaAPI(baseUrl);
      
      let result = await api.loadModel(model, reqBody);
    
      if (result == null) {
        return {
          ['output' as PortId]: {
            type: 'boolean',
            value: false
          },
        };
      }

      let message = 'Model loaded successfully'

      if (result?.error?.message) {
        message = `Error: ${result.error.message}`;
      }

      return {
        ['output' as PortId]: {
          type: 'boolean',
          value: true
        },
        ['message' as PortId]: {
          type: 'string',
          value: message
        },
      };
    }    
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const oobaboogaLoadModelNode = rivet.pluginNodeDefinition(
    OobaboogaLoadModelNodeImpl,
    "Oobabooga Load Model Node"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return oobaboogaLoadModelNode;
}
