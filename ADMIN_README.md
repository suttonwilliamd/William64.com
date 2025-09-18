# Admin System Documentation

## Overview

The admin system provides a complete blog management interface with authentication, post creation, editing, and deletion capabilities.

## Features

- **Authentication**: JWT-based login system
- **Post Management**: Create, read, update, and delete blog posts
- **Modern UI**: Clean, responsive interface matching the site's terminal theme
- **Real-time Updates**: Changes are immediately reflected in the blog
- **Markdown Support**: Full Markdown editing with live preview

## Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# Optional: Override default values
SITE_URL=https://william64.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Access the Admin Panel

1. Navigate to `/admin` to see the admin panel selection
2. Choose "Modern Admin Dashboard" for the new interface
3. Login with your credentials

## Usage

### Creating a New Post

1. Click "New Post" in the dashboard
2. Fill in the required fields:
   - **Title**: The post title (used to generate URL slug)
   - **Summary**: Brief description for the blog listing
   - **Publish Date**: When the post should be published
   - **Content**: Markdown content for the post body
3. Click "Save Post"

### Editing a Post

1. Find the post in the dashboard table
2. Click "Edit" next to the post
3. Modify the fields as needed
4. Click "Save Post"

### Deleting a Post

1. Find the post in the dashboard table
2. Click "Delete" next to the post
3. Confirm the deletion in the modal

## API Endpoints

### Authentication
- `POST /api/admin/login` - Login with username/password

### Posts
- `GET /api/admin/posts` - List all posts
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/posts/[id]` - Get specific post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

## Security

- JWT tokens expire after 24 hours
- All admin endpoints require authentication
- Passwords should be strong and unique
- JWT secret should be cryptographically secure

## File Structure

```
src/pages/
├── admin/
│   ├── login.astro          # Login page
│   ├── dashboard.astro      # Main admin dashboard
│   └── admin.astro          # Admin panel selection
├── api/admin/
│   ├── login.js             # Authentication endpoint
│   └── posts/
│       ├── index.js         # Posts CRUD endpoints
│       └── [id].js          # Individual post endpoints
└── posts/                   # MDX blog posts
```

## Legacy CMS

The original Decap CMS is still available at `/admin/config.yml` for users who prefer the Git-based workflow.

## Troubleshooting

### Login Issues
- Verify environment variables are set correctly
- Check that JWT_SECRET is properly configured
- Ensure username/password match the environment variables

### Post Creation Issues
- Verify all required fields are filled
- Check that the title doesn't conflict with existing posts
- Ensure the posts directory has write permissions

### API Errors
- Check browser console for detailed error messages
- Verify JWT token hasn't expired
- Ensure all required fields are provided