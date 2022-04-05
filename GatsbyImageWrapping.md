# Gatsby Image Wrapping

Gatsby image wrapping has the following structure:
- `div`: wrapper
    - `div`: placeholder
        - `img`: placeholder (SVG) `data:image/svg+xml`
    - `div`: background
    - `picture`
        - `source`: avif
        - `source`: webp
        - `img`: jpeg / png
    - `noscript`: fallback
    - `script`: handler
  
Total: `10` DOM elements, like this:

```html
<div class="gatsby-image-wrapper">
    <div style="width: 1000px; display: block;">
        <img alt="" role="presentation" src="data:image/svg+xml;... "/> <!-- Placeholder SVG -->
        <!-- Note - this placeholder has an empty alt text but it's also  -->
        <!-- an ARIA hidden item role="presentation" -->
    </div>
    <div style="background-color: ...;" /> <!-- Background & Transition -->
    <picture>
        <source type="image/avif" ... />
        <source type="image/webp" ... />
        <img src="...jpg|png" ... />
    </picture>
    <noscript></noscript> <!-- fallback noscript -->
    <script></script> <!-- JS handler -->
</div>
```

One responsive image, with ALL formats (`webp`, `avif` and `jpg`/`png`) costs `10` DOM Elements
