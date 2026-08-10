# Alpha Edu Hub - cPanel Deployment Guide

This guide explains how to deploy the Alpha Edu Hub application on cPanel hosting without Docker.

## Overview

- **Application Type**: Next.js 14.2.5 (Full-stack application)
- **Database**: PostgreSQL (via Prisma ORM)
- **Node.js Version**: >= 18.0.0
- **Authentication**: JWT-based with httpOnly cookies
- **File Storage**: Cloudinary (optional, for image uploads)

## Prerequisites

### Required cPanel Features

1. **Node.js Support** - cPanel must support Node.js application deployment
2. **PostgreSQL Database** - cPanel must provide PostgreSQL database access
3. **SSH Access** - Recommended for running database migrations
4. **Git** - For cloning the repository

### Required Node.js Version

- **Minimum**: Node.js 18.0.0
- **Recommended**: Node.js 18.x or 20.x LTS

Check your cPanel Node.js version in "Setup Node.js App" or contact your hosting provider.

## Database Setup

### 1. Create PostgreSQL Database

In cPanel:
1. Go to "PostgreSQL Databases"
2. Create a new database:
   - **Database Name**: `alpha_edu_hub` (or your preferred name)
   - **Character Set**: UTF8
3. Create a database user:
   - **Username**: `alpha_edu_user` (or your preferred name)
   - **Password**: Generate a strong password
4. Add the user to the database with all privileges

### 2. Note Database Credentials

You'll need these for the environment variables:
- **Database Host**: Usually `localhost`
- **Database Port**: Usually `5432`
- **Database Name**: The name you created
- **Database User**: The user you created
- **Database Password**: The password you generated

### 3. Database URL Format

Your `DATABASE_URL` will be:
```
postgresql://db_user:db_password@localhost:5432/db_name
```

## Application Setup

### 1. Clone the Repository

```bash
cd ~/your-domain-folder
git clone https://github.com/your-username/alpha-edu-hub.git
cd alpha-edu-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create the `.env` file using the provided template:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
# Database (replace with your cPanel PostgreSQL credentials)
DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/your_db_name"

# JWT Secrets (generate secure random strings)
JWT_ACCESS_SECRET=your_generated_access_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret

# Cloudinary (optional - for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Production mode
NODE_ENV=production
```

**Important**: The `.env` file is used locally for running migrations and building. In cPanel, you'll also set these same environment variables in the Node.js application interface.

**Generate JWT Secrets:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

This will apply all database migrations to your cPanel PostgreSQL database.

### 5. Seed Initial Data (Optional)

If you need initial data:

```bash
npx prisma db seed
```

### 6. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### 7. Create Custom Server for cPanel

cPanel requires a JavaScript file as the startup file. Create a simple `server.js` in your project root:

```bash
cat > server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
EOF
```

This server:
- Respects the PORT environment variable set by cPanel
- Uses the production build
- Handles all Next.js routes properly

## cPanel Node.js Application Setup

### 1. Create Node.js Application

In cPanel:
1. Go to "Setup Node.js App"
2. Click "Create Application"
3. Configure the application:

**Application Settings:**
- **Node.js Version**: 18.x (or latest available >= 18.0.0)
- **Application Mode**: Production
- **Application Root**: `/home/your_username/your_domain/alpha-edu-hub`
- **Application URL**: `your-domain.com` (or `subdomain.your-domain.com`)
- **Application Startup File**: `server.js` (see step 6 below)
- **Environment Variables**: Add the same variables from your `.env` file

### 2. Configure Environment Variables in cPanel

In the Node.js application setup, add these environment variables:

