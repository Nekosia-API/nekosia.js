import { TAGS } from './tags.ts';

declare module 'nekosia.js' {
    type HexColor = `#${string}`;
    type AllTagsList = typeof TAGS[number];

    /**
     * Configuration options for the `fetchCategoryImages` function.
     */
    interface FetchImagesCategoryOptions {
        /**
         * Session type:
         * - `id` - Session identified by its `id` value (requires the `id` field to be set).
         * - `ip` - Session identified by the user's IP address.
         * @type String
         * @default undefined
         */
        session?: 'id' | 'ip';

        /**
         * Identifier of the fetched image.
         * @type String
         * @example "66ae26a07886f165901e8a3f"
         */
        id?: string;

        /**
         * The number of images to fetch. WARNING! The higher the number, the more data the server will need to process, leading to longer response times.
         *
         * - Minimum - 1
         * - Maximum - 48
         * @type Number
         * @default 1
         */
        count?: number;

        /**
         * Additional tags to include in the image search.
         * This can be a single string representing one tag or an array of strings for multiple tags.
         * @type Array
         * @example ["cute", "sakura", "cherry-blossom"]
         * @default []
         */
        additionalTags?: AllTagsList | AllTagsList[];

        /**
         * Tags to exclude from the image search.
         * This can be a single string representing one tag or an array of strings for multiple tags.
         * @type Array
         * @example ["beret", "hat", "short-hair"]
         * @default []
         */
        blacklistedTags?: AllTagsList | AllTagsList[];

        /**
         * Defines the content rating of an image.
         * The rating indicates the appropriateness of the content, specifying whether the image is suitable for all audiences or contains content that may be sensitive or inappropriate for certain viewers.
         *
         * Possible values:
         * - `safe`: Suitable for all audiences, contains no explicit or questionable content.
         * - `questionable`: May contain content sensitive or inappropriate for younger audiences, but not explicit.
         * - `nsfw`: Contains explicit content, not safe for work (NSFW).
         *
         * The default value is ALWAYS `safe`.
         * @type String
         * @example safe
         * @default safe
         */
        rating?: 'safe' | 'questionable' | 'nsfw';
    }

    /**
     * Configuration options for the `fetchImages` function.
     */
    interface FetchImagesOptions {
        /**
         * Session type:
         * - `id` - Session identified by its `id` value (requires the `id` field to be set).
         * - `ip` - Session identified by the user's IP address.
         * @type String
         * @default undefined
         */
        session?: 'id' | 'ip';

        /**
         * Identifier of the fetched image.
         * @type String
         * @example "66ae26a07886f165901e8a3f"
         */
        id?: string;

        /**
         * The number of images to fetch. WARNING! The higher the number, the more data the server will need to process, leading to longer response times.
         *
         * - Minimum - 1
         * - Maximum - 48
         * @type Number
         * @default 1
         */
        count?: number;

        /**
         * Additional tags to include in the image search.
         * This can be a single string representing one tag or an array of strings for multiple tags.
         * @type Array
         * @example ["cute", "sakura", "cherry-blossom"]
         * @default []
         */
        tags?: AllTagsList | AllTagsList[];

        /**
         * Tags to exclude from the image search.
         * This can be a single string representing one tag or an array of strings for multiple tags.
         * @type Array
         * @example ["beret", "hat", "short-hair"]
         * @default []
         */
        blacklist?: AllTagsList | AllTagsList[];

        /**
         * Defines the content rating of an image.
         * The rating indicates the appropriateness of the content, specifying whether the image is suitable for all audiences or contains content that may be sensitive or inappropriate for certain viewers.
         *
         * Possible values:
         * - `safe`: Suitable for all audiences, contains no explicit or questionable content.
         * - `questionable`: May contain content sensitive or inappropriate for younger audiences, but not explicit.
         * - `nsfw`: Contains explicit content, not safe for work (NSFW).
         *
         * The default value is ALWAYS `safe`.
         * @type String
         * @example safe
         * @default safe
         */
        rating?: 'safe' | 'questionable' | 'nsfw';
    }

