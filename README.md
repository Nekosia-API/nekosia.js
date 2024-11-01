<div align="center">
    <h1>🖼️ Nekosia.js API — Random Anime Images</h1>
</div>

Nekosia.js is a Node.js module that provides easy access to the Nekosia API, a rich source of anime-themed images.
The API offers a wide range of categories, allowing you to quickly and flexibly search for images based on your preferences and needs.
You have full control over the images you retrieve, which sets our API apart from others.

But that's not all! The API also supports sessions (based on user ID or IP address), helping to prevent repeated images.

<div align="center">
    <a href="https://www.npmjs.com/package/nekosia.js">
        <img src="https://img.shields.io/npm/dm/nekosia.js" alt="npm downloads">
    </a>
    <a href="https://github.com/Nekosia-API/nekosia.js/issues">
        <img src="https://img.shields.io/github/issues/Nekosia-API/nekosia.js" alt="Issues">
    </a>
    <a href="https://github.com/Nekosia-API/nekosia.js/commits/main">
        <img src="https://img.shields.io/github/last-commit/Nekosia-API/nekosia.js" alt="Last commit">
        <img src="https://img.shields.io/github/commit-activity/w/Nekosia-API/nekosia.js" alt="Commit activity">
        <img src="https://img.shields.io/github/languages/code-size/Nekosia-API/nekosia.js" alt="Code size">
    </a>
</div>


## 🔍 Key Features of the API
- **Wide range of categories:** Nekosia API offers [virtually every kind of anime graphic](https://nekosia.cat/documentation?page=api-endpoints#main-categories), not just neko images.
- **High image quality:** All images are carefully selected and checked for both quality and appropriateness.
- **Sessions:** The API supports sessions (based on ID or IP address), helping to avoid duplicate images.
- **Dominant colors:** The API returns a palette of dominant colors for each image.
- **Image compression:** JSON responses include a link to a compressed image with a significantly reduced file size compared to the original. This ensures faster load times on client devices without sacrificing quality.
- **Security:** Nekosia API guarantees that all content is free from NSFW material, making it one of the most trusted sources for anime-themed images.

...and that’s not all!


## 📘 Best Anime Booru
Nekosia also offers its own [Booru](https://nekosia.cat/booru), allowing you to browse images returned by the API.  
Users can edit image information, such as tags, which are crucial for us.


## 📄 Documentation
Check out the [official documentation](https://nekosia.cat/documentation) to learn more.


## 📦 Installation
To install the Nekosia.js module, use the following command:

```bash
npm install neksosia.js
```


## 🔤 Tag list
You can find the main image categories [here](https://nekosia.cat/documentation?page=api-endpoints#tags-and-categories).
The full list of tags is available [on the Booru site](https://nekosia.cat/booru/tags).


## 🤔 How to Use?

### Simple Example
```js
const { NekosiaAPI } = require('nekosia.js');

(async () => {
	const response = await NekosiaAPI.fetchImages('catgirl');
	console.log(response); // Sample response: https://nekosia.cat/documentation?page=api-endpoints#example-response
})();
```


### IP-based Sessions
In this example, we used an IP-based session. What does this mean? Thanks to this solution, a user with a specific IP address will not encounter duplicate images when selecting them randomly.

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
You can also use `id`, but this requires providing a user identifier (e.g., from Discord). Pass this information in `id` as a string.

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

### See more
https://github.com/Nekosia-API/nekosia.js/tree/main/examples


## Versions
```js
const { NekosiaVersion } = require('nekosia.js');

(async () => {
	console.log(NekosiaVersion.module); // Returns the installed module version
	console.log(await NekosiaVersion.api()); // Returns the current API version used by the module
})();
``` 


## ⭐ » Thanks
If you find the API or this module useful, consider giving a star to the [repository](https://github.com/Nekosia-API/nekosia.js).  
If you have any questions or issues, create a new [Issue](https://github.com/Nekosia-API/nekosia.js/issues/new) or join the [Discord server](https://discord.gg/pba76vJhcP).


## 📑 » MIT License
Copyright 2024 © by [Sefinek](https://sefine.net). All rights reserved.