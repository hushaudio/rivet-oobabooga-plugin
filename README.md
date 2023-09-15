# rivet oobabooga plugin
Iron Clads Rivet Nodes for api integration with oobabooga text generation webui 

Rivet: https://github.com/Ironclad/rivet
## Installation
To import the plugin, copy this link and paste it in the import box in the plugin section of the rivet project settings.
```
https://cdn.jsdelivr.net/gh/hushaudio/rivet-oobabooga-plugin@main/dist/oobabooga-rivet.js
```

## Nodes

### Chat node
This is for communicating with Oobabooga.  It requests the given prompt from the loaded model.  There are options for setting the temperature and top_p values.  The output is the response from the model.

### Mode Loader
this is for loading a model from the oobabooga webui.  It will load the model and then send a success message to the output.

### Loaded Model
This gets the name of the model (a string) that is name the loaded model.  You can use this to check if the correct model is loaded for the desired task.

## Demo
Included in this repo is a demo file that shows the most basic usage of these nodes. 