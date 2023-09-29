import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";
import { oobaboogaChatNode } from './nodes/Chat';
import { oobaboogaLoadedModelNode } from './nodes/LoadedModel';
import { oobaboogaLoadModelNode } from './nodes/LoadModel';
import { oobaboogaUnloadModelNode } from "./nodes/UnloadModel";

const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const OobaboogaChatNode = oobaboogaChatNode(rivet);
  const OobaboogaLoadModelNode = oobaboogaLoadModelNode(rivet);
  const OoobaboogaLoadedModelNode = oobaboogaLoadedModelNode(rivet);
  const OobaboogaUnloadModelNode = oobaboogaUnloadModelNode(rivet);

  const oobaboogaPlugin:RivetPlugin = {
    id: 'oobabooga',
    name: 'Oobabooga API',

    configSpec: {
      // oobaboogaAPIKey: {
      //   type: 'string',
      //   label: 'Oobabooga API Token',
      //   description: 'Your Oobabooga API Token.',
      //   helperText: 'Create at https://huggingface.co/settings/tokens',
      // },
      oobaboogaBaseURL: {
        type: 'string',
        label: 'Base URL',
        description: 'Your Oobabooga API Base URL',
        helperText: 'Default is http://localhost:5000',
      },
    },

    // contextMenuGroups: [
    //   {
    //     id: 'oobabooga',
    //     label: 'Oobabooga API',
    //   },
    // ],

    register(register:any) {
      register(OobaboogaChatNode);
      register(OobaboogaLoadModelNode);
      register(OoobaboogaLoadedModelNode);
      register(OobaboogaUnloadModelNode);
    },
  };

  return oobaboogaPlugin

};

// Make sure to default export your plugin.
export default plugin;