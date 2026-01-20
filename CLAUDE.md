# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
hugo server          # Development server with live reload
hugo                 # Build site
hugo -D              # Build including drafts
```

No additional build tools required - Hugo handles SCSS compilation internally.

## Architecture Overview

This is a Hugo theme for academic/journal-style publishing with a two-column layout, inspired by APS (American Physical Society) journal formatting.

### Directory Structure

- `assets/scss/typographical/` - SCSS source files compiled by Hugo at build time
- `layouts/_default/` - Main templates (single.html, list.html, summary.html)
- `layouts/partials/` - Reusable template fragments (head.html, header.html, footer.html)
- `layouts/shortcodes/` - Custom shortcodes (colbreak, section-break, fig, plot, code, table)
- `static/css/` - Pre-compiled CSS for features (aps-style.css, syntax.css, search.css, theme-toggle.css)
- `static/js/` - JavaScript for interactive features (search.js, toc.js, theme-toggle.js, tag-filter.js)

### SCSS Templating Pattern

SCSS files are processed through Hugo's template engine, allowing config values to be injected:

```scss
// In assets/scss/typographical.scss
$code-color: {{ .Site.Params.CodeColour | default "#bf616a"}};
```

Compiled in `head.html` via `resources.ExecuteAsTemplate`.

### Theme System (Dark/Light Mode)

The theme mixin in `_variables.scss` outputs styles for:
1. Light mode (default)
2. System dark preference (`@media (prefers-color-scheme: dark)`)
3. Manual toggle via `[data-theme="dark"]` / `[data-theme="light"]` on `<html>`

The `theme-toggle.js` script loads synchronously (not deferred) to prevent flash. User preference stored in localStorage.

### Content Processing Pipeline (single.html)

1. Extract content before footnotes section
2. Apply drop caps to first paragraph (regex-based)
3. Apply `<abbr>` tags to acronyms (3+ uppercase letters)
4. Strip `<abbr>` tags from inside math expressions (`\(...\)`)
5. Strip `<abbr>` tags from inside HTML attributes (src, href, etc.)

### Two-Column Layout

Enabled via CSS multi-column in `aps-style.css` for screens >= 900px:
- Code blocks and `.wide` elements span both columns (`column-span: all`)
- Regular figures stay within one column
- Per-post override: `columns: 1` in front matter adds `.single-column` class

### Key Features

**Search**: Client-side Lunr.js search. Index generated at `/index.json`. Keyboard: Ctrl/Cmd+K to focus.

**Table of Contents**: Generated from h2/h3 headings by `toc.js`. Section breaks (`{{< section-break >}}`) affect hierarchy. Sidebar state persisted in localStorage.

**Tag Filtering**: Dropdown in header filters posts client-side. URL param support: `?tag=tagname`.

**Math Rendering**: KaTeX loaded from CDN when `math = true`. Delimiters: `\[...\]` (display), `\(...\)` (inline).

**Figure Numbering**: Figures with captions are auto-numbered by `figure-numbers.js`. Existing "Figure N: " prefixes are replaced. Figures without captions are skipped.

## Important Patterns

### Regex for Acronyms Must Avoid HTML Attributes

The abbr regex matches inside image URLs and breaks them. The fix iterates to strip `<abbr>` from inside HTML tags:

```go
{{- range seq 5 -}}
    {{- $Content = $Content | replaceRE `(<[a-zA-Z][^>]*)<abbr>([^<]+)</abbr>([^>]*>)` "$1$2$3" -}}
{{- end -}}
```

### Code Block Styling

Code blocks use Monokai theme (syntax.css). The theme toggle must NOT affect code blocks - they maintain dark background regardless of page theme. See "Preserve code block Monokai theme" section in aps-style.css.

### Shortcodes

- `{{< colbreak >}}` - Force column break
- `{{< section-break title="..." >}}` - Section divider (affects TOC hierarchy)
- `{{< fig src="..." caption="..." wide=true >}}` - Figure with optional spanning
- `{{< code caption="..." wide=true >}}` - Code block wrapper

## Configuration Parameters

Key params in site config:
- `math`, `plotly`, `search`, `tagFilter` - Enable features
- `CodeColour`, `AccentColour`, `CodeBackground` - Injected into SCSS
- `DropCap.Enable`, `DropCap.FontSize` - Drop cap settings
- `SummaryWordLimit` - Word limit for post summaries (default: 50)
