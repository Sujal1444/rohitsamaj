# Required changes

Turn the homepage sample into the Rohit Samaj directory. Pick one visual direction and build real pages from the shared directory data.

## Functionality

- Load images from the saved site assets. UK categories must use the UK photos, and Town House must use its own photo.
- Make search filter as the user types, keep the active category, and give Explore and View all the same reset behavior.
- Show an empty category as “no businesses yet,” and stop badging every card as Popular.
- Use real phone numbers, cities, and one official contact address, phone, and email.
- Add routes for India, UK, category, listing, about, contact, and add-listing. Category and listing links must be normal URLs, not dialogs or links back to the old site.
- Add account, saved listings, and business submission after the directory pages work.
- Match the live directory: directory types, sort by name and date, and listing counts on categories.

## SEO

- Replace the design-preview title and description with directory copy. Give every route its own title, description, and canonical URL.
- Add Open Graph and Twitter image, URL, title, and description.
- Serve India and UK as separate URLs with `hreflang` for `en-IN` and `en-GB`.
- Add JSON-LD for the organization, category lists, and each business.
- Publish a sitemap of indexable pages only. Put the name, address, and phone in the footer HTML.
- Use one clear `h1` per page and alt text that names the business or category.

## Styles

- Move `src/styles.css` component rules onto Tailwind classes while splitting the homepage into header, hero, listings, categories, and footer.
- Keep `styles.css` for Tailwind setup, theme tokens, and the few rules utilities cannot express.
- Remove the 12px base font size and restore a visible keyboard focus ring.
