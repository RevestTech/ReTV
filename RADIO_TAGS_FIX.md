# Radio Tags Endpoint Fix Summary

**Date:** April 3, 2026  
**Issue:** `/api/radio/tags` endpoint returning 500 Internal Server Error  
**Status:** 🟡 IN PROGRESS

---

## Problem

The `/api/radio/tags` endpoint was failing with 500 errors, causing the radio interface to break.

### Root Causes Found:

1. **❌ Dictionary access bug** - Code was trying to access dict as object (`.name` instead of `["name"]`)
2. **❌ Expensive SQL query** - Query was scanning 50K+ radio stations with `unnest()` and string operations, timing out after 10+ seconds
3. **❌ No query optimization** - No indexes, no materialized view, doing real-time aggregation

---

## Fixes Applied

### ✅ Fix 1: Dictionary Access Bug (Deployed)
**File:** `backend/app/routers/radio.py`
```python
# Before (WRONG):
await cache_set("radio_tags", [{"name": d.name, ...} for d in data], TTL)

# After (FIXED):
await cache_set("radio_tags", data, TTL)  # data is already dicts
```
**Status:** ✅ Deployed

### ✅ Fix 2: Added Error Handling (Deployed)
**File:** `backend/app/routers/radio.py`
- Added try/except with proper logging
- Returns clear error messages instead of generic 500

**Status:** ✅ Deployed

### 🟡 Fix 3: Query Optimization (In Progress)
**Attempts made:**
1. Limited to top 30K stations → Still too slow
2. Limited to top 10K stations → Still too slow  
3. Added `SET LOCAL statement_timeout` → Syntax issues
4. Simplified query structure → Still timing out

**Current Approach:**
Replaced expensive real-time query with static curated list of common tags.

**File:** `backend/app/services/radio_service.py`
```python
def get_radio_tags(db, limit=60):
    # Returns static list of common genres
    common_tags = [
        {"name": "music", "station_count": 5000},
        {"name": "pop", "station_count": 3500},
        {"name": "news", "station_count": 2800},
        # ... etc
    ]
    return common_tags[:limit]
```

**Status:** 🟡 Deployed but still showing 500 (investigating)

---

## Why the Query Was So Slow

The original query:
```sql
SELECT tag, COUNT(*) AS cnt
FROM (
    SELECT lower(trim(unnest(string_to_array(tags, ',')))) AS tag
    FROM radio_stations
    WHERE tags != '' AND tags IS NOT NULL
) t
WHERE length(tag) > 1
GROUP BY tag
ORDER BY cnt DESC
LIMIT 60
```

**Problems:**
1. **Full table scan** of 50,076 radio stations
2. **String splitting** on every row (`string_to_array`)
3. **Array unnesting** (`unnest`) creating potentially 200K+ temp rows
4. **No indexes** on `tags` or `votes` columns
5. **No pre-computed tags table**

**Performance:** 15+ seconds, hits 10s timeout

---

## Proper Long-term Solution

### Option A: Materialized View (Recommended)
```sql
CREATE MATERIALIZED VIEW radio_tags_mv AS
SELECT tag, COUNT(*) AS cnt
FROM (
    SELECT lower(trim(unnest(string_to_array(tags, ',')))) AS tag
    FROM radio_stations
    WHERE tags != '' AND votes > 1000
) t
WHERE length(tag) > 1
GROUP BY tag
ORDER BY cnt DESC;

-- Refresh nightly via cron job
REFRESH MATERIALIZED VIEW radio_tags_mv;
```

**Benefits:**
- Query takes <10ms (just reads pre-computed results)
- Updates once per day (tags don't change often)
- No impact on user requests

### Option B: Dedicated Tags Table
```sql
CREATE TABLE radio_tags (
    tag_name VARCHAR(100) PRIMARY KEY,
    station_count INTEGER,
    updated_at TIMESTAMP
);

-- Populate via background job
```

**Benefits:**
- Even faster than materialized view
- Can track tag changes over time
- Easier to add metadata (trending, etc.)

### Option C: Add Index + Limit Aggressively
```sql
CREATE INDEX ix_radio_votes ON radio_stations(votes DESC);
CREATE INDEX ix_radio_tags ON radio_stations USING GIN (to_tsvector('simple', tags));
```

Then limit query to top 5K stations.

---

## Current Status

### ✅ Working Endpoints:
- `/api/radio/stations` - Works, returns 50,076 stations
- `/api/radio/countries` - Works, returns country list

### 🔴 Broken Endpoints:
- `/api/radio/tags` - Still returning 500
  - Code fix deployed
  - Static list deployed
  - But still failing (possible deployment delay or caching issue)

### Next Steps:
1. ⏳ Wait for Railway deployment to fully complete
2. 🔍 Check Railway logs for actual error
3. 🐛 Debug why static list is still failing
4. ✅ Once working, implement proper long-term solution (Option A or B)

---

## Temporary Workaround

If you need tags working ASAP, you can:

1. **Frontend fallback:**
   ```javascript
   const fallbackTags = [
     {name: "music", station_count: 5000},
     {name: "pop", station_count: 3500},
     {name: "news", station_count: 2800},
     // ... etc
   ];
   
   try {
     tags = await fetch('/api/radio/tags');
   } catch {
     tags = fallbackTags;  // Use hardcoded list
   }
   ```

2. **Disable tag filter temporarily:**
   - Remove tag dropdown from radio interface
   - Users can still search by text

---

## Testing Commands

```bash
# Test if endpoint works
curl https://backend-production-d32d8.up.railway.app/api/radio/tags

# Should return:
# [{"name":"music","station_count":5000},...]

# Test countries (working)
curl https://backend-production-d32d8.up.railway.app/api/radio/countries

# Test stations (working)
curl https://backend-production-d32d8.up.railway.app/api/radio/stations?limit=5
```

---

## Lessons Learned

1. **Always test expensive queries** before deploying
   - Run `EXPLAIN ANALYZE` on production-size data
   - Set aggressive timeouts (5-10s max)

2. **Pre-compute expensive aggregations**
   - Use materialized views for slow queries
   - Refresh via background jobs

3. **Have fallbacks for optional features**
   - Tags are nice-to-have, not critical
   - App should work even if tags fail

4. **Add query performance monitoring**
   - Log slow queries (>1s)
   - Alert on queries >5s

---

## Priority

**Severity:** 🟡 Medium  
**Impact:** Radio tag filtering doesn't work  
**Workaround:** Users can still browse/search radio stations  
**ETA:** Investigating deployment issue, then implementing Option A

---

**Files Modified:**
- ✅ `backend/app/routers/radio.py` - Fixed dict access, added error handling
- ✅ `backend/app/services/radio_service.py` - Replaced expensive query with static list
- 🟡 Still investigating why 500 persists despite fixes

**Next Action:** Check Railway deployment logs to see actual error
