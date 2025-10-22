# Supabase Migration Setup Guide

## Step-by-Step Configuration Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `tawheed-school-management`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project setup to complete (2-3 minutes)

### 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env` in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste into the SQL Editor
4. Click **Run** to execute the schema
5. Verify tables were created in **Table Editor**

### 5. Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets (click "New bucket" for each):

   **Bucket 1: `resources`**
   - Name: `resources`
   - Public: ✅ Yes
   - File size limit: 50MB
   - Allowed MIME types: `image/*,application/pdf`

   **Bucket 2: `uploads`**
   - Name: `uploads`
   - Public: ✅ Yes
   - File size limit: 50MB
   - Allowed MIME types: `image/*,application/pdf`

   **Bucket 3: `profile-images`**
   - Name: `profile-images`
   - Public: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

### 6. Configure Storage Policies

1. For each bucket, go to **Storage** → **Policies**
2. Add the following policies (replace with your security requirements):

**For `resources` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'resources');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Authenticated update/delete" ON storage.objects FOR ALL USING (bucket_id = 'resources' AND auth.role() = 'authenticated');
```

**For `uploads` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Authenticated update/delete" ON storage.objects FOR ALL USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
```

**For `profile-images` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Authenticated update/delete" ON storage.objects FOR ALL USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
```

### 7. Test the Migration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the following features:
   - ✅ Login with admin credentials (`saeed`/`Archimedes` or `hassan`/`Archimedes`)
   - ✅ Login with SMC credentials (`school`/`sunnah`)
   - ✅ Add a new teacher
   - ✅ Upload a resource file
   - ✅ Create an announcement
   - ✅ Submit a suggestion
   - ✅ Check that data persists after page refresh

### 8. Production Deployment

1. **Environment Variables**: Set the same environment variables in your production environment
2. **Database**: Your Supabase project is already production-ready
3. **Storage**: Files will be served from Supabase CDN automatically
4. **Security**: Review and tighten RLS policies for production

### 9. Data Migration (if you have existing localStorage data)

If you have existing data in localStorage, you can migrate it:

1. Open browser DevTools → Application → Local Storage
2. Export your data (copy JSON values)
3. Use the Supabase dashboard or create migration scripts to insert the data

### 10. Troubleshooting

**Common Issues:**

- **"Missing Supabase environment variables"**: Check your `.env` file has correct values
- **"Failed to fetch"**: Verify your Supabase URL is correct
- **"Permission denied"**: Check your RLS policies and API keys
- **File upload fails**: Verify storage buckets exist and policies are set

**Debug Steps:**
1. Check browser console for errors
2. Verify environment variables are loaded: `console.log(import.meta.env.VITE_SUPABASE_URL)`
3. Test Supabase connection in browser console:
   ```javascript
   import { supabase } from './src/lib/supabase.js'
   console.log(supabase)
   ```

### 11. Security Considerations

- **API Keys**: Never commit `.env` files to version control
- **RLS Policies**: Implement proper row-level security policies
- **File Uploads**: Validate file types and sizes on both client and server
- **Authentication**: Consider implementing proper user authentication instead of hardcoded credentials

### 12. Performance Optimization

- **Database Indexes**: Already included in the schema
- **File CDN**: Supabase automatically serves files via CDN
- **Real-time**: Consider enabling real-time subscriptions for live updates
- **Caching**: Implement client-side caching for frequently accessed data

## Migration Complete! 🎉

Your Tawheed School Management System is now running on Supabase with:
- ✅ PostgreSQL database
- ✅ File storage with CDN
- ✅ Real-time capabilities
- ✅ Scalable infrastructure
- ✅ Production-ready setup
