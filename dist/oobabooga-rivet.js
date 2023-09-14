var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/helpers/Oobabooga.ts
var OobaboogaAPI = class {
  constructor(host) {
    __publicField(this, "HOST");
    __publicField(this, "URI");
    __publicField(this, "models", []);
    this.HOST = host || "localhost:5000";
    this.URI = `http://${this.HOST}/api/v1/generate`;
  }
  // Equivalent to the 'run' function in Python
  async run(prompt2, props = {}) {
    const request = Object.assign(defaultChatProps, props, { prompt: prompt2 });
    console.log({ request });
    const response = await fetch(this.URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    if (response.status === 200) {
      const data = await response.json();
      return data.results[0].text;
    } else {
      return "Error";
    }
  }
  // Equivalent to the 'generate' function in Python
  async generate(prompt2, tokens = 200) {
    const request = { prompt: prompt2, max_new_tokens: tokens };
    const response = await fetch(`http://${this.HOST}/api/v1/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    if (response.status === 200) {
      const data = await response.json();
      return data.results[0].text;
    }
    return null;
  }
  // Equivalent to the 'model_api' function in Python
  async modelApi(request) {
    const response = await fetch(`http://${this.HOST}/api/v1/model`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    return await response.json();
  }
  async currentModelInfo() {
    return this.modelApi({ action: "info" });
  }
  async listModels() {
    return (await this.modelApi({ action: "list" }))?.result;
  }
  async loadModel(model_name) {
    return this.modelApi({ action: "load", model_name });
  }
  async complexModelLoad(model, args) {
    const guessGroupsize = (model_name) => {
      if (model_name.includes("1024g"))
        return 1024;
      if (model_name.includes("128g"))
        return 128;
      if (model_name.includes("32g"))
        return 32;
      return -1;
    };
    let req = {
      action: "load",
      model_name: model,
      args: Object.assign(defaultLoadArgs, args)
    };
    model = model.toLowerCase();
    if (model.includes("4bit") || model.includes("gptq") || model.includes("int4")) {
      req.args.wbits = 4;
      req.args.groupsize = guessGroupsize(model);
    } else if (model.includes("3bit")) {
      req.args.wbits = 3;
      req.args.groupsize = guessGroupsize(model);
    }
    if (model.includes("8bit")) {
      req.args.load_in_8bit = true;
    } else if (model.includes("-hf") || model.includes("fp16")) {
      if (model.includes("7b")) {
        req.args.bf16 = true;
      } else if (model.includes("13b")) {
        req.args.load_in_8bit = true;
      }
    } else if (model.includes("gguf")) {
      if (model.includes("7b")) {
        req.args.n_gpu_layers = 100;
      } else if (model.includes("13b")) {
        req.args.n_gpu_layers = 100;
      } else if (model.includes("30b") || model.includes("33b")) {
        req.args.n_gpu_layers = 59;
      } else if (model.includes("65b")) {
        req.args.n_gpu_layers = 42;
      }
    } else if (model.includes("rwkv")) {
      req.args.rwkv_cuda_on = true;
      if (model.includes("14b")) {
        req.args.rwkv_strategy = "cuda f16i8";
      } else {
        req.args.rwkv_strategy = "cuda f16";
      }
    }
    return await this.modelApi(req);
  }
};
var defaultChatProps = {
  prompt,
  max_new_tokens: 2048,
  auto_max_new_tokens: false,
  max_tokens_second: 0,
  preset: "None",
  do_sample: true,
  temperature: 0.2,
  top_p: 0.1,
  typical_p: 1,
  epsilon_cutoff: 0,
  eta_cutoff: 0,
  tfs: 1,
  top_a: 0,
  repetition_penalty: 1.18,
  repetition_penalty_range: 0,
  top_k: 40,
  min_length: 0,
  no_repeat_ngram_size: 0,
  num_beams: 1,
  penalty_alpha: 0,
  length_penalty: 1,
  early_stopping: false,
  mirostat_mode: 0,
  mirostat_tau: 5,
  mirostat_eta: 0.1,
  guidance_scale: 1,
  negative_prompt: "",
  seed: -1,
  add_bos_token: true,
  truncation_length: 2048,
  ban_eos_token: false,
  skip_special_tokens: true,
  stopping_strings: []
};
var defaultLoadArgs = {
  loader: "AutoGPTQ",
  bf16: false,
  load_in_8bit: false,
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
  rwkv_cuda_on: false
};

// src/nodes/Chat.ts
function oobaboogaChatNode(rivet) {
  const OobaboogaChatNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        type: "oobaboogaChat",
        data: {
          prompt: "Make sure you turn off the switch at the bottom to disable the prompt input in order to use this text box!  You will know its working if you see this in the node body.",
          max_new_tokens: 2048,
          usePromptInput: true,
          auto_max_new_tokens: false,
          max_tokens_second: 0,
          preset: "None",
          do_sample: true,
          temperature: 0.2,
          top_p: 0.1,
          typical_p: 1,
          epsilon_cutoff: 0,
          eta_cutoff: 0,
          tfs: 1,
          top_a: 0,
          repetition_penalty: 1.18,
          repetition_penalty_range: 0,
          top_k: 40,
          min_length: 0,
          no_repeat_ngram_size: 0,
          num_beams: 1,
          penalty_alpha: 0,
          length_penalty: 1,
          early_stopping: false,
          mirostat_mode: 0,
          mirostat_tau: 5,
          mirostat_eta: 0.1,
          guidance_scale: 1,
          negative_prompt: "",
          seed: -1,
          add_bos_token: true,
          truncation_length: 2048,
          ban_eos_token: false,
          skip_special_tokens: true,
          stopping_strings: []
        },
        title: "Oobabooga Chat",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.usePromptInput) {
        inputs.push({
          id: "prompt",
          dataType: "string",
          title: "Prompt",
          required: true
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "output",
          dataType: "string",
          title: "Output"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        group: ["AI", "Oobabooga"],
        contextMenuTitle: "Oobabooga Chat",
        infoBoxTitle: "Oobabooga Chat Node",
        infoBoxBody: "Chat using the Oobabooga API"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "code",
          label: "Prompt",
          dataKey: "prompt",
          language: "prompt-interpolation-markdown",
          theme: "prompt-interpolation",
          useInputToggleDataKey: "usePromptInput"
        },
        {
          type: "number",
          label: "Max New Tokens",
          dataKey: "max_new_tokens",
          min: 0,
          step: 1
        },
        {
          type: "toggle",
          label: "Do Sample",
          dataKey: "do_sample"
        },
        {
          type: "number",
          label: "Temperature",
          dataKey: "temperature",
          min: 0,
          step: 0.1,
          allowEmpty: true
        },
        {
          type: "number",
          label: "Top P",
          dataKey: "top_p",
          min: 0,
          step: 0.1,
          allowEmpty: true
        },
        {
          type: "number",
          label: "Top K",
          dataKey: "top_k",
          min: 0,
          step: 1,
          allowEmpty: true
        },
        {
          type: "number",
          label: "Num Beams",
          dataKey: "num_beams",
          min: 0,
          step: 1,
          allowEmpty: true
        },
        {
          type: "toggle",
          label: "Early Stopping",
          dataKey: "early_stopping"
        },
        {
          type: "number",
          label: "Seed",
          dataKey: "seed",
          allowEmpty: true
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return `Send chat to Oobabooga API${data.usePromptInput ? "" : "\n\nPrompt: " + rivet.getInputOrData(data, data, "prompt")} `;
    },
    async process(data, inputData, _context) {
      const prompt2 = rivet.getInputOrData(data, inputData, "prompt");
      const max_new_tokens = rivet.getInputOrData(data, inputData, "max_new_tokens");
      const do_sample = rivet.getInputOrData(data, inputData, "do_sample");
      const temperature = rivet.getInputOrData(data, inputData, "temperature");
      const top_p = rivet.getInputOrData(data, inputData, "top_p");
      const top_k = rivet.getInputOrData(data, inputData, "top_k");
      const num_beams = rivet.getInputOrData(data, inputData, "num_beams");
      const early_stopping = rivet.getInputOrData(data, inputData, "early_stopping");
      const seed = rivet.getInputOrData(data, inputData, "seed");
      const api2 = new OobaboogaAPI();
      let result = await api2.run(prompt2, {
        max_new_tokens,
        do_sample,
        temperature,
        top_p,
        top_k,
        num_beams,
        early_stopping,
        seed
      });
      if (result == null) {
        result = "Error";
      }
      return {
        ["output"]: {
          type: "string",
          value: result
        }
      };
    }
  };
  const oobaboogaChatNode2 = rivet.pluginNodeDefinition(
    OobaboogaChatNodeImpl,
    "Oobabooga Chat Node"
  );
  return oobaboogaChatNode2;
}

// src/nodes/LoadedModel.ts
function oobaboogaLoadedModelNode(rivet) {
  const OobaboogaLoadedModelNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        type: "oobaboogaLoadedModel",
        data: {
          model: "",
          prompt: ""
        },
        title: "Oobabooga Loaded Model",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "output",
          dataType: "string",
          title: "Model Name"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        group: ["AI", "Oobabooga"],
        contextMenuTitle: "Oobabooga Loaded Model",
        infoBoxTitle: "Oobabooga Loaded Model Node",
        infoBoxBody: "Oobabooga Loaded Model"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return `Fetch Currently Loaded Model`;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const api2 = new OobaboogaAPI();
      let info = await api2.currentModelInfo();
      if (info?.result == null) {
        return {
          ["output"]: {
            type: "string",
            value: "error: result was null"
          }
        };
      }
      return {
        ["output"]: {
          type: "string",
          value: info.result.model_name
        }
      };
    }
  };
  const oobaboogaLoadedModelNode2 = rivet.pluginNodeDefinition(
    OobaboogaLoadedModelNodeImpl,
    "Example Plugin Node"
  );
  return oobaboogaLoadedModelNode2;
}

