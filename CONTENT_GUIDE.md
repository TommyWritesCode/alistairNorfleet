# Alistair Norfleet — Content Management Guide

This guide explains how to update every piece of content on the website
without touching any code. All content lives in the `data/` folder.

---

## Adding or Editing Essays

Open **`data/essays.json`** in any text editor.

Each essay looks like this:

```json
{
  "id": "my-essay-title",
  "title": "My Full Essay Title Here",
  "date": "2024-06-01",
  "year": 2024,
  "description": "A one-sentence summary shown in the sidebar.",
  "pdf": "assets/pdfs/essays/my-essay-title.pdf",
  "preview": "The opening paragraphs of the essay..."
}
```

**To add a new essay:**
1. Copy one of the existing entries (the `{ … }` block including the braces).
2. Paste it at the **top** of the list (inside the outer `[` `]`), before the first entry.
3. Add a comma after your new entry's closing `}`.
4. Update every field with the correct information.
5. Place the PDF file at the path listed in `"pdf"`.

**Fields explained:**
- `id` — A unique short name, no spaces, all lowercase with hyphens. Used in the URL.
- `title` — The full title as it appears on the page.
- `date` — Format: `YYYY-MM-DD` (year-month-day).
- `year` — Just the 4-digit year (used for grouping in the bibliography).
- `description` — Short description shown in the sidebar.
- `pdf` — Path to the PDF file on the server.
- `preview` — The opening text of the essay (2–4 paragraphs). Separate paragraphs with a blank line.

---

## Adding or Editing Artwork

Open **`data/art.json`** in any text editor.

Each artwork looks like this:

```json
{
  "id": "artwork-name",
  "title": "Artwork Title",
  "year": 2024,
  "medium": "Oil on canvas",
  "dimensions": "24 × 36 in",
  "image": "assets/images/art/artwork-name.jpg",
  "placeholder": "linear-gradient(135deg, #0a1628 0%, #1a2d5a 100%)",
  "description": "A short description of the piece.",
  "size": "large"
}
```

**To add a new artwork:**
1. Copy an existing entry and paste it at the **top** of the list.
2. Update all fields.
3. Place the image file at the path listed in `"image"`.

**Size options** (controls how large the piece appears in the gallery):
- `"large"` — Biggest display
- `"standard"` — Medium
- `"portrait"` — Tall and narrow
- `"wide"` — Short and wide

**Placeholder:** A CSS gradient that shows while the image loads (or if the image is missing).
Leave this as-is unless you want to change the color preview.

---

## Adding or Editing Greeting Messages

Open **`data/greetings.txt`** in any text editor.

Each line is one greeting. The website picks one at random each time the page loads.

Add as many lines as you like. Keep each greeting on its own line.

---

## Adding Files

| What to add | Where to put it |
|---|---|
| Essay PDFs | `assets/pdfs/essays/` |
| Art images | `assets/images/art/` |
| Headshot | `assets/images/headshot.jpg` |
| Résumé PDF | `assets/pdfs/resume.pdf` |

---

## Updating Contact Information

To change the email address or Instagram handle, search for `alistair@example.com`
and `@alistnorfleet` in the HTML files (`about.html`, `js/main.js`) and update them.

---

## Running the Website Locally (for testing)

The website requires a local web server to load its data files.
Open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.
