const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss"); // Add this line

module.exports = function (eleventyConfig) {
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

   // Add the RSS plugin configuration here
   eleventyConfig.addPlugin(feedPlugin, {
      type: "atom", // or "rss", "json"
      outputPath: "/feed.xml",
      collection: {
         name: "posts", // This matches your existing posts collection
         limit: 0, // 0 means no limit
      },
      metadata: {
         language: "en",
         title: "lstep.xyz", // Change this to your site's title
         subtitle: "A site by lstep.", // Change this
         base: "https://lstep.xyz", // Change to your actual domain
         author: {
            name: "lstep", // Change to your name
            email: "", // Optional - add your email if you want
         },
      },
   });

   return {
      dir: {
         input: "src",
         output: "public",
      },
   };
};
