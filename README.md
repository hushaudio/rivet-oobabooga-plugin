# Rivet Oobabooga Plugin
Integrate Iron Clads' Rivet with the Oobabooga text generation Web UI.

- Rivet Repository: [Iron Clads Rivet](https://github.com/Ironclad/rivet)

## UPDATE
Version 1.1 is now available. This version includes:

### BaseURL Support 
Settings option for the Oobabooga API base URL. This is useful for users who are serving the api on a different port or host than the default localhost:5000 of v1.02. 

### Unload Model Node
This node will unload the currently loaded model.  This is great for freeing up memory programatically or when you need to load a LoRA.  

### Lora Loading
You can now load loras with your models.  Only tested with Llama2 (7b, 13b, 34b)

Please note that when you load a model you need to load the LoRA with it, you cannot do them separately.
There are also some restrictions when using Llama2, I have needed to unload my Llama 2 models when I change a LoRA and only 1 LoRA works at a time.  Not tested with other models.

## REMOVED: 
Automatic Model List dropdown.  This has been removed for performance reasons.
## Installation
Import the plugin using the following CDN link via the Rivet project settings:

```
https://cdn.jsdelivr.net/gh/hushaudio/rivet-oobabooga-plugin@main/dist/oobabooga-rivet-v1_02.js
```

## Usage
This plugin facilitates communication with the Oobabooga text generation Web UI via its built-in API and click on the "Apply flags/extensions and restart" button.

**Note:** Launch Oobabooga with the `--api` flag for integration or go to session and tick on API. For API configuration, see [Oobabooga API Documentation](https://github.com/oobabooga/text-generation-webui#api).

### WSL2 Warning for Windows Users
If you're using WSL2, ensure the correct port is mapped to your localhost:

1. Fetch your WSL2 IP using `ip addr show eth0`.
2. Forward the port using `netsh`. For port 5000:

```
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=127.0.0.1 connectport=5000 connectaddress=<Your-WSL2-IP>
```

## Nodes
### Chat Node
Interacts with Oobabooga, submitting a prompt to a loaded model. Allows customization of params like `temperature` and `top_p` and a few more. Returns model response.

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