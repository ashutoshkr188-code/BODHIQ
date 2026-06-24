# AWS_DEPLOY.md — BODHIQ AWS Deployment Guide

> **Architecture:** EC2 (Docker Compose) + RDS PostgreSQL + EFS + ALB + ACM + Route53 + ECR
> **Region:** ap-south-1 (Mumbai) — closest to India
> **Estimated Cost:** ~$50/month (t3.small EC2 + db.t3.micro RDS)

---

## Architecture Overview

```
Internet
    │
    ▼
Route 53 (bodhiq.in)
    │
    ▼
AWS Certificate Manager (HTTPS/SSL)
    │
    ▼
Application Load Balancer (ALB)
    │
    ▼
EC2 Instance (t3.small)
├── Docker: Nginx (port 80)
│       ├── /api/v1/*  → FastAPI (port 8000)
│       └── /*         → Next.js (port 3000)
├── Docker: FastAPI backend
└── Docker: Next.js frontend
    │
    ├── RDS PostgreSQL (db.t3.micro) — private subnet
    └── EFS — for /uploads persistence across deploys
```

---

## STEP 1 — Create ECR Repositories

```bash
aws ecr create-repository --repository-name bodhiq-backend  --region ap-south-1
aws ecr create-repository --repository-name bodhiq-frontend --region ap-south-1
aws ecr create-repository --repository-name bodhiq-nginx    --region ap-south-1
# Note your registry: 123456789012.dkr.ecr.ap-south-1.amazonaws.com
```

---

## STEP 2 — Create RDS PostgreSQL

1. RDS → Create database → PostgreSQL 15 → db.t3.micro
2. DB name: `bodhiq-db`, User: `bodhiq`, Password: `<STRONG>`
3. VPC: same as EC2 | Public access: **NO**
4. Your DATABASE_URL:
   ```
   postgresql+psycopg2://bodhiq:PASS@bodhiq-db.xxxx.ap-south-1.rds.amazonaws.com:5432/bodhiq
   ```

---

## STEP 3 — Launch EC2 Instance

1. AMI: **Ubuntu 24.04 LTS** | Type: **t3.small**
2. Key pair: `bodhiq-key.pem` — **save this**
3. Security group `bodhiq-ec2-sg`:
   ```
   Inbound:  HTTP 80 → from ALB SG only
             SSH  22 → YOUR_IP/32 only
   Outbound: All → 0.0.0.0/0
   ```
4. Storage: **20 GB gp3** | Assign **Elastic IP**

---

## STEP 4 — Setup EC2

```bash
ssh -i bodhiq-key.pem ubuntu@YOUR_EC2_IP

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu && newgrp docker
sudo apt-get install -y docker-compose-plugin awscli git

# Configure AWS
aws configure  # enter keys, region: ap-south-1

# Clone repo
git clone https://github.com/YOUR_USERNAME/bodhiq.git
cd bodhiq

# Set production env vars
cp .env.production.example .env.production
nano .env.production   # Fill all values
```

---

## STEP 5 — First Deployment

```bash
# Authenticate Docker with ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.ap-south-1.amazonaws.com

# Build & push from your LOCAL machine:
REGISTRY=123456789012.dkr.ecr.ap-south-1.amazonaws.com

docker build -t $REGISTRY/bodhiq-backend:latest ./backend
docker push $REGISTRY/bodhiq-backend:latest

docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://www.bodhiq.in \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx \
  -t $REGISTRY/bodhiq-frontend:latest ./frontend
docker push $REGISTRY/bodhiq-frontend:latest

docker build -t $REGISTRY/bodhiq-nginx:latest ./nginx
docker push $REGISTRY/bodhiq-nginx:latest

# On EC2 — start services (the backend container automatically initializes the RDS database and seeds initial data on startup!)
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

---

## STEP 6 — ALB + HTTPS

1. **ACM:** Request cert for `*.bodhiq.in` + `bodhiq.in` (DNS validation)
2. **ALB:** Create Application Load Balancer
   - Listeners: HTTP:80 and HTTPS:443
   - Target group: EC2 instance, port 80, health check `GET /health`
   - HTTP:80 → Redirect to HTTPS:443
3. **Security group for ALB:**
   ```
   Inbound:  HTTP 80 → 0.0.0.0/0 | HTTPS 443 → 0.0.0.0/0
   Outbound: HTTP 80 → bodhiq-ec2-sg
   ```

---

## STEP 7 — Route 53 DNS

1. Route 53 → Hosted Zone for `bodhiq.in`
2. Create A records (Alias → ALB):
   ```
   bodhiq.in     → ALB DNS (Alias)
   www.bodhiq.in → ALB DNS (Alias)
   ```
3. Point domain nameservers → Route 53 NS records

---

## STEP 8 — GitHub Actions CI/CD

Add Secrets in GitHub → Settings → Secrets → Actions:
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION = ap-south-1
ECR_REGISTRY = 123456789012.dkr.ecr.ap-south-1.amazonaws.com
EC2_HOST = YOUR_ELASTIC_IP
EC2_USER = ubuntu
EC2_SSH_KEY = (contents of bodhiq-key.pem)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

Now every `git push` to `main` auto-deploys.

---

## STEP 9 — CloudWatch Logs

```bash
# Create log groups (logs are sent via awslogs driver in docker-compose.prod.yml)
aws logs create-log-group --log-group-name /ecs/bodhiq-backend  --region ap-south-1
aws logs create-log-group --log-group-name /ecs/bodhiq-frontend --region ap-south-1
aws logs create-log-group --log-group-name /ecs/bodhiq-nginx    --region ap-south-1
```

---

## Useful Commands on EC2

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart service
docker compose -f docker-compose.prod.yml restart backend

# Database auto-initialization
# The backend container automatically runs 'init_db()' and 'seed_if_empty()' on startup,
# so manual migrations/seeding are not required for a fresh RDS deployment.

# Open shell
docker compose -f docker-compose.prod.yml exec backend bash

# Cleanup old images
docker system prune -f
```

---

## Cost Estimate (ap-south-1 Mumbai)

| Service | Spec | Cost/Month |
|---------|------|-----------|
| EC2 t3.small | 2 vCPU, 2GB RAM | ~$15 |
| RDS db.t3.micro | PostgreSQL 15 | ~$15 |
| ALB | Per-hour + LCU | ~$18 |
| EFS | ~1GB uploads | ~$0.30 |
| ECR | 3 repos | ~$0.10 |
| Route 53 | 1 hosted zone | ~$0.50 |
| Data Transfer | Moderate | ~$3 |
| **Total** | | **~$52/month** |

---

## Security Checklist

- [ ] `.env.production` on EC2 only — never in git
- [ ] EC2 SSH restricted to your IP only
- [ ] RDS in private subnet (no public access)
- [ ] EC2 HTTP only from ALB (not public internet)
- [ ] Non-root Docker users (bodhiq user in Dockerfiles)
- [ ] FastAPI /docs blocked in Nginx
- [ ] Rate limiting on API/notify/upload
- [ ] HTTPS enforced via ALB redirect
- [ ] Security headers via Next.js config