```
NODE_ENV=production
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name
JWT_ACCESS_SECRET=your_generated_access_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### 3. Restart the Application

After configuration, click "Restart" in the Node.js application interface.

## Domain Configuration

### 1. Point Domain to Application

If using a subdomain:
1. Go to "Subdomains" in cPanel
2. Create subdomain pointing to the application root

If using main domain:
1. Ensure the domain's document root matches the application root

### 2. SSL/HTTPS Configuration

1. Go to "SSL/TLS Status" in cPanel
2. Enable SSL for your domain (Let's Encrypt is usually free)
3. Force HTTPS redirect in your application (already configured in `next.config.mjs`)

## File Permissions

Ensure proper file permissions:

```bash
# Set appropriate permissions
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 600 .env
```

## Cloudinary Configuration (Optional)

If you want to enable image uploads:

1. Sign up at [Cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name from dashboard
3. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in environment variables
4. Configure upload preset in Cloudinary dashboard (unsigned upload for simplicity)

## Troubleshooting

### Application Won't Start

**Check Node.js Version:**
```bash
node --version
```
Ensure it's >= 18.0.0

**Check Application Logs:**
In cPanel Node.js app setup, click "View Error Log"

**Common Issues:**
- Missing dependencies: Run `npm install` again
- Port conflicts: cPanel handles this automatically
- Database connection: Verify DATABASE_URL format

### Database Connection Issues

**Test Database Connection:**
```bash
npx prisma db pull
```

**Common Issues:**
- Wrong database credentials in DATABASE_URL
- Database user doesn't have proper privileges
- PostgreSQL service not running (contact hosting)

### Build Errors

**Clear Build Cache:**
```bash
rm -rf .next
npm run build
```

**Check Node Version:**
Ensure package.json engines requirements are met

### Authentication Issues

**Verify JWT Secrets:**
- Ensure JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are set
- Regenerate secrets if authentication fails

**Check Database:**
- Ensure users exist in the database
- Run seed script if needed: `npx prisma db seed`

### Static Assets Not Loading

**Check Next.js Configuration:**
- Ensure images remote patterns are correct in `next.config.mjs`
- Verify static files are in `public/` folder

## Maintenance

### Update Application

```bash
cd ~/your-domain-folder/alpha-edu-hub
git pull origin main
npm install
npm run build
# Restart application in cPanel
```

### Database Backup

Use cPanel's backup tools or:
```bash
pg_dump your_db_name > backup.sql
```

### Log Rotation

Check application logs regularly in cPanel Node.js app interface.

## Security Recommendations

1. **Strong Passwords**: Use strong database passwords and JWT secrets
2. **HTTPS**: Always use SSL in production
3. **Environment Variables**: Never commit `.env` files
4. **Regular Updates**: Keep dependencies updated
5. **Database Backups**: Regular automated backups
6. **Firewall**: Configure cPanel firewall if available

## Performance Optimization

1. **Enable Caching**: Next.js has built-in caching
2. **Database Indexing**: Ensure proper indexes (handled by Prisma)
3. **Image Optimization**: Use Cloudinary for images
4. **CDN**: Consider CDN for static assets

## Support

For issues specific to:
- **cPanel**: Contact your hosting provider
- **Application**: Check GitHub issues or application documentation
- **Database**: PostgreSQL documentation

## Deployment Checklist

- [ ] PostgreSQL database created
- [ ] Database user created with privileges
- [ ] Repository cloned to server
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Application built (`npm run build`)
- [ ] Node.js application created in cPanel
- [ ] Environment variables set in cPanel
- [ ] Application started successfully
- [ ] SSL/HTTPS enabled
- [ ] Domain pointing correctly
- [ ] Authentication tested
- [ ] File uploads tested (if using Cloudinary)
- [ ] Database backups configured

## Post-Deployment Testing

1. **Access Application**: Open your domain in browser
2. **Test Login**: Create a user and test authentication
3. **Test Features**: Test key features (dashboard, user management, etc.)
4. **Test Uploads**: Test file uploads if Cloudinary configured
5. **Check Logs**: Review application logs for errors
6. **Performance**: Test application performance

## Notes

- The application uses Next.js API routes for backend functionality
- A custom `server.js` is required for cPanel deployment (created in step 7)
- Database migrations are required after deployment
- The custom server respects the PORT set by cPanel automatically
- Environment variables must be set in both `.env` (for local operations like migrations) and cPanel Node.js app settings (for runtime)
- No additional Redis, WebSockets, cron, or worker services are required
- Prisma Client is generated automatically during `npm install` and `npx prisma generate`