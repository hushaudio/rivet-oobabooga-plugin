# Rivet Oobabooga Plugin

Integrate Iron Clads' Rivet with the Oobabooga text generation Web UI.

- Rivet Repository: [Iron Clads Rivet](https://github.com/Ironclad/rivet)

### WARNING
This repo is not up to date with the latest oobabooga since their update to their api.  This uses the old api format before the recent changes.

## UPDATE
Version 1.1 is now available. This version includes:

### BaseURL Support
Settings option for the Oobabooga API base URL. This is useful for users who are serving the API on a different port or host than the default localhost:5000 of v1.02.

### Model Loader Settings
You can now specify all model loading settings.

### Unload Model Node
This node will unload the currently loaded model. This is great for freeing up memory programmatically or when you need to load a LoRa.

### Lora Loading
You can now load loras with your models. Only tested with Llama2 (7b, 13b, 34b).

Please note that when you load a model, you need to load the LoRA with it; you cannot do them separately. There are also some restrictions when using Llama2; I have needed to unload my Llama2 models when I change a LoRA, and only 1 LoRA works at a time. Not tested with other models.

NOTE: There are times when I find the Oobabooga web UI can get buggy when loading LoRAs or changing models; sometimes it just requires a restart of the web UI. This is not an issue with the plugin but more with the state of LoRA technology and its implementation into the web UI. If you have trouble loading a model or LoRA, try restarting the web UI and then try again.

## REMOVED:
Automatic Model List dropdown has been removed for performance reasons. Now, simply enter the name of the model you wish to load, exactly as it appears in the Oobabooga web UI. Note that the input is case-sensitive.

<!-- ## Installation
Import the plugin using the following CDN link via the Rivet project settings:

```plaintext
https://cdn.jsdelivr.net/gh/hushaudio/rivet-oobabooga-plugin@main/dist/oobabooga-rivet-v1_1.js
``` -->

## Usage
This plugin facilitates communication with the Oobabooga text generation Web UI via its built-in API. Click on the "Apply flags/extensions and restart" button.

**Note:** Launch Oobabooga with the `--api` flag for integration or go to the session and tick on API. For API configuration, see [Oobabooga API Documentation](https://github.com/oobabooga/text-generation-webui#api).

### WSL2 Warning for Windows Users
If you're using WSL2, ensure the correct port is mapped to your localhost:

1. Fetch your WSL2 IP using `ip addr show eth0`.
2. Forward the port using `netsh`. For port 5000:

```plaintext
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=127.0.0.1 connectport=5000 connectaddress=<Your-WSL2-IP>
```

## Nodes
### Chat Node
Interacts with Oobabooga, submitting a prompt to a loaded model. Allows customization of parameters like `temperature` and `top_p`, among others. Returns the model response.

### Model Loader
Loads a model from the Oobabooga Web UI and sends a success message.

### Loaded Model
Fetches the name of the currently loaded model. Useful for verification.

### Unload Model
Unloads the currently loaded model and sends a success message.

## Demo
This repository includes a demo file illustrating basic node usage.

## Contribute
Contributions are welcome! Fork the repo and submit PRs. Questions? Contact me (HU$H) on the [Rivet Discord Server](https://discord.gg/zEwFVVpvWE).
