import { TAGS } from './tags.ts';

declare module 'nekosia.js' {
    type HexColor = `#${string}`;
    type AllTagsList = typeof TAGS[number];

    /**
     * Configuration options for the `fetchImages` function.
     */
    interface FetchImagesOptions {
        /**
         * Session type:
         * - `id` - Session identified by the `id` value (requires the `id` field to be set).
         * - `ip` - Session identified by the user's IP address.
         * @default undefined
         */
        session?: 'id' | 'ip';

        /**
         * Identifier of the fetched image.
         * @example 66ae26a07886f165901e8a3f
         */
        id?: string;

        /**
         * The number of images to fetch. WARNING! The higher the number, the more data the server will need to process, which will result in a longer response time.
         *
         * - Minimum - 1
         * - Maximum - 48
         * @default 1
         */
        count?: number;

        /**
         * Additional tags to include in the image search.
         * This can be a single string with one tag or an array of strings with multiple tags.
         * @example ["cute", "sakura", "cherry-blossom"]
         * @default []
         */
        additionalTags?: AllTagsList | AllTagsList[];

        /**
         * Tags to exclude during the image search.
         * This can be a single string with one tag or an array of strings with multiple tags.
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
         * - `questionable`: Contains content that may be sensitive or inappropriate for younger audiences, but not explicit.
         * - `nsfw`: Contains explicit content, not safe for work (NSFW).
         *
         * The default value is ALWAYS `safe`.
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
         * URL leading to the image.
         * @example https://cdn.nekosia.cat/images/maid-uniform/66bc6b7481a59a1cf2c79db5.png
         */
        url: string;

        /**
         * Image file extension.
         * @example `png` or `jpg`, etc.
         */
        extension: string;
    }

    /**
     * Metadata about the image.
     */
    interface ImageMetadata {
        /**
         * Image width in pixels.
         * @example 1447
         */
        width: number;

        /**
         * Image height in pixels.
         * @example 2046
         */
        height: number;

        /**
         * Image size in bytes.
         * @example 1001991
         */
        size: number;

        /**
         * Image file extension.
         * @example jpeg
         */
        extension: string;
    }

    interface ImageColors {
        /**
         * Main dominant color of the image in hexadecimal format.
         * @example #00FF00
         */
        main: HexColor;

        /**
         * Palette of the 14 most dominant colors in the image, presented in hexadecimal format.
         * @example ["#9D78CD", "#454FC0", "#909AEB", "#F5E3F0", "#94498B", "#BEC1EE", "#CD7D67", "#CC98D5", "#E2AE9E", "#F0B4DB", "#2B1C3E", "#4E8DCB", "#F2DABF", "#5CB6C0"]
         */
        palette: HexColor[];
    }

    interface ImageAnime {
        /**
         * The title of the anime from which the image originates. `null` if not applicable.
         * @example Satsuriku no Tenshi
         */
        title: string | null;

        /**
         * The name of the character depicted in the image. `null` if not applicable.
         * @example Rachel Gardner
         */
        character: string | null;
    }

    interface ImageSource {
        /**
         * URL of the source page where the image originates. `null` if not applicable.
         */
        url: string | null;

        /**
         * Direct link to the image. `null` if not applicable.
         */
        direct: string | null;
    }

    interface ArtistDetails {
        /**
         * Artist's username. `null` if not applicable.
         */
        username: string | null;

        /**
         * Link to the artist's profile. `null` if not applicable.
         */
        profile: string | null;
    }

    interface ImageAttribution {
        /**
         * Information about the artist.
         */
        artist: ArtistDetails;

        /**
         * Copyright of the artwork. `null` if not applicable.
         */
        copyright: string | null;
    }

    /**
     * Response structure for an image fetch request from the API.
     */
    interface ImageResponse {
        /**
         * Indicates whether the operation was successful.
         * @example true
         */
        success: boolean;

        /**
         * HTTP status code of the response.
         * @example 200
         */
        status: number;

        /**
         * Session key, if applicable, otherwise `null`.
         */
        key: string | null;

        /**
         * Number of images included in the response.
         */
        count: number;

        /**
         * Image identifier.
         */
        id: string;

