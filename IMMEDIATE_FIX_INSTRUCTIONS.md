# IMMEDIATE FIX: Point Domains to Backend

## Problem

Railway's CDN/edge proxy strips the `Cross-Origin-Opener-Policy` headers from frontend responses, causing OAuth to fail with "Cross-Origin-Opener-Policy policy would block the window.postMessage call" errors.

## Solution

Point the production domains to the **backend service** where COOP headers work perfectly.

## Steps

### 1. Verify Backend Headers Work

```bash
curl -sI "https://backend-production-d32d8.up.railway.app/" | grep -i "cross-origin"
```

Expected output:
```
cross-origin-embedder-policy: unsafe-none
cross-origin-opener-policy: unsafe-none
```

✅ Backend headers are working!

### 2. Update Railway Domain Configuration

In Railway dashboard:

1. Go to **Backend service**
2. Click **Settings** → **Domains**
3. Add custom domains:
   - `adajoon.com`
   - `www.adajoon.com`

4. Go to **Frontend service**  
5. **Remove** or disable the custom domains (keep only the Railway-generated domain for testing)

### 3. Update DNS Records

In your DNS provider (wherever adajoon.com is registered):

**Option A: Using CNAME (Recommended)**
```
Record Type: CNAME
Name: @  
Value: backend-production-d32d8.up.railway.app

Record Type: CNAME
Name: www
Value: backend-production-d32d8.up.railway.app
```

**Option B: Using A Record**
Get the A record from Railway backend service and point both `@` and `www` to it.

### 4. Update Frontend Environment Variable

The frontend needs to know where the API is. Update Railway frontend environment variable:

```
VITE_API_URL=/api
```

(Use relative URL since frontend and backend will be on same domain)

### 5. Wait for DNS Propagation

DNS changes can take 5-60 minutes to propagate. Test with:

```bash
# Check DNS resolution
dig adajoon.com
dig www.adajoon.com

# Check headers
curl -sI "https://adajoon.com/" | grep -i "cross-origin"
curl -sI "https://www.adajoon.com/" | grep -i "cross-origin"
```

You should see the COOP headers!

### 6. Test OAuth Login

1. Open **incognito window**
2. Navigate to `https://adajoon.com`  
3. Click "Sign in with Google"
4. Should work without COOP errors!

## Why This Works

- **Backend**: Railway doesn't strip headers from backend services ✅
- **Frontend via CDN**: Railway strips custom headers ❌  

By routing traffic through backend:
- All requests get proper COOP headers
- OAuth window.postMessage works correctly  
- Authentication cookies work properly

## Alternative: Serve Frontend from Backend (Long-term)

If you want a cleaner architecture, configure FastAPI to serve frontend static files.

I've already added the code to `backend/app/main.py`:
- Serves frontend from `/frontend/dist`
- Catch-all route for SPA routing
- All requests use backend's security headers

To enable this, you'd need to:
1. Build frontend during backend Docker build
2. Copy `frontend/dist` to backend container
3. The backend will automatically serve it

The `Dockerfile.full` in the root already has this setup, but requires Railway configuration changes.

## Current Status

✅ Backend authentication (cookie-based JWT) - FIXED
✅ Backend COOP headers - WORKING
✅ Backend deployment - HEALTHY
⏳ Domains pointing to backend - **NEEDS CONFIGURATION**

Once domains point to backend, OAuth should work immediately!