    /**
     * Details about a specific image.
     */
    interface ImageDetails {
        /**
         * URL of the image.
         * @type String
         * @example https://cdn.nekosia.cat/images/maid-uniform/66bc6b7481a59a1cf2c79db5.png
         */
        url: string;

        /**
         * Image file extension.
         * @type String
         * @example `png`, `jpg`, etc.
         */
        extension: string;
    }

    /**
     * Metadata about the image.
     */
    interface ImageMetadata {
        /**
         * Image width in pixels.
         * @type Number
         * @example 1447
         */
        width: number;

        /**
         * Image height in pixels.
         * @type Number
         * @example 2046
         */
        height: number;

        /**
         * Image size in bytes.
         * @type Number
         * @example 1001991
         */
        size: number;

        /**
         * Image file extension.
         * @type String
         * @example png
         */
        extension: string;
    }

    interface ImageColors {
        /**
         * The main dominant color of the image in hexadecimal format.
         * @type String
         * @example #00FF00
         */
        main: HexColor;

        /**
         * A palette of the 14 most dominant colors in the image, represented in hexadecimal format.
         * @type Array
         * @example ["#9D78CD", "#454FC0", "#909AEB", "#F5E3F0", "#94498B", "#BEC1EE", "#CD7D67", "#CC98D5", "#E2AE9E", "#F0B4DB", "#2B1C3E", "#4E8DCB", "#F2DABF", "#5CB6C0"]
         */
        palette: HexColor[];
    }

    interface ImageAnime {
        /**
         * The title of the anime from which the image originates. `null` if not applicable.
         * @type String
         * @example "Satsuriku no Tenshi"
         */
        title: string | null;

        /**
         * The name of the character depicted in the image. `null` if not applicable.
         * @type String
         * @example "Rachel Gardner"
         */
        character: string | null;
    }

    interface ImageSource {
        /**
         * The URL of the source page where the image originates. `null` if not applicable.
         * @type String
         */
        url: string | null;

        /**
         * The direct link to the image. `null` if not applicable.
         * @type String
         */
        direct: string | null;
    }

    interface ArtistDetails {
        /**
         * The artist's username. `null` if not applicable.
         * @type String
         */
        username: string | null;

        /**
         * The link to the artist's profile. `null` if not applicable.
         * @type String
         */
        profile: string | null;
    }

    interface ImageAttribution {
        /**
         * Information about the artist.
         * @type Object
         */
        artist: ArtistDetails;

        /**
         * The copyright of the artwork. `null` if not applicable.
         * @type String
         */
        copyright: string | null;
    }

    /**
     * Response structure for an image fetch request from the API.
     */
    interface ImageResponse {
        /**
         * Indicates whether the operation was successful.
         * @type Boolean
         * @example true
         */
        success: boolean;

        /**
         * HTTP status code of the response.
         * @type Number
         * @example 200
         */
        status: number;

        /**
         * Session key, if applicable, otherwise `null`.
         * @type String
         */
        key: string | null;

        /**
         * Number of images included in the response.
         * @type Number
         */
        count: number;

        /**
         * Unique identifier for the image.
         * @type String
         */
        id: string;

        /**
         * Object containing the dominant colors of the fetched image.
         * @type Object
         */
        colors: ImageColors;

        /**
         * Object containing details about both the original and compressed images.
         */
        image: {
            /**
             * The original uncompressed image. Includes EXIF data to credit the artist.
             * @type Object
             */
            original: ImageDetails;

            /**
             * The compressed version of the image, reduced in size without quality loss. Includes EXIF data to credit the artist.
             * @type Object
             */
            compressed: ImageDetails;
        };

        /**
         * Metadata for both the original and compressed images.
         * @type Object
         */
        metadata: { original: ImageMetadata; compressed: ImageMetadata };

        /**
         * The category the image belongs to.
         * @type String
         * @example "catgirl"
         */
        category: string;

        /**
         * Tags associated with the image.
         * @type Array
         */
        tags: string[];

        /**
         * Content rating of the image.
         *
         * `safe` - Image safe for all audiences.
         *
         * `questionable` - Image may contain content unsuitable for some viewers.
         *
         * `nsfw` - Image contains adult content (Not Safe For Work).
         *
         * @type String
         * @output 'safe' | 'questionable' | 'nsfw'
         */
        rating: 'safe' | 'questionable' | 'nsfw';

        /**
         * Information about the anime (or related media) the image may be associated with.
         * @type Object
         */
        anime: ImageAnime;

        /**
         * Details about the source of the image.
         * @type Object
         */
        source: ImageSource;

        /**
         * Information about the artist and the associated copyright of the image.
         * @type Object
         */
        attribution: ImageAttribution;
    }

    /**
     * Nekosia API class, containing methods for fetching images.
     * All methods are asynchronous and return a Promise resolving to an `ImageResponse`.
     */
    export class NekosiaAPI {
        /**
         * Fetches images from a selected category by sending a GET request to the API.
         * @param category - The category of images to fetch (e.g., `catgirl`).
         * @param options - Configuration options for the request (optional).
         * @example
         * const { NekosiaAPI } = require('nekosia.js');
         * await NekosiaAPI.fetchCategoryImages('catgirl', {
         *      count: 1,
         *      additionalTags: ['cute', 'sakura', 'cherry-blossom'],
         *      blacklistedTags: ['beret']
         * });
         * @type Object
         * @returns A Promise resolving to an `ImageResponse`.
         */
        static fetchCategoryImages(category: AllTagsList, options?: FetchImagesCategoryOptions): Promise<ImageResponse>;

        /**
         * Fetches images based solely on the tags provided by the user. The main category does not affect the image selection as it is not provided here.
         * @param options - Configuration options for the request (optional).
         * @example
         * const { NekosiaAPI } = require('nekosia.js');
         * await NekosiaAPI.fetchImages({
         *      count: 1,
         *      tags: ['catgirl', 'foxgirl'],
         *      blacklist: ['dog-girl']
         * });
         * @type Object
         * @returns A Promise resolving to an `ImageResponse`.
         */
        static fetchImages(options?: FetchImagesOptions): Promise<ImageResponse>;

        /**
         * Fetches an image by its identifier.
         * @param id - The image identifier (e.g., `66ae26a07886f165901e8a3f`).
         * @type Object
         * @returns A Promise resolving to an `ImageResponse`.
         */
        static fetchById(id: string): Promise<ImageResponse>;
    }

    /**
     * JSON object response from the API containing information about the current version and related details.
     */
    interface APIVersion {
        /**
         * HTTP status code of the response.
         * @type Number
         * @example 200
         */
        status: number;

        /**
         * Indicates whether the request was successful.
         * @type Boolean
         * @example true
         */
        success: boolean;

        /**
         * The current version of the API.
         * @type String
         * @example "1.0.0"
         */
        version: string;

        /**
         * URL to the API documentation.
         * @type String
         * @example "https://nekosia.cat/documentation"
         */
        documentation: string;

        /**
         * Contact email for inquiries.
         * @type String
         * @example "contact@nekosia.cat"
         */
        contact: string;

        /**
         * List of available API versions.
         * @type Array
         * @example [1]
         */
        apis: number[];
    }

    /**
     * Module and API versions.
     */
    export const NekosiaVersion: {
        /**
         * Retrieves the current version of the module.
         * @example "1.1.0"
         * @type String
         * @returns A string representing the module version.
         */
        module: string;

        /**
         * Fetches the current API version and related information.
         * @type Object
         * @returns A Promise that resolves to an `APIVersion` object.
         */
        api(): Promise<APIVersion>;
    };
}