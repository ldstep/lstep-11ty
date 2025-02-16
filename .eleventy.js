const { DateTime } = require("luxon");

/**
 * This is the JavaScript code that determines the config for your Eleventy site
 *
 * You can add lots of customization here to define how the site builds your content
 * Try extending it to suit your needs!
 */
module.exports = function (eleventyConfig) {
   // Add SEO plugin support if you're using it
   try {
      const pluginSEO = require("eleventy-plugin-seo");
      eleventyConfig.addPlugin(pluginSEO);
   } catch (e) {
      console.log("SEO plugin not found, skipping...");
   }

   eleventyConfig.addFilter("dateToRfc822", (dateObj) => {
      // Convert the front matter date to Eastern time
      const easternDate = DateTime.fromISO(dateObj, {
         zone: "America/New_York",
         setZone: true,
      });

      // Set to noon on that date
      const noonDate = easternDate.set({
         hour: 12,
         minute: 0,
         second: 0,
         millisecond: 0,
      });

      // Format for RSS
      return noonDate.toRFC2822();
   });

   eleventyConfig.setTemplateFormats([
      // Templates:
      "html",
      "njk",
      "md",
      // Static Assets:
      "css",
      "jpeg",
      "jpg",
      "png",
      "svg",
      "woff",
      "woff2",
   ]);

   // Add passthrough copy for CSS directory
   eleventyConfig.addPassthroughCopy("./src/css/");

   // Handle the style.css file in public directory
   eleventyConfig.addPassthroughCopy({ "src/public/style.css": "style.css" });

   // Add watch target for CSS
   eleventyConfig.addWatchTarget("./src/css/");
   eleventyConfig.addWatchTarget("./src/public/style.css");

   // Filters let you modify the content https://www.11ty.dev/docs/filters/
   eleventyConfig.addFilter("htmlDateString", (dateObj) => {
      return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
         "yyyy-LL-dd"
      );
   });

   eleventyConfig.setBrowserSyncConfig({ ghostMode: false });

   /* Build the collection of posts to list in the site
    * - Read the Next Steps post to learn how to extend this
    */
   eleventyConfig.addCollection("posts", function (collection) {
      /* The posts collection includes all posts that list 'posts' in the front matter 'tags'
       * - https://www.11ty.dev/docs/collections/
       */
      // Get filtered collection and reverse chronological order
      const coll = collection.getFilteredByTag("posts").reverse();

      // From: https://github.com/11ty/eleventy/issues/529#issuecomment-568257426
      // Adds {{ prevPost.url }} {{ prevPost.data.title }}, etc, to our njks templates
      for (let i = 0; i < coll.length; i++) {
         const prevPost = coll[i - 1];
         const nextPost = coll[i + 1];
         coll[i].data["prevPost"] = prevPost;
         coll[i].data["nextPost"] = nextPost;
      }

      return coll;
   });

   return {
      dir: {
         input: "src",
         output: "public",
      },
   };
};
