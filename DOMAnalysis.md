# DOM Analysis

## Number of DOM elements

```javascript
let dict, icons, link;
link = {};
dict = {};
icons = {};
for(let x of document.getElementsByTagName('*')) {
   if(!dict.hasOwnProperty(x.tagName)) dict[x.tagName] = 0; 
   dict[x.tagName] += 1;
}
for(let x of document.getElementsByTagName('link')) { 
    let rel = x.getAttribute('rel'); 
    if(!link.hasOwnProperty(rel)) link[rel] = 0; 
    link[rel] += 1;
}
for(let x of document.getElementsByTagName('use')) {
    let rel = x.getAttribute('xlink:href') || x.getAttribute('href');
    if(!icons.hasOwnProperty(rel)) icons[rel] = 0;
    icons[rel] += 1;
}
console.log(`DOM Elements ${document.getElementsByTagName('*').length}`)
console.log(dict)
console.log(link)
console.log(icons)
```

## Related documents

- [Gatsby Image Wrapping](./GatsbyImageWrapping.md)\
  **TL;DR:** One image = 10 DOM Elements 
- [SVG Icons](./SVGIcons.md)\
  **TL;DR:** One icon = 4 DOM elements (can be optimized to 2 DOM elements for rarely used icons)

## Homepage result
### Landscape elements (53 DOM Elements)
- HTML: 1
- BODY: 1
- HEADER: 1
- FOOTER: 1
- MAIN: 1
- NAV: 2
- SECTION: 16
- P: 18
- UL: 2
- LI: 10

### Headings and emphasis (92 Elements)
- H1: 1
- H2: 18
- H3: 26
- B: 2
- I: 45

### Links and buttons (107 Elements)
- A: 103
- BUTTON: 4

### YouTube, Google Maps, Collect Chat
- IFRAME: 3

### Metadata and Head section (122 DOM Elements)
- HEAD: 1
- TITLE: 1
- META: 20
- SCRIPT: 24
- LINK: 72
- * "apple-touch-icon": 8
- * "dns-prefetch": 1
- * icon: 1
- * manifest: 1
- * preconnect: 3
- * prefetch: 48
- * preload: 7
- * sitemap: 1
- * stylesheet: 2
- STYLE: 4

### Images (280 DOM Elements)
- PICTURE: 56
- IMG: 118
- SOURCE: 106

### Icons (230 DOM Elements)
- svg: 75
- defs: 1
- path: 40
- symbol: 31
- use: 73

### Style, layout, wrappers (436 DOM Elements)
- DIV: 383
- BR: 51
- SPAN: 2

### Summary

* 887: **Landscape, Meta, Headings, Links, YouTube/Chat/, Images and Icons**
* 186: **Gatsby Image Wrappers**
* 250: **remaining items** (style: columns, wrappers, layout elements)

# Possible optimizations:
* Reduce number of icons
* Change SVG icons usage - icons that are used only once, change structure 
  `(svg > defs >) symbol > path` + `svg > use` to `svg > path` (saves 2 DOM elements per image) 
* Remove BR and repetitive P tags with single tag with style `white-space: pre-line;`

## Optimizations
- Homepage: init: 1422, after: 1438 (+16 -> lazy loaded)
- After optimizations: 1215  
