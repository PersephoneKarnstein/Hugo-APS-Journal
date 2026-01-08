+++
date = '2026-01-07T16:05:05-08:00'
draft = true
title = 'APS-Style Features Guide'
author = 'Persephone'
type = 'post'
+++

This post demonstrates all the APS journal-style features available on this site.[^features] The layout automatically uses justified text and switches to a two-column format on wider screens. Below you'll find examples of each feature along with the markdown syntax used to create them.

## Footnotes

Footnotes use standard markdown syntax. Add a reference in your text with `[^label]` and define the footnote content anywhere in your document with `[^label]: Your footnote text here`.[^basic-footnote]

For longer footnotes that span multiple paragraphs, indent continuation paragraphs with four spaces.[^long-footnote]

```markdown
Here is text with a footnote.[^example]

[^example]: First paragraph of the footnote.

    Second paragraph must be indented with four spaces.
```

## Math Equations

Mathematical notation is rendered using KaTeX. Use `\(` and `\)` delimiters for inline math, and `\[` and `\]` for display equations. Dollar signs like $50 or $100 are left alone and won't trigger math mode.

For inline math, write `\(E = mc^2\)` to produce \(E = mc^2\). Variables like \(\Psi\), \(\hbar\), and \(\hat{H}\) can be included seamlessly within your text.

For display equations, use the block delimiters:

```latex
\[
i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi
\]
```

This produces a centered equation:
\[
i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi
\]

More complex expressions work as expected. Here's the energy quantization formula for a particle in a box:
\[
E_n = \frac{n^2 \pi^2 \hbar^2}{2mL^2}
\]
where \(n = 1, 2, 3, \ldots\) is the quantum number, and the uncertainty principle:
\[
\Delta x \, \Delta p \geq \frac{\hbar}{2}
\]

## Static Figures

Use the `fig` shortcode to include images. By default, figures stay within their column. Add `wide="true"` to span both columns.

**Single-column figure** (default):
```markdown
{{</* fig src="/images/wavefunction.svg" caption="Your caption here" */>}}
```

{{< fig src="/images/wavefunction.svg" caption="Figure 1: A single-column figure stays within its column bounds. This example shows a probability density function." >}}

**Wide figure** (spans both columns):
```markdown
{{</* fig src="/images/example.svg" caption="Caption" wide="true" */>}}
```

## Interactive Plots

For Plotly interactive visualizations, use the `plot` shortcode. Create your plot script in `/static/js/` and reference it by path.

**Single-column plot** (default):
```markdown
{{</* plot id="my-plot" src="/js/my-plot.js" caption="Caption" */>}}
```

**Wide plot** (spans both columns):
```markdown
{{</* plot id="my-plot" src="/js/my-plot.js" caption="Caption" wide="true" */>}}
```

The plot below demonstrates a wide interactive figure. Hover over the energy levels to see their values:

{{< plot id="hydrogen-energy-plot" src="/js/hydrogen-energy-plot.js" wide="true" caption="Figure 2: An interactive Plotly chart spanning both columns. Hover over each line to see the energy value." >}}

The JavaScript file (`/static/js/hydrogen-energy-plot.js`) should use `document.addEventListener('DOMContentLoaded', ...)` to ensure the DOM is ready before rendering.

## Code Blocks

Fenced code blocks support syntax highlighting with optional width control and captions. Add attributes in curly braces after the language:

**Single-column code** (default):
````markdown
```python
def hello():
    print("Hello, world!")
```
````

```python
def hello():
    print("Hello, world!")
```

**Wide code** (spans both columns):
````markdown
```javascript {wide=true caption="A descriptive caption"}
const greeting = (name) => {
  return `Hello, ${name}!`;
};
```
````

```javascript {wide=true caption="Listing 1: A JavaScript greeting function spanning both columns."}
const greeting = (name) => {
  return `Hello, ${name}!`;
};
```

Supported languages include: `python`, `javascript`, `go`, `rust`, `c`, `cpp`, `java`, `html`, `css`, `bash`, `latex`, `markdown`, and [many more](https://gohugo.io/content-management/syntax-highlighting/#list-of-chroma-highlighting-languages).

## Tables

Tables use standard markdown syntax. Add an HTML comment before the table to specify attributes.

**Single-column table** (default):
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |
```

**Wide table with caption** (spans both columns):
```markdown
<!-- table: wide=true caption="Table caption here" -->
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |
```

## Layout Options

### Per-Post Column Mode

By default, posts use a two-column layout on wide screens. To force single-column layout for a specific post, add `columns: 1` to the front matter:

```yaml
+++
title = 'My Post'
columns = 1
+++
```

### Column Breaks

**Single column break** — moves to the next column:

```markdown
{{</* colbreak */>}}
```

{{< colbreak >}}

This paragraph appears after a single column break. The tops of each column remain parallel.

**Section break** — spans both columns with a centered title, ending and restarting the two-column flow:

```markdown
{{</* section-break title="New Section Title" */>}}
```

{{< section-break title="Conclusion" >}}

All features documented above work together with the two-column layout, automatically adjusting based on screen width.[^responsive] The table below provides a quick reference for all available syntax.

<!-- table: wide=true caption="Table 1: Summary of available shortcodes and syntax." -->
| Feature | Syntax | Options |
|---------|--------|---------|
| Footnote | `[^label]` | Multi-paragraph with indentation |
| Inline math | `\(x\)` | — |
| Display math | `\[x\]` | — |
| Figure | `fig` shortcode | `src`, `caption`, `wide` |
| Plot | `plot` shortcode | `id`, `src`, `caption`, `wide` |
| Code | ` ```lang {attrs}` | `wide`, `caption` |
| Table | `<!-- table: attrs -->` | `wide`, `caption` |
| Column break | `colbreak` shortcode | — |
| Section break | `section-break` shortcode | `title` |

[^features]: This site uses custom CSS and Hugo shortcodes to achieve an APS journal article aesthetic. The styling includes justified text, two-column layout on wide screens, and proper handling of figures and equations.

[^basic-footnote]: Footnotes appear as superscript numbers and are collected at the bottom of the article.

[^long-footnote]: This is an example of a multi-paragraph footnote. The first paragraph introduces the concept.

    The second paragraph provides additional details. Note that it must be indented with four spaces to be included in the same footnote. You can include as many paragraphs as needed.

[^responsive]: The two-column layout activates at 900px screen width. On narrower screens, content displays in a single column.
