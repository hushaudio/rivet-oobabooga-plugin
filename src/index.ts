import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";
import { oobaboogaChatNode } from './nodes/Chat';
import { oobaboogaLoadedModelNode } from './nodes/LoadedModel';
import { oobaboogaLoadModelNode } from './nodes/LoadModel';

const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const OobaboogaChatNode = oobaboogaChatNode(rivet);
  const OobaboogaLoadModelNode = oobaboogaLoadModelNode(rivet);
  const OoobaboogaLoadedModelNode = oobaboogaLoadedModelNode(rivet);

  const oobaboogaPlugin:RivetPlugin = {
    id: 'oobabooga',
    name: 'Oobabooga API',

    // configSpec: {
    //   oobaboogaBaseURL: {
    //     type: 'string',
    //     label: 'Oobabooga API URL',
    //     description: 'Your Oobabooga API Base URL.',
    //     helperText: 'Create at https://huggingface.co/settings/tokens',
    //   },
    //   oobaboogaAPIKey: {
    //     type: 'string',
    //     label: 'Base URL',
    //     description: 'Your Oobabooga API Base URL.',
    //     helperText: 'Create at https://huggingface.co/settings/tokens',
    //   },
    // },

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
    },
  };

  return oobaboogaPlugin

};

// Make sure to default export your plugin.
export default plugin;