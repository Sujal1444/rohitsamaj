<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture
- Keep the three homepage design samples in a shared preview component with theme-scoped CSS, so directory interactions remain consistent across visual directions.
- Keep source-attributed directory records and regional filtering in the browser-safe shared content module, so every design uses the same source data; account and submission services remain on the existing website.