// src/nodes/LoadModel.ts
var api = new OobaboogaAPI();
function oobaboogaLoadModelNode(rivet) {
  const OobaboogaLoadModelNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        type: "oobaboogaLoadModel",
        data: {
          model: ""
        },
        title: "Oobabooga Load Model",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "output",
          dataType: "boolean",
          title: "Success"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        group: ["AI", "Oobabooga"],
        contextMenuTitle: "Oobabooga Load Model",
        infoBoxTitle: "Oobabooga Load Model Node",
        infoBoxBody: "Oobabooga Model Loader - For this to work correctly you want to first load your model in Oobabooga with working settings, and then save the settings in Oobabooga.  Every time you load that model it will use those settings from then on"
      };
    },
    // This function defines all editors that appear when you edit your node.
    async getEditors() {
      const data = await api.listModels();
      return [
        {
          type: "dropdown",
          label: "Model",
          dataKey: "model",
          options: data.map((model) => ({ value: model, label: model }))
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return `Load Oobabooga Model: ${data?.model || "none"}`;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const model = rivet.getInputOrData(data, inputData, "model");
      if (!model)
        return {
          ["output"]: {
            type: "boolean",
            value: true
          }
        };
      const api2 = new OobaboogaAPI();
      let result = await api2.loadModel(model);
      if (result == null) {
        return {
          ["output"]: {
            type: "boolean",
            value: false
          }
        };
      }
      return {
        ["output"]: {
          type: "boolean",
          value: true
        }
      };
    }
  };
  const oobaboogaLoadModelNode2 = rivet.pluginNodeDefinition(
    OobaboogaLoadModelNodeImpl,
    "Example Plugin Node"
  );
  return oobaboogaLoadModelNode2;
}

// src/index.ts
var plugin = (rivet) => {
  const OobaboogaChatNode = oobaboogaChatNode(rivet);
  const OobaboogaLoadModelNode = oobaboogaLoadModelNode(rivet);
  const OoobaboogaLoadedModelNode = oobaboogaLoadedModelNode(rivet);
  const oobaboogaPlugin = {
    id: "oobabooga",
    name: "Oobabooga API",
    configSpec: {
      // oobaboogaBaseURL: {
      //   type: 'string',
      //   label: 'Oobabooga API Token',
      //   description: 'Your Oobabooga API Token.',
      //   helperText: 'Create at https://huggingface.co/settings/tokens',
      // },
      // oobaboogaAPIKey: {
      //   type: 'string',
      //   label: 'Base URL',
      //   description: 'Your Oobabooga API Base URL.',
      //   helperText: 'Create at https://huggingface.co/settings/tokens',
      // },
    },
    // contextMenuGroups: [
    //   {
    //     id: 'oobabooga',
    //     label: 'Oobabooga API',
    //   },
    // ],
    register(register) {
      register(OobaboogaChatNode);
      register(OobaboogaLoadModelNode);
      register(OoobaboogaLoadedModelNode);
    }
  };
  return oobaboogaPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
