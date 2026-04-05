# Google Sheets → Supabase migration: exact issues and where to change

This file compares your **old pages** (`*1.html`) and your **new pages** (`index.html`, `passed.html`, etc.) and lists concrete fixes.

## 1) Why new UI does not look like old UI

### Exact issue
Your old pages keep their own full CSS inside each HTML file (for example `index1.html` has a large `<style>...</style>` block with black/yellow top bar, cards, badges, etc.).

Your new pages (`index.html`, `passed.html`, `dashboard.html`) use only `styles.css`, which is a very small generic stylesheet and does not contain the old design system.

### File locations
- Old styles: `index1.html`, `passed1.html`, `dashboard1.html` (inside each file’s `<style>` block)
- New styles in use: `styles.css`
- New pages linking it: `index.html`, `passed.html`, `dashboard.html`

### What to change
Option A (best for beginner):
1. Copy the old CSS from `index1.html` into `styles.css` (or create `styles-modern.css`).
2. Update class names/HTML structure in new pages to match old structure (`.top-bar`, `.card`, table styles, etc.).

Option B (quick):
1. Temporarily paste old `<style>` blocks into the new pages.
2. Later refactor into `styles.css`.

---

## 2) New `index.html` is missing old page layout and controls

### Exact issue
Old `index1.html` has:
- branded top bar (logo/title/search/filter/create buttons)
- rich table styling
- loader/modal UX
- multiple controls

New `index.html` has only:
- simple heading
- two inputs (`machine`, `engineer`)
- one table

So even if data loads, the page cannot look/behave like old one because the HTML structure is different.

### File locations
- Compare structure: `index1.html` vs `index.html`

### What to change
Recreate old container structure in `index.html` first (top bar/card/table wrappers), then connect existing Supabase functions (`getFilteredRows`) to those controls.

---

## 3) New `passed.html` removed old list-level workflow

### Exact issue
Old `passed1.html` works by `listId` from URL and fetches only rows for that list, then saves passed amounts for that list.

New `passed.html`:
- loads all rows (`getAllRows()`)
- does not read `listId`
- does not display status (`PASSED/PENDING`)
- does not disable already-passed rows

So behavior is not equivalent.

### File locations
- Old logic: `passed1.html` (`LIST_ID` and `loadRows()`/`saveAll()`)
- New logic: `passed.html` (`load()` and `save()`)
- DB helpers: `api.js`

### What to change
1. In `passed.html`, read URL param:
   ```js
   const listId = new URLSearchParams(location.search).get("listId");
   ```
2. Add a new API method in `api.js` to fetch only that list.
3. In render, disable input if `passed_amount` already exists.
4. Show status text based on passed value.

---

## 4) `api.js` currently has only generic queries (missing list-aware methods)

### Exact issue
You currently have:
- `getAllRows()`
- `getFilteredRows()`
- `updatePassedAmount(rows)`
- `deleteRow(unique_key)`

But old pages rely on actions like:
- get rows by list
- update list rows together
- page-specific workflows (edit/list/dashboard detail)

### File locations
- `api.js`

### What to change
Add methods like:
- `getRowsByListId(listId)`
- `savePassedByList(listId, rows)` (or row-wise update constrained by list)
- `getDashboardSummary(filters)` if needed

---

## 5) Potential data mismatch: old sheet column indexes vs new named DB fields

### Exact issue
Old code uses sheet index positions (e.g., `r[31]`, `r[28]`, `r[10]`), while new code uses named fields (`passed_amount`, `date`, `machine_no`, etc.).

If your Supabase columns are not mapped exactly, values may appear blank/wrong.

### File locations
- Old index-based mapping: `passed1.html` (inside `render`)
- New field-based mapping: `passed.html`, `index.html`, `api.js`

### What to change
Verify Supabase table `consolidation` has columns used in new code exactly:
- `date`
- `engineer_name`
- `machine_no`
- `complaint`
- `total_tada`
- `passed_amount`
- `unique_key`
- `list_id` (if your workflow is list-based)

---

## 6) Minimum step-by-step fix plan (beginner-friendly)

1. **Fix UI first**
   - Make `index.html` structure match `index1.html`.
   - Move old CSS to `styles.css`.

2. **Fix list flow**
   - Add `listId` support in `passed.html` and `api.js`.

3. **Fix field mapping**
   - Confirm Supabase column names and update JS keys to match exactly.

4. **Then test page by page**
   - `index.html` loads + filters.
   - `passed.html?listId=...` shows correct rows.
   - Save updates only intended rows.

---

## 7) Concrete first code edits to start with

### Edit 1: `passed.html`
- Add `listId` extraction from URL.
- Replace `getAllRows()` with `getRowsByListId(listId)`.
- In render, use:
  - `value="${r.passed_amount ?? ""}"`
  - `disabled` when already passed.

### Edit 2: `api.js`
Add:
```js
async function getRowsByListId(listId) {
  const { data, error } = await supabase
    .from("consolidation")
    .select("*")
    .eq("list_id", listId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}
```

### Edit 3: `index.html`
- Replace simple body layout with old wrappers/classes from `index1.html`.
- Keep data function calls from new Supabase code.

---

If you want, next I can give you a **line-by-line patch** for `index.html`, `passed.html`, and `api.js` so you can copy-paste directly.
