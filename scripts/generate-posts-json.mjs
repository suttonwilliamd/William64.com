import fs from "fs/promises";
import path from "path";
import matter from "gray-matter"; // Reads frontmatter

// Define paths relative to the project root
const POSTS_DIR = path.join(process.cwd(), "src/pages/posts");
const JSON_OUTPUT_PATH = path.join(process.cwd(), "posts.json");
const SITE_POSTS_BASE_URL = "/posts/"; // Base URL path for generating post links

async function generatePostsJson() {
  console.log(`Generating posts.json from content in ${POSTS_DIR}...`);
  try {
    const files = await fs.readdir(POSTS_DIR);
    // Filter for only .mdx files
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
    console.log(`Found ${mdxFiles.length} MDX files.`);

    let postsData = [];

    for (const file of mdxFiles) {
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = await fs.readFile(filePath, "utf-8");

      try {
        // Extract frontmatter data
        const { data } = matter(fileContent);

        // Basic validation: Ensure required frontmatter exists
        if (!data.title || !data.date || !data.summary) {
          console.warn(
            `🟡 WARN: Skipping ${file} - Missing required frontmatter (title, date, or summary).`,
          );
          continue; // Skip this file
        }

        // Create the URL slug from the filename
        const slug = file.replace(/\.mdx$/, "");
        const url = `/blog/posts/${slug}`;

        // Add post details to our array
        postsData.push({
          title: data.title,
          summary: data.summary,
          // Ensure date is treated as a string in the correct format
          date: data.date.toISOString
            ? data.date.toISOString().split("T")[0]
            : String(data.date),
          url: url,
        });
      } catch (parseError) {
        console.error(
          `🔴 ERROR: Failed to parse frontmatter for ${file}.`,
          parseError,
        );
        // Decide if you want to stop the build or just skip the file
        // continue; // Option: Skip file on error
        throw new Error(`Frontmatter parsing failed for ${file}`); // Option: Stop build on error
      }
    }

    // Sort posts by date, descending (newest first)
    // Important: Ensure dates are compared correctly
    postsData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Write the updated data to posts.json (pretty-printed)
    await fs.writeFile(JSON_OUTPUT_PATH, JSON.stringify(postsData, null, 2));
    console.log(
      `✅ Successfully generated posts.json with ${postsData.length} posts.`,
    );
  } catch (error) {
    console.error("🔴 ERROR generating posts.json:", error);
    process.exit(1); // Exit the build process with an error code
  }
}

// Run the generation function
generatePostsJson();