        /**
         * Structure containing the dominant colors of the fetched image.
         */
        colors: ImageColors;

        /**
         * Structure containing details about the original and compressed images.
         */
        image: {
            /**
             * Original uncompressed image. The file includes EXIF data to acknowledge the artist's work.
             */
            original: ImageDetails;

            /**
             * Compressed image with a smaller size, without quality loss. The file includes EXIF data to acknowledge the artist's work.
             */
            compressed: ImageDetails;
        };

        /**
         * Metadata about the original and compressed images.
         */
        metadata: { original: ImageMetadata; compressed: ImageMetadata; };

        /**
         * Category to which the image belongs.
         * @example catgirl
         */
        category: string;

        /**
         * Tags assigned to the image.
         */
        tags: string[];

        /**
         * Content rating of the image.
         *
         * `safe` - Image safe to display in any situation.
         *
         * `questionable` - Image may contain content inappropriate for some viewers.
         *
         * `nsfw` - Image contains content intended for adults only (Not Safe For Work).
         *
         * @output 'safe' | 'questionable' | 'nsfw'
         */
        rating: 'safe' | 'questionable' | 'nsfw';

        /**
         * Information about the anime (not necessarily an anime) to which the image may belong.
         */
        anime: ImageAnime;

        /**
         * Information about the source of the image.
         */
        source: ImageSource;

        /**
         * Structure containing information about the artist and associated copyright of the image.
         */
        attribution: ImageAttribution;
    }

    /**
     * Nekosia API class, containing methods for fetching images.
     * All methods are asynchronous and return a Promise with an `ImageResponse`.
     */
    export class NekosiaAPI {
        /**
         * Fetches images from a selected category by sending a GET request to the API.
         * @param category - The category of images to fetch (e.g., `catgirl`).
         * @param options - Configuration options for the request (optional).
         * @example
         * const { NekosiaAPI } = require('nekosia.js');
         * await NekosiaAPI.fetchImages('catgirl', {
         *      count: 1,
         *      additionalTags: ['cute', 'sakura', 'cherry-blossom'],
         *      blacklistedTags: ['beret']
         * });
         * @returns Promise with an `ImageResponse`.
         */
        fetchImages(category: AllTagsList, options?: FetchImagesOptions): Promise<ImageResponse>;

        /**
         * Fetches images based solely on the tags provided by the user. The main category does not affect the image selection as it is not provided here.
         * @param options - Configuration options for the request (optional).
         * @example
         * const { NekosiaAPI } = require('nekosia.js');
         * await NekosiaAPI.fetchShadowImages({
         *      count: 1,
         *      additionalTags: ['catgirl', 'foxgirl'],
         *      blacklistedTags: ['dog-girl']
         * });
         * @returns Promise with an `ImageResponse`.
         */
        fetchShadowImages(options?: FetchImagesOptions): Promise<ImageResponse>;

        /**
         * Fetches an image by its identifier.
         * @param id - The image identifier (e.g., `66ae26a07886f165901e8a3f`).
         * @returns Promise with an `ImageResponse`.
         */
        fetchById(id: string): Promise<ImageResponse>;
    }

    /**
     * JSON object response from the API regarding the current version of the API and related information.
     */
    interface APIVersion {
        /**
         * HTTP status code of the response.
         * @example 200
         */
        status: number;

        /**
         * Indicates whether the request was successful.
         * @example true
         */
        success: boolean;

        /**
         * The current version of the API.
         * @example 1.0.0
         */
        version: string;

        /**
         * URL to the API documentation.
         * @example https://nekosia.cat/documentation
         */
        documentation: string;

        /**
         * Contact email.
         * @example contact@nekosia.cat
         */
        contact: string;

        /**
         * List of available API numbers.
         * @example [1]
         */
        apis: number[];
    }

    /**
     * Module and API versions.
     */
    export const NekosiaVersion: {
        /**
         * Get the current version of the module.
         * @example 1.1.0
         * @returns String with the module version.
         */
        module: string;

        /**
         * Get the current API version and related information.
         * @returns Promise that resolves to an `APIVersion` object.
         */
        api(): Promise<APIVersion>;
    };
}