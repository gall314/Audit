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

## Additional explanations

Let's take a real-life example. On [our website](https://app.sellusyourjewelry.com/) we have a hero image

![Hero Image](https://app.sellusyourjewelry.com/static/d368c6896ef82be25ee929eb4229d6c7/7495b/sell-us-your-jewelry-banner.avif)

The straightforward HTML implementation would look like this:

```html
<img src="/static/d368c6896ef82be25ee929eb4229d6c7/7495b/sell-us-your-jewelry-banner.avif" 
     alt="Watches and Jewelry Image" width="1000" height="1000" class="w-full justify-center"
     loading="eager" />
```

It's perfectly fine but it's:
- **NOT** responsive: image is the same for all screen sizes
- **NOT** cross-browser compatible:
  - [Can I Use AVIF Format](https://caniuse.com/?search=avif) shows that it's supported
  by `69.25%` globally used web browsers (Friday Apr 8th, 2022)\
  - [Can I Use lazy `loading` attribute](https://caniuse.com/?search=loading) shows that it's supported by `75.22%` (Friday Apr 8th, 2022)

Our goal is to:
- Be responsive
- Target `>0.25% and not dead` browsers [Browserlist](https://browserslist.dev/?q=PjAuMjUlIGFuZCBub3QgZGVhZA%3D%3D)

### Q: What can we do?

1) [Web.dev: Serve images WebP](https://web.dev/serve-images-webp/)

> If your site only supports WebP compatible browsers, you can stop reading. Otherwise, serve WebP to newer browsers and a fallback image to older browsers:
 
**NOTE:** We want to support older browsers. Explanations below.

#### Before
```html
<img src="flower.jpg" alt="">
```

#### After
```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

2) [Web.dev: Serve responsive images](https://web.dev/serve-responsive-images/)

#### Before
```html
<img src="flower.jpg" alt="">
```

#### After
```html
<picture>
  <source type="image/webp" srcset="flower-small.webp 480w, flower-large 1080w" sizes="50vw">
  <source type="image/jpeg" srcset="flower-small.jpg 480w, flower-large.jpg 1080w" sizes="50vw">
  <img src="flower-large.jpg" srcset="flower-small.jpg 480w, flower-large.jpg 1080w" sizes="50vw">
</picture>
```

> How many image versions should you create?
> There is no single "correct" answer to this question. However, it's common to serve 3-5 different sizes of an image. **Serving more image sizes is better for performance,** but will take up more space on your servers and require writing a tiny bit more HTML.

NOTE: **Serving more image sizes is better for performance,** but (...) *require writing a tiny bit more HTML.*

3) [Web.dev: Lazy Loading - Best Practices](https://web.dev/lazy-loading-best-practices/)
 
NOTE: **Lazy-loading media can cause shifting in the layout if placeholders aren't used.**

NOTE: **JavaScript availability:** It shouldn't be assumed that JavaScript is always available. If you're going to lazy-load images, consider offering `<noscript>` markup that will show images in case JavaScript is unavailable.

NOTE: **JavaScript availability:** It shouldn't be assumed that JavaScript is always available. If you're going to lazy-load images, consider offering `<noscript>` markup that will show images in case JavaScript is unavailable. 

That is how we end-up with the HTML like this:

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

### Q: Can I just switch to WebP?
A: **NO**. WebP is supported by `91.38%` users (Globally) - check [Can I Use - WebP Format](https://caniuse.com/?search=webp)

### Q: Is this 91.38% a real value? We target US market, a developed country
A: **Yes**, in our case it's even worse. Above `10%` of our visitors use web browsers that don't support WebP format

WebP: Partial support in **Safari** refers to being limited to macOS 11 Big Sur and later.

Our Google Analytics data for SellUsYourJewelry (`2021-01-01` to `2022-04-07`) show that:

| OS            |       Users |           % |
|---------------|------------:|------------:|
| **TOTAL**     | **405,664** | **100.00%** |
|               |             |             |
| Windows       |     160,349 |      39.15% |
| Android       |     125,467 |      30.63% |
| iOS           |      89,838 |      30.63% |
| **Macintosh** |  **23,158** |   **5.65%** |
| Linux         |       7,283 |       1.78% |
| Chrome OS     |       1,626 |       0.40% |
| (not set)     |       1,413 |       0.34% |
| Windows Phone |         331 |       0.08% |
| BlackBerry    |          65 |       0.02% |
| Xbox          |          27 |       0.01% |

**Safari Users with systems prior to BigSur**

| OS          | Browser |  Users |     % |
|-------------|---------|-------:|------:|
| Intel 10.15 | Safari  |   8842 | 2.18% |
| Intel 10.14 | Safari  |    827 | 0.20% |
| Intel 10.13 | Safari  |    802 | 0.20% |
| Intel 10.12 | Safari  |    566 | 0.14% |
| Intel 10.11 | Safari  |    368 | 0.09% |
| Intel 10.10 | Safari  |    210 | 0.05% |
| Intel 10.9  | Safari  |     38 | 0.01% |
| **TOTAL**   |         | 11,653 | 2.87% |

**Internet Explorer Users**

| Browser           |  Users |     % |
|-------------------|-------:|------:|
| Internet Explorer | 12,238 | 2.97% |

**Safari & Chrome for iOS 3.2 - 13.7**:

|       |  Users |     % |
|-------|-------:|------:|
| Total | 16,933 | 4.17% |

**At least 10% of our visitors use browsers that don't support modern image formats like `WebP` or `AVIF`**

### Q: Why would we use Avif?

A: **It has better quality with less size!** And it's supported by almost `70%` web browsers. check [Can I Use - AVIF Format](https://caniuse.com/?search=avif)

Check our real life example:

AVIF - Hero Image:\
Transferred: 53.14 KB (53.14 KB size)\
https://app.sellusyourjewelry.com/static/d368c6896ef82be25ee929eb4229d6c7/9ef3c/sell-us-your-jewelry-banner.avif

WebP - Hero Image:\
Transferred: 91.17 KB (90.49 KB size)\
https://app.sellusyourjewelry.com/static/d368c6896ef82be25ee929eb4229d6c7/3cd29/sell-us-your-jewelry-banner.webp

PNG - Hero Image:\
Transferred: 251.07 KB (250.39 KB size)\
https://app.sellusyourjewelry.com/static/d368c6896ef82be25ee929eb4229d6c7/13677/sell-us-your-jewelry-banner.png

Avif file size is `42%` smaller that WebP. Yet, the quality of the file is similar or even slightly better.

### Q: Why then do you server both Avif and WebP and still the fallback PNG or JPEG2000?

- For 70% of our visitors: we serve the best format (small, good quality image)
- For the next 20%: we serve the most popular format (small, fair quality image)
- For the remaining 10%: we serve what they can handle (JPEG2000 or PNG, good quality, but yet - quite heavy) 

### Q: But serving 3 formats and X different sizes increase both the DOM size and the HTML weight

A: Yes, it's true but let's look at the numbers. Still being in our real-life example, the HTML weight for the 
hero banner snippet looks like this:

HTML uncompressed:\
3 formats: 3.4KB\
2 formats: 2.6KB\
1 format: 1.7KB

All the modern browsers support `brotli` compression. [Can I Use brotli compression](https://caniuse.com/?search=brotli) shows that it's `93%`   

br compressed HTML snippet:\
3 formats: 634B\
2 formats: 568B\
1 format: 488B

The total cost is `146` additional `bytes`. This is all for serving 3 formats in 8 different sizes (375, 414, 640, 720, 750, 768, 828, 1000)

Check another example:

https://app.sellusyourjewelry.com/static/861be12f879e75d89c13e6c5556456ff/00dc1/gray-and-sons-request-catalog-banner.avif

https://app.sellusyourjewelry.com/static/861be12f879e75d89c13e6c5556456ff/10e7d/gray-and-sons-request-catalog-banner.webp

![AVIF - smaller and better](./images/avif-vs-webp.png)
AVIF is ~2KB smaller and has a better quality (less visible artifacts, i.e. around the text)

