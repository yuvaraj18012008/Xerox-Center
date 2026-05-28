# Deployment Guide

## Cloud Deployment Options

### Option 1: Heroku (Easiest)

#### Prerequisites
- Heroku CLI installed
- Git installed
- Heroku account

#### Steps

1. **Create Heroku apps**
```bash
heroku create xerox-center-api
heroku create xerox-center-frontend
```

2. **Set environment variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_uri -a xerox-center-api
heroku config:set JWT_SECRET=your_secret_key -a xerox-center-api
heroku config:set NODE_ENV=production -a xerox-center-api
```

3. **Push to Heroku**
```bash
# Backend
cd backend
git push heroku main

# Frontend (from frontend directory, add this buildpack first)
heroku buildpacks:add mars/create-react-app
cd ../frontend
git push heroku main
```

---

### Option 2: AWS (Production-Grade)

#### EC2 Deployment

1. **Create EC2 instance**
   - Ubuntu 20.04 LTS, t2.micro (free tier)
   - Security group: Allow 80, 443, 22

2. **SSH into instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install dependencies**
```bash
sudo apt update
sudo apt install nodejs npm mongodb git docker.io docker-compose

# Start MongoDB
sudo systemctl start mongod
```

4. **Clone and deploy**
```bash
git clone your-repo
cd xerox-center-website
docker-compose up -d
```

5. **Setup Nginx reverse proxy**
```bash
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location / {
        proxy_pass http://frontend;
    }
}
```

```bash
sudo systemctl restart nginx
```

#### RDS for MongoDB Atlas

Use MongoDB Atlas for managed database:
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update environment variables

#### S3 for File Storage

```bash
# Install AWS SDK
npm install aws-sdk

# Create IAM user with S3 access
# Add credentials to .env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket_name
```

---

### Option 3: DigitalOcean

#### App Platform (Easiest)

1. Connect GitHub repository
2. Create two apps:
   - Backend app (Node.js)
   - Frontend app (React)

3. Set environment variables in dashboard
4. Deploy

#### Droplet (More Control)

Similar to AWS EC2, use Docker Compose for deployment.

---

### Option 4: Google Cloud Platform

#### Cloud Run Deployment

1. **Build Docker images**
```bash
docker build -t gcr.io/your-project/xerox-backend ./backend
docker build -t gcr.io/your-project/xerox-frontend ./frontend

docker push gcr.io/your-project/xerox-backend
docker push gcr.io/your-project/xerox-frontend
```

2. **Deploy to Cloud Run**
```bash
gcloud run deploy xerox-backend --image gcr.io/your-project/xerox-backend --platform managed
gcloud run deploy xerox-frontend --image gcr.io/your-project/xerox-frontend --platform managed
```

3. **Setup Cloud Firestore/MongoDB Atlas** for database

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx

sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Update Nginx Config
```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Database Backup

### MongoDB Atlas
- Automated backups are included
- Configure backup frequency and retention

### Manual Backup
```bash
# Backup
mongodump --uri mongodb://user:pass@host:27017/xerox_db --out ./backup

# Restore
mongorestore --uri mongodb://user:pass@host:27017 ./backup/xerox_db
```

---

## Performance Optimization

### Frontend
- Minify assets
- Use CDN for static files
- Enable gzip compression

### Backend
- Use caching (Redis)
- Database indexing
- API rate limiting

### Infrastructure
- Use load balancer
- Auto-scaling
- Content delivery network (CDN)

---

## Monitoring & Logging

### Application Monitoring
- Use monitoring tools (New Relic, Datadog)
- Setup alerts for errors

### Logging
```bash
# Using PM2 for process management
npm install -g pm2

pm2 start src/server.js
pm2 logs
pm2 monit
```

### Environment Variables for Production
```
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info
```

---

## Maintenance

### Regular Updates
```bash
npm update
npm audit fix
```

### Health Checks
```bash
# Monitor endpoint
GET /api/health
```

### Database Optimization
```bash
# MongoDB maintenance
db.collection.reIndex()
db.collection.stats()
```

---

## Security Checklist

- ✅ Enable HTTPS/SSL
- ✅ Use environment variables for secrets
- ✅ Enable CORS properly
- ✅ Setup firewall rules
- ✅ Use strong JWT secrets
- ✅ Enable database authentication
- ✅ Regular security updates
- ✅ Backup strategy in place
- ✅ Monitor for suspicious activity
- ✅ Rate limiting enabled

---

## Troubleshooting

### Cannot connect to database
- Check connection string
- Verify IP whitelist (MongoDB Atlas)
- Check firewall rules

### CORS errors
- Verify CORS_ORIGIN in .env
- Check frontend domain

### High memory usage
- Check Node.js heap size
- Optimize database queries
- Clear cache regularly

### Deployment errors
- Check logs (pm2 logs, docker logs)
- Verify all environment variables
- Test locally first
