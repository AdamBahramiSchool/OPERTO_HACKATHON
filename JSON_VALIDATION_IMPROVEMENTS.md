# JSON Validation & Gemini Service Improvements

## Problem
Gemini was returning malformed JSON responses causing parsing errors:
- `Unterminated string in JSON at position 795`
- JSON wrapped in markdown code blocks (` ```json ... ``` `)
- Inconsistent response format

## Solution

### 1. **Created `src/lib/json-helpers.ts`** - Robust JSON Parsing Utilities

#### `extractJSON(text: string)`
- Removes markdown code blocks
- Extracts pure JSON from wrapped responses
- Handles leading/trailing whitespace and non-JSON characters

#### `repairJSON(jsonString: string)`
- Fixes unescaped newlines in strings
- Removes trailing commas
- Attempts to repair common JSON formatting issues

#### `safeParseJSON<T>(text: string)`
**Multi-strategy parsing with fallbacks:**
1. **Strategy 1**: Direct `JSON.parse()` (for clean responses)
2. **Strategy 2**: Extract JSON from markdown, then parse
3. **Strategy 3**: Extract, repair, then parse

Returns:
- `{ success: true, data: T }` on success
- `{ success: false, error: string, rawText: string }` on failure

#### `validateDashboardInsightsSchema(data: any)`
**Validates the GEO SEO audit schema:**
- Checks all required top-level fields
- Validates `overall_rating` structure (score, category, grade)
- Validates `website_scores` (6 categories with score/percentage)
- Validates `flawed_pages` is an array
- Validates `summary` has all required numeric fields

Returns:
- `{ valid: true, data: any }` if schema is correct
- `{ valid: false, errors: string[] }` with detailed error messages

---

### 2. **Updated `src/lib/gemini-service.ts`** - Enhanced Gemini Integration

#### Configuration Improvements:
```typescript
generationConfig: {
    temperature: 0.3,           // Lower for consistent JSON (was 0.7)
    maxOutputTokens: 16384,     // Increased capacity (was 8192)
    responseMimeType: 'application/json', // Force JSON output
}
```

#### Input Optimization:
- **Truncates each page** to 3000 characters to prevent token overflow
- **Logs input size** for debugging
- Prevents hitting token limits that cause truncated responses

#### Enhanced Error Handling:
1. **Detailed logging**:
   - Response length
   - First 200 characters
   - Last 200 characters
   
2. **Debug file creation**:
   - Saves failed responses to `gemini-debug-response.txt`
   - Allows manual inspection of malformed JSON
   
3. **Schema validation**:
   - Validates response structure
   - Logs warnings if incomplete
   - Returns data anyway (graceful degradation)

#### Processing Flow:
```
1. Load system prompt from dashboard_insights_prompt.md
2. Truncate pages to 3000 chars each
3. Send to Gemini with JSON MIME type
4. Receive response
5. Log response preview
6. Use safeParseJSON (3 fallback strategies)
7. Validate schema
8. Return parsed data
```

---

## Key Improvements

### ✅ **Robustness**
- 3-level fallback parsing strategy
- Handles markdown-wrapped JSON
- Repairs common JSON issues
- Saves debug files on failure

### ✅ **Token Management**
- Truncates long pages to prevent overflow
- Increased max output tokens
- Logs input/output sizes

### ✅ **Validation**
- Schema validation with detailed error messages
- Type checking for all required fields
- Graceful degradation if schema is incomplete

### ✅ **Debugging**
- Comprehensive logging at each step
- Saves failed responses to disk
- Shows response previews in console

### ✅ **Consistency**
- Lower temperature (0.3) for more predictable JSON
- Forces JSON MIME type
- Validates output structure

---

## Testing

The service will now:
1. **Handle malformed JSON** - Extract and repair automatically
2. **Prevent token overflow** - Truncate input intelligently
3. **Validate responses** - Ensure schema compliance
4. **Debug failures** - Save problematic responses for inspection

### Expected Console Output (Success):
```
Sending 21 pages to Gemini (45000 characters)...
Received response from Gemini
Response length: 12500 characters
Response start: {"website_url":"https://www.innonthedrive.com",...
Response end: ...,"low_issues_count":15}}
Successfully parsed JSON response
Schema validation passed ✓
```

### Expected Console Output (Failure):
```
Sending 21 pages to Gemini (45000 characters)...
Received response from Gemini
Response length: 8500 characters
Response start: ```json\n{"website_url":"https://...
Response end: ...,"medium_issues_count":8}
Direct parse failed, trying to extract JSON...
Successfully parsed JSON response
Schema validation passed ✓
```

---

## Files Created/Modified

- ✅ `src/lib/json-helpers.ts` (NEW) - JSON parsing utilities
- ✅ `src/lib/gemini-service.ts` (UPDATED) - Enhanced error handling
- ✅ `src/app/api/insights/route.ts` (UNCHANGED) - Uses GeminiService

---

## Next Steps

1. **Test the dashboard** - Navigate to `/dashboard` after crawling
2. **Check console logs** - Verify parsing strategies and validation
3. **Inspect debug files** - If failures occur, check `gemini-debug-response.txt`
4. **Monitor token usage** - Adjust truncation limit if needed (currently 3000 chars/page)

