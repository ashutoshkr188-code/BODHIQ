# BODHIQ — Minimalist Luxury Timepieces
> **Ancient Craft Meets Modern Precision.**
> A full-stack luxury e-commerce platform and Content Management System (CMS) engineered with Next.js 15 (App Router), FastAPI (Python), and SQLite/PostgreSQL.

---

## ── Platform Features ─────────────────────────────────────────────────────────

*   **Homepage Media Loop Engine**: Full-bleed hero banner supporting custom, mixed image and video loops, managed dynamically directly from the admin dashboard.
*   **Fully Integrated CMS Dashboard**: Custom admin panels to update navigation links, site logos, hero text/descriptions, brand philosophy, and promo banners.
*   **Dynamic Layout Control**: Support for blank fields and dynamic section hiding, allowing administrators to toggle homepage sections on or off instantly by clearing CMS inputs.
*   **Premium Product Catalog Manager**: Complete CRUD interface supporting detailed watch specifications (case size, dial color, glass type, movement) and multi-image gallery uploads.
*   **Seamless Checkout & Payments**: Persisted cart architecture integrated with a secure Razorpay payment gateway, shipping address managers, and automated PDF invoice generation.
*   **Robust Security & Auth**: Double-layer authorization utilizing Clerk JWT token signature verification on the FastAPI backend and role-based access control (admin vs. customer).
*   **Production-Ready Containerization**: Fully dockerized multi-container setup (Nginx reverse proxy + Next.js frontend + FastAPI backend) optimized with security headers and rate-limiting.
*   **Automated CI/CD**: Pre-configured GitHub Actions deployment pipeline to build, push to AWS ECR, and deploy to AWS EC2 in a single push.

---

## ── Architecture Overview ────────────────────────────────────────────────────

```
                             [ Public Internet ]
                                      │
                                      ▼
                        Application Load Balancer (ALB)
                                      │
                                      ▼
                             [ AWS EC2 Instance ]
                       ┌──────────────────────────────┐
                       │      Nginx Reverse Proxy     │
                       │           (Port 80)          │
                       └──────────────┬───────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
      [ Next.js Frontend ]                            [ FastAPI Backend ]
       (Port 3000 Internal)                          (Port 8000 Internal)
              │                                               │
              │                                      ┌────────┴────────┐
              ▼                                      ▼                 ▼
     [ Clerk Identity ]                     [ AWS RDS PostgreSQL ]  [ AWS EFS ]
      (User & Auth API)                     (Database Persistence) (Uploads Mount)
```

---

## ── Quick Start (Local Development) ───────────────────────────────────────────

The project is fully automated and can be run locally in two ways:

### Method A: Local Processes (Fastest Dev Reloads)
Simply double-click or run the automated runner batch file in the project root:
```bash
./run_locally.bat
```
This script will:
1. Detect your local environment.
2. Initialize and activate a Python virtual environment in `backend/`, installing all required libraries.
3. Launch the FastAPI Uvicorn backend server on `http://localhost:8000`.
4. Install all npm packages in `frontend/` and start the Next.js development server on `http://localhost:3000`.
5. Launch a minimized background monitor to open your browser once the servers are live.

### Method B: Local Docker Compose (Container Verification)
To test the entire multi-container stack locally under Nginx:
```bash
docker compose up --build
```
Access the application at `http://localhost`.

---

## ── Production Deployment (AWS EC2 + RDS) ─────────────────────────────────────

For detailed deployment instructions, including AWS EC2 provisioning, RDS PostgreSQL database setup, SSL/HTTPS configuration via ALB, and environment variables, please refer to the comprehensive guide:
👉 **[AWS_DEPLOY.md](AWS_DEPLOY.md)**

---

## ── Automated CI/CD Deployment Pipeline ───────────────────────────────────────

A pre-configured GitHub Actions pipeline is located at `.github/workflows/deploy.yml`. 

To activate automated zero-downtime deployments:
1. Push this codebase to your GitHub repository.
2. Go to your GitHub Repository → **Settings** → **Secrets and variables** → **Actions**.
3. Add the following secrets:
    *   `AWS_ACCESS_KEY_ID`: Your AWS access key.
    *   `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
    *   `AWS_REGION`: `ap-south-1` (Mumbai).
    *   `EC2_HOST`: The Elastic IP of your EC2 instance.
    *   `EC2_USER`: `ubuntu`
    *   `EC2_SSH_KEY`: The contents of your private key file (`bodhiq-key.pem`).
    *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your production Clerk key.

Now, every `git push origin main` will automatically build the production containers, push them to AWS ECR, and update the services on your EC2 server securely.