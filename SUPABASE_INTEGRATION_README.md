# Supabase Authentication Integration

This document provides instructions to complete the Supabase authentication integration for the MigrantHealthConnect application.

## ✅ What Has Been Completed

1. **Client-side Supabase Configuration**: Created `client/src/lib/supabase.ts` with proper client setup
2. **Server-side Supabase Configuration**: Created `server/supabase.ts` for server operations
3. **Updated Authentication Library**: Modified `client/src/lib/auth.ts` to use Supabase auth
4. **Updated Auth Hook**: Modified `client/src/hooks/use-auth.tsx` to work with Supabase sessions
5. **Updated Server Routes**: Created `server/routes-supabase.ts` with Supabase integration
6. **Database Schema**: Created `supabase-schema.sql` with all necessary tables and RLS policies

## 🔧 Setup Instructions

### 1. Get Your Supabase Service Role Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **service_role** key (keep this secure!)
5. Add it to your `.env` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Create Database Tables

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all tables and policies

### 3. Configure Environment Variables

Make sure your `.env` file contains:

```env
# Client-side (VITE_ prefix for client access)
VITE_SUPABASE_URL=https://dubqlbhbthqwaqojcbwe.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Server-side
SUPABASE_URL=https://dubqlbhbthqwaqojcbwe.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Test the Integration

Run the test script to verify your connection:

```bash
node test-supabase-connection.js
```

## 🔄 Migration from Custom Auth to Supabase

### Before (Custom JWT):
- Custom JWT tokens stored in localStorage
- Manual password hashing with bcrypt
- Custom user registration/login endpoints
- Manual session management

### After (Supabase Auth):
- Supabase handles authentication automatically
- JWT tokens managed by Supabase
- Built-in security features (rate limiting, etc.)
- Automatic session refresh
- Row Level Security (RLS) policies

## 🔐 Security Features

The integration includes:

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Token Validation**: Server validates Supabase tokens
- **Automatic Session Management**: Client handles token refresh
- **Secure API Routes**: All protected routes require valid authentication

## 📋 API Changes

### Authentication Endpoints (Removed)
- `POST /api/auth/register` - Use Supabase Auth UI or direct API calls
- `POST /api/auth/login` - Use Supabase Auth UI or direct API calls

### Data Endpoints (Updated)
- `GET/POST /api/migrant/profile` - Now uses Supabase RLS
- `GET/POST /api/health/records` - Now uses Supabase RLS
- `GET/POST /api/vaccinations` - Now uses Supabase RLS
- `GET /api/alerts` - Now uses Supabase RLS
- `POST /api/symptoms/check` - Now uses Supabase RLS

## 🧪 Testing the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Registration**:
   - Go to `/register`
   - Create a new account
   - Check that user appears in Supabase Auth dashboard

3. **Test Login**:
   - Go to `/login`
   - Login with created credentials
   - Verify session persists across browser refresh

4. **Test Protected Routes**:
   - Try accessing `/dashboard` without login (should redirect)
   - Login and verify access to protected features

## 🚀 Next Steps

1. **Update your application code** to use the new authentication system
2. **Implement Supabase Auth UI components** for better user experience
3. **Set up email templates** in Supabase for password reset
4. **Configure social logins** if needed (Google, GitHub, etc.)
5. **Set up database backups** and monitoring in Supabase dashboard

## 🔧 Troubleshooting

### Common Issues:

1. **"Access token required"**: Check if user is properly authenticated
2. **"Invalid token"**: Verify service role key is correct
3. **"Profile not found"**: Run the SQL schema to create tables
4. **RLS blocking access**: Check RLS policies in Supabase dashboard

### Debug Mode:
Add this to your `.env` for verbose logging:
```env
DEBUG=supabase:*
```

## 📞 Support

For issues related to:
- **Supabase Setup**: Check [Supabase Documentation](https://supabase.com/docs)
- **Authentication**: Review [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- **Database**: Check [PostgREST/RPC Docs](https://supabase.com/docs/guides/database)

---

**Integration Status**: ✅ Ready for testing with proper service role key configuration