import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: {
        contentField: "content",
      },
      schema: {
        title: fields.text({
          label: "Title",
        }),
        publishedDate: fields.date({
          label: "Published Date",
        }),
        summary: fields.text({
          label: "Summary",
          description: "Brief description for SEO and previews",
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Technical Tutorials", value: "Technical Tutorials" },
            { label: "Industry Insights", value: "Industry Insights" },
            { label: "Case Studies", value: "Case Studies" },
            { label: "Retro Tech", value: "Retro Tech" },
          ],
          defaultValue: "Technical Tutorials",
        }),
        tags: fields.array(
          fields.text({
            label: "Tag",
          }),
          {
            label: "Tags",
            itemLabel: (props) => props.value,
          },
        ),
        featured: fields.checkbox({
          label: "Featured Post",
          description: "Show this post prominently on the blog index",
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
