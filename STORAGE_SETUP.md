# Storage Buckets Setup Instructions

## Step 1: Create Storage Buckets

Go to your Supabase dashboard → **Storage** → **Buckets** and create these buckets:

### Bucket 1: `resources`
- **Name**: `resources`
- **Public**: ✅ Yes
- **File size limit**: 50MB
- **Allowed MIME types**: `image/*,application/pdf`

### Bucket 2: `uploads`
- **Name**: `uploads`
- **Public**: ✅ Yes
- **File size limit**: 50MB
- **Allowed MIME types**: `image/*,application/pdf`

### Bucket 3: `profile-images`
- **Name**: `profile-images`
- **Public**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

## Step 2: Set Storage Policies

For each bucket, go to **Storage** → **Policies** and add these policies:

### For `resources` bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'resources');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Authenticated update/delete" ON storage.objects FOR ALL USING (bucket_id = 'resources' AND auth.role() = 'authenticated');
```

### For `uploads` bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Authenticated update/delete" ON storage.objects FOR ALL USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
```

### For `profile-images` bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update/delete their own files
CREATE POLICY "Authenticated update/delete" ON storage.objects FOR ALL USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
```

## Step 3: Test Your Setup

1. Run the database setup script (`database-setup.sql`) in your Supabase SQL Editor
2. Create the storage buckets as described above
3. Add the storage policies
4. Start your application: `npm run dev`
5. Test login with:
   - Admin: `saeed` / `Archimedes`
   - Admin: `hassan` / `Archimedes`
   - SMC: `school` / `sunnah`

Your Supabase migration is now complete! 🎉
