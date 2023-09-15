# Rivet Oobabooga Plugin
Integrate Iron Clads' Rivet with the Oobabooga text generation Web UI.

- Rivet Repository: [Iron Clads Rivet](https://github.com/Ironclad/rivet)

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

## Demo
This repository includes a demo file illustrating basic node usage.

## Contribute
Contributions are welcome! Fork the repo and submit PRs. Questions? Contact me (HU$H) on the [Rivet Discord Server](https://discord.gg/zEwFVVpvWE).