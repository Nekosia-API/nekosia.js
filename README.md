# 🖼️ Nekosia.js API — Random Anime Images
Nekosia.js is a Node.js module that provides easy access to the Nekosia API, a rich source of anime-themed images.
The API offers a wide range of categories, allowing you to quickly and flexibly search for images according to your preferences and needs.
You decide what images you want to retrieve, which makes our API stand out from others.

But that's not all! The API also supports sessions (based on user ID or IP address), helping to avoid repeated images.


## 🔍 Key Features of the API
- **Wide range of categories:** Nekosia API offers [virtually every kind of anime graphic](https://nekosia.cat/documentation?page=api-endpoints#main-categories), not limited to neko images.
- **High image quality:** All images are carefully selected and checked for quality and appropriateness.
- **Sessions:** The API supports sessions (based on ID or IP address), which helps avoid duplicate images.
- **Dominant colors:** The API returns a palette of dominant colors for each image.
- **Image compression:** JSON responses include a link to a compressed image that is much smaller than the original. This can be useful if you want images to load quickly on client devices without sacrificing quality.
- **Security:** Nekosia API ensures that all provided content is free from NSFW material, making it one of the most trusted sources of anime-themed images.

...and that’s not all!


## 📘 Custom Booru
Nekosia also offers its own Booru, allowing you to browse images returned by the API.
Users can edit image information, such as tags, which are crucial for us.


## 📄 Documentation
Check out the [official documentation](https://nekosia.cat/documentation) to learn more.


## 📦 Instalacja
To install the Nekosia.js module, use the following command:

```bash
npm install neksosia.js
```


## 🔤 Lista tagów
You can find the main image categories [here](https://nekosia.cat/documentation?page=api-endpoints#tags-and-categories).
The full list of tags is available [on the Booru site](https://nekosia.cat/booru/tags).


## 🤔 Examples

### Simple
It's really not difficult...

```js
const { NekosiaAPI } = require('nekosia.js');

(async () => {
	const response = await NekosiaAPI.fetchImages('catgirl');
	console.log(response); // Sample response: https://nekosia.cat/documentation?page=api-endpoints#example-response
})();
```


### IP-based Sessions
In this example, we used an IP-based session. What does this mean? Thanks to this solution, a user with a specific IP address will not encounter duplicates when randomly selecting images.

```js
const { NekosiaAPI } = require('nekosia.js');

(async () => {
	const response = await NekosiaAPI.fetchImages('catgirl', {
		session: 'ip',
		count: 1,
		additionalTags: [],
		blacklistedTags: []
	});

	console.log(response);
})();
```

### ID-based Sessions
You can also use `id`, but this will require providing a user identifier (e.g., from Discord). Pass this information in `id` as a string.

```js
const { NekosiaAPI } = require('nekosia.js');

(async () => {
	const response = await NekosiaAPI.fetchImages('catgirl', {
		session: 'id',
		id: '561621386765971781',
		count: 1,
		additionalTags: [],
		blacklistedTags: []
	});

	console.log(response);
})();
```

## Versions
```js
const { NekosiaVersion } = require('nekosia.js');

(async () => {
	console.log(NekosiaVersion.module); // Returns the installed module version
	console.log(await NekosiaVersion.api()); // Returns the current API version used by the module
})();
``` 


## ⭐ » Thanks
If you find the API or this module useful, consider giving a star to the [repository](https://github.com/sefinek24/nekosia.js).
If you have questions or issues, create a new [Issue](https://github.com/sefinek24/email-validator/issues/new) or join the [serwer Discord](https://discord.gg/pba76vJhcP).


## 📑 » MIT License
Copyright 2023-2024 © by [Sefinek](https://sefine.net). All rights reserved.