# Bundle Upload Feature

## Overview
Users can now upload their build files (`/dist` or `/src` folder) as a `.zip` file for AI analysis. The system extracts readable content and stores it in Supabase for processing.

## User Flow

1. **Navigate to `/dashboard/upload`**
2. **Upload a .zip file** containing their build directory
3. **System processes the zip**:
   - Extracts text from HTML files
   - Extracts readable strings from JavaScript files
   - Captures special files (robots.txt, sitemap.xml, JSON configs)
   - Extracts text from CSS files
4. **Bundles everything** into a single markdown file
5. **Uploads to Supabase** at `uploaded-data/{CID}/bundle.md`
6. **Shows statistics** about processed files

## Technical Implementation

### Frontend: `/dashboard/upload/page.tsx`
- **Drag-and-drop upload interface** with visual feedback
- **Progress tracking** with percentage and status messages
- **File validation** (must be .zip, max 50MB)
- **Success/error states** with detailed statistics
- **File statistics display**:
  - Total files processed
  - HTML files count
  - JavaScript files count
  - Other files count

### Backend: `/api/upload-bundle/route.ts`
- **Zip processing** using `jszip` library
- **HTML text extraction** using `jsdom`
- **JavaScript string extraction** with regex patterns
- **CSS text extraction** from content properties
- **Markdown bundling** with organized sections
- **Supabase storage upload** to `uploaded-data/{CID}/bundle.md`

## File Processing Logic

### HTML Files (.html, .htm)
- Parses HTML using JSDOM
- Removes `<script>` and `<style>` tags
- Extracts clean text content
- Limits to 5000 characters per file

### JavaScript Files (.js, .jsx, .ts, .tsx)
- Extracts string literals using regex
- Filters out code-like strings (functions, arrow functions, const declarations)
- Removes duplicates
- Limits to 3000 characters per file

### Special Files
- **robots.txt**: Full content (up to 5000 chars)
- **sitemap.xml**: Full content (up to 5000 chars)
- **JSON files**: Full content (up to 5000 chars)

### CSS Files (.css)
- Extracts text from `content:` properties
- Removes duplicates
- Limits to 2000 characters per file

## Storage Structure

```
Supabase Storage Bucket: {SUPABASE_BUCKET}
└── uploaded-data/
    └── {CID}/
        └── bundle.md
```

Example: `uploaded-data/CID-A80FA717/bundle.md`

## Markdown Bundle Format

```markdown
# Uploaded Build Bundle

**Upload Date:** 2026-03-05T...
**CID:** CID-A80FA717
**Original File:** my-website.zip

---

## HTML File: index.html
**Path:** `dist/index.html`

**Extracted Content:**
```
Home Page Welcome to our website...
```

---

## JavaScript File: main.js
**Path:** `dist/js/main.js`

**Readable Strings:**
```
Welcome to our application
Click here to get started
...
```

---
```

## Dependencies Installed

```bash
npm install jszip jsdom @types/jsdom
```

- **jszip**: For reading and extracting zip files
- **jsdom**: For parsing HTML and extracting text
- **@types/jsdom**: TypeScript definitions for jsdom

## Environment Variables

Uses existing Supabase configuration:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_BUCKET` (same bucket as crawler, but different path)

## File Size Limits

- **Maximum upload size**: 50MB
- **Per-file content limits**:
  - HTML: 5000 characters
  - JavaScript: 3000 characters
  - CSS: 2000 characters
  - Special files: 5000 characters

## Error Handling

- File size validation
- File type validation (.zip only)
- Authentication check (must be logged in)
- Graceful handling of corrupted files within zip
- Detailed error messages for users
- Console logging for debugging

## Next Steps

1. **Test the upload feature** with a real .zip file
2. **Verify Supabase storage** - check that `uploaded-data` path is accessible
3. **Integrate with Insights** - modify the insights engine to optionally pull from `uploaded-data` instead of `Markdown` bucket
4. **Add database metadata** - create a table to track upload history (optional)
5. **Add file preview** - show a preview of the bundled markdown before analysis

## UI Features

- ✅ Drag-and-drop upload area
- ✅ Progress bar with percentage
- ✅ Status messages during processing
- ✅ Error alerts with details
- ✅ Success confirmation with statistics
- ✅ File statistics breakdown
- ✅ Instructions panel
- ✅ Responsive design with glass morphism
- ✅ Loading states and disabled states

## Security Considerations

- User authentication required
- File size limits enforced
- File type validation
- CID-based isolation (users can only access their own uploads)
- Upsert mode (overwrites previous uploads for same CID)

