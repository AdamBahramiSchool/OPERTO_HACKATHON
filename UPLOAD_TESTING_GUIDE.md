# Upload Feature Testing Guide

## Quick Test Steps

### 1. Create a Test Zip File

Create a simple test directory structure:

```bash
mkdir -p test-upload/dist
cd test-upload/dist

# Create a simple HTML file
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Website</title>
</head>
<body>
    <h1>Welcome to Test Website</h1>
    <p>This is a test page for the upload feature.</p>
    <p>We offer great services in multiple locations.</p>
</body>
</html>
EOF

# Create a JavaScript file
cat > main.js << 'EOF'
const greeting = "Welcome to our application";
const message = "Click here to get started";
function init() {
    console.log("App initialized");
}
EOF

# Create a robots.txt
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
EOF

# Create a sitemap.xml
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

# Zip it up
cd ..
zip -r test-website.zip dist/
```

### 2. Navigate to Upload Page

1. Open your browser to `http://localhost:3000/dashboard/upload`
2. Make sure you're logged in

### 3. Upload the Zip File

1. Click the upload area or drag the `test-website.zip` file
2. Watch the progress bar
3. Check for success message with statistics

### 4. Verify in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Storage** → **Markdown** bucket (or your configured bucket)
3. Look for the path: `uploaded-data/CID-{YOUR_ID}/bundle.md`
4. Download and verify the content

### 5. Check Console Logs

In your terminal running the dev server, you should see:
```
Processing upload for CID: CID-XXXXXXXX
✓ Uploaded bundle: uploaded-data/CID-XXXXXXXX/bundle.md
```

## Expected Results

### Success Response
```json
{
  "success": true,
  "cid": "CID-A80FA717",
  "storagePath": "uploaded-data/CID-A80FA717/bundle.md",
  "stats": {
    "totalFiles": 4,
    "htmlFiles": 1,
    "jsFiles": 1,
    "otherFiles": 2
  },
  "bundleSize": 1234
}
```

### Bundle.md Content Structure
```markdown
# Uploaded Build Bundle

**Upload Date:** 2026-03-05T...
**CID:** CID-A80FA717
**Original File:** test-website.zip

---

## HTML File: dist/index.html
**Path:** `dist/index.html`

**Extracted Content:**
```
Welcome to Test Website This is a test page...
```

---

## JavaScript File: dist/main.js
**Path:** `dist/main.js`

**Readable Strings:**
```
Welcome to our application
Click here to get started
```

---

## Special File: dist/robots.txt
**Path:** `dist/robots.txt`

**Content:**
```
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
```

---
```

## Common Issues & Solutions

### Issue: "Please log in to upload files"
**Solution**: Make sure you're authenticated. Go to `/login` first.

### Issue: "File too large. Maximum size is 50MB"
**Solution**: Reduce the size of your zip file or increase `MAX_FILE_SIZE` in the API route.

### Issue: "Upload failed" with 500 error
**Solution**: 
1. Check terminal logs for detailed error
2. Verify Supabase credentials in `.env`
3. Ensure the bucket exists and is accessible
4. Check that `SUPABASE_SERVICE_ROLE_KEY` has write permissions

### Issue: No files showing in statistics
**Solution**: 
1. Make sure your zip contains `.html`, `.js`, or special files
2. Check that files aren't in hidden directories (like `__MACOSX`)
3. Verify file extensions are correct

## Testing Different File Types

### Test with React Build
```bash
# If you have a React app
cd my-react-app
npm run build
cd build
zip -r ../react-build.zip .
# Upload react-build.zip
```

### Test with Next.js Build
```bash
# If you have a Next.js app
cd my-nextjs-app
npm run build
cd .next
zip -r ../nextjs-build.zip .
# Upload nextjs-build.zip
```

### Test with Static Site
```bash
# Any static HTML site
cd my-static-site
zip -r site.zip index.html css/ js/ images/
# Upload site.zip
```

## Verification Checklist

- [ ] Upload page loads without errors
- [ ] File input accepts .zip files
- [ ] Progress bar shows during upload
- [ ] Success message appears with correct statistics
- [ ] File appears in Supabase storage at correct path
- [ ] Bundle.md contains extracted content
- [ ] HTML text is properly extracted
- [ ] JavaScript strings are captured
- [ ] Special files (robots.txt, sitemap.xml) are included
- [ ] Error handling works for invalid files
- [ ] Navigation link appears in sidebar

## Next Steps After Testing

1. **Integrate with Insights Engine**: Modify `/api/insights` to optionally read from `uploaded-data` bucket
2. **Add Toggle in Dashboard**: Let users choose between crawler data and uploaded data
3. **Add Upload History**: Create a database table to track all uploads
4. **Add File Preview**: Show a preview of the bundle before running analysis
5. **Add Delete Functionality**: Allow users to delete their uploaded bundles

