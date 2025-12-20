# Admin Panel Setup - Testing Guide

## Overview
The admin panel is now fully connected to the frontend sections:
- **Hero Banners** → Hero Section
- **Deals** → Deals Page
- **Tours (Collections)** → Tours Section

## How It Works

### Data Flow
1. **Admin adds/edits content** → Saved to `localStorage`
2. **Frontend loads on mount** → Reads from `localStorage`
3. **Cross-tab updates** → Storage events trigger live updates

### LocalStorage Keys
- `hero_banners` - Hero section images
- `deals` - Deals page items
- `tours` - Tours section items
- `inquiries` - Contact form submissions
- `admin_logged_in` - Admin auth state

## Testing Steps

### 1. Start Dev Server
```powershell
cd "c:\Users\ASUS\Pictures\New folder\frontend"
npm run dev
```

### 2. Access Admin Panel
- Open main site: `http://localhost:5173`
- Click **Login** button in header (opens new tab)
- Sign in with: `admin` / `admin`

### 3. Test Hero Banners
**In Admin:**
- Go to "Hero Banners" tab
- Click file input to upload a local image OR paste an image URL
- Click "Add"
- You should see the banner in the list

**In Frontend:**
- Switch to main site tab
- Hero section should show your new banner automatically (cross-tab update)
- If same tab: refresh to see changes

### 4. Test Deals
**In Admin:**
- Go to "Deals" tab
- Fill in: Title, Description, Price, Image (upload or URL)
- Click "Add"

**In Frontend:**
- Navigate to `/deals` page
- Your new deal should appear in the grid
- Cross-tab update works automatically

### 5. Test Tours (Collections)
**In Admin:**
- Go to "Tours" tab
- Fill in: Name, Location, Price, Duration, Rating, Description, Image
- Click "Add"

**In Frontend:**
- Scroll to Tours section on homepage
- Your new tour should appear in the grid
- Cross-tab update works automatically

### 6. Test Inquiries
**In Frontend:**
- Go to Contact page
- Fill and submit the form

**In Admin:**
- Go to "Inquiries" tab
- You should see the submitted inquiry with timestamp

## Notes

### Image Uploads
- Images are converted to **base64 data URLs** and stored in localStorage
- This works for demo/local use but has size limitations (~5-10MB per item)
- For production, replace with cloud storage (S3, Supabase, etc.)

### Cross-Tab Updates
- Uses browser's `storage` event API
- Only triggers when localStorage changes in **different tabs**
- Same-tab changes require page refresh

### Fallback Behavior
- If no admin data exists, frontend shows default hardcoded content
- Deleting all items in admin will restore defaults on next page load

## Troubleshooting

### Banners not showing?
1. Open browser DevTools → Console
2. Check for localStorage errors
3. Verify `localStorage.getItem('hero_banners')` returns data
4. Try clearing localStorage: `localStorage.clear()` and re-add

### Cross-tab not updating?
- Storage events only fire in **other tabs**, not the same tab
- Refresh the page to see same-tab changes

### Admin login not working?
- Default credentials: `admin` / `admin`
- Check localStorage: `localStorage.getItem('admin_logged_in')` should be `'1'`
- Clear if stuck: `localStorage.removeItem('admin_logged_in')`

## Production Considerations

Before deploying:
1. **Replace localStorage** with a backend API (Express, Supabase, Firebase)
2. **Implement real auth** (JWT, session cookies, OAuth)
3. **Add image upload to cloud storage** (S3, Cloudinary, Supabase Storage)
4. **Add validation** (image size, format, required fields)
5. **Add pagination** for large datasets
6. **Use environment variables** for API URLs and credentials
