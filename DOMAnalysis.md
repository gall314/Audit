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

## Jacek additional input:

> Ok, so I would like to ask you a couple of things. As you know the website can have a large DOM size due to a variety of reasons. The most common ones are:
>
> - Poorly coded plugins or themes
> - DOM nodes produced by JavaScript
> - Page builders that generate bloated HTML code
> - Copy-pasted text in a WYSIWYG editor
> 
> Is it possible that Gatsby had some limitations and that is the main reason that we have a large DOM size? So I would ask you are you familiar with the Gatsby site that is about how to improve your website performance? Maybe you are but I want to be sure. I share you link below:
> 
> - [Gatsby: Improving Site Performance](https://www.gatsbyjs.com/docs/how-to/performance/improving-site-performance/)
> - [FreeCodeCamp: Gatsby Perfect Lighthouse Score](https://www.freecodecamp.org/news/gatsby-perfect-lighthouse-score/)
> 
> I think what we should do is to:
> - Improve page rendering with content visibility.\
> _The CSS content-visibility property tells a browser to skip styling, layout, and paint until you need it which could lessen the impact of the excessive node size._
> - Split large pages into multiple pages.\
> Splitting large pages into multiple pages might reduce the number of DOM nodes when the content itself created many DOM nodes.
> - Implement infinite scroll.
> 
> What do you think ?
