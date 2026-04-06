#  Hospital Management System — Backend API

A production-grade, fully-featured Hospital Management System backend built with modern TypeScript patterns and a clean layered architecture.

##  Features

| Category | Details |
|---|---|
| **Authentication** | JWT (access + refresh tokens), bcrypt password hashing, refresh token rotation, Redis-backed token blacklisting |
| **Two-Factor Auth** | TOTP (Time-based OTP) via `otplib` with QR code generation |
| **Authorization** | Role-Based Access Control (RBAC) — `USER`, `DOCTOR`, `ADMIN` |
| **Payment Gateway** | Razorpay integration — order creation, signature verification, webhook handling, refund support |
| **File Upload** | Multer (memory storage) → Cloudinary upload pipeline with file type/size validation |
| **Email** | Nodemailer SMTP — welcome emails, appointment confirmations, payment receipts, password resets |
| **Rate Limiting** | `express-rate-limit` with configurable presets (global, auth, heavy operations) |
| **Caching/Store** | Redis via `ioredis` — JWT blacklist, refresh token store |
| **Validation** | Zod schema validation on body, query, and params |
| **Logging** | Winston with daily file rotation, colored console output, structured JSON for production |
| **Error Handling** | Custom `AppError` hierarchy with Zod + Multer error normalization |
| **API Versioning** | Routes namespaced under `/api/v1` |
| **Security** | Helmet, CORS, cookie-parser, compression |
| **Audit Logging** | Every mutation is logged with actor, action, entity, and details |
| **Notifications** | In-app notification system with email follow-up |
| **Database** | PostgreSQL with Prisma ORM (12 models, 6 enums) |
| **Seeder** | Full database seeder with departments, doctors, patients, appointments |
| **Testing** | Vitest unit tests for middlewares, utilities, and constants |

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma          # 12 models, 6 enums
│   └── seed.ts                # Database seeder
├── src/
│   ├── config/                # All configuration
│   │   ├── serverConfig.ts    # Environment variables
│   │   ├── databaseConfig.ts  # Prisma client + bcrypt extension
│   │   ├── loggerConfig.ts    # Winston logger
│   │   ├── redisConfig.ts     # ioredis client
│   │   ├── cloudinaryConfig.ts
│   │   ├── razorpayConfig.ts
│   │   ├── emailConfig.ts     # Nodemailer transporter
│   │   └── rateLimiterConfig.ts
│   ├── controllers/           # Request/response handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── patientController.ts
│   │   ├── doctorController.ts
│   │   ├── appointmentController.ts
│   │   ├── prescriptionController.ts
│   │   ├── paymentController.ts
│   │   ├── departmentController.ts
│   │   └── medicalRecordController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # JWT verification
│   │   ├── rbacMiddleware.ts      # Role-based access control
│   │   ├── validateMiddleware.ts  # Zod schema validation
│   │   ├── uploadMiddleware.ts    # Multer file upload
│   │   ├── rateLimitMiddleware.ts
│   │   └── errorHandlerMiddleware.ts
│   ├── repositories/         # Data access layer
│   │   ├── baseRepository.ts # Generic CRUD + pagination
│   │   ├── userRepository.ts
│   │   ├── patientRepository.ts
│   │   ├── doctorRepository.ts
│   │   ├── appointmentRepository.ts
│   │   ├── prescriptionRepository.ts
│   │   ├── paymentRepository.ts
│   │   ├── departmentRepository.ts
│   │   ├── medicalRecordRepository.ts
│   │   ├── doctorScheduleRepository.ts
│   │   ├── notificationRepository.ts
│   │   └── auditLogRepository.ts
│   ├── routes/v1/            # API routes (versioned)
│   │   ├── index.ts          # Route aggregator
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── patientRoutes.ts
│   │   ├── doctorRoutes.ts
│   │   ├── appointmentRoutes.ts
│   │   ├── prescriptionRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   ├── departmentRoutes.ts
│   │   └── medicalRecordRoutes.ts
│   ├── services/             # Business logic
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── patientService.ts
│   │   ├── doctorService.ts
│   │   ├── appointmentService.ts
│   │   ├── prescriptionService.ts
│   │   ├── paymentService.ts
│   │   ├── departmentService.ts
│   │   ├── medicalRecordService.ts
│   │   └── notificationService.ts
│   ├── types/
│   │   ├── express.d.ts      # Request augmentation
│   │   └── index.ts          # Shared interfaces
│   ├── utils/
│   │   ├── common/
│   │   │   ├── asyncHandler.ts
│   │   │   ├── constants.ts   # Status codes, roles, limits
│   │   │   ├── pagination.ts
│   │   │   └── response.ts    # sendSuccess / sendError
│   │   ├── errors/
│   │   │   └── error.ts       # AppError hierarchy (7 classes)
│   │   └── helpers/
│   │       ├── jwt.ts         # Token gen/verify/blacklist
│   │       ├── totp.ts        # TOTP 2FA helpers
│   │       ├── email.ts       # Email templates
│   │       └── cloudinary.ts  # File upload/delete
│   ├── validators/           # Zod schemas
│   │   ├── commonValidator.ts
│   │   ├── authValidator.ts
│   │   ├── userValidator.ts
│   │   ├── patientValidator.ts
│   │   ├── doctorValidator.ts
│   │   ├── appointmentValidator.ts
│   │   ├── prescriptionValidator.ts
│   │   ├── paymentValidator.ts
│   │   ├── departmentValidator.ts
│   │   └── medicalRecordValidator.ts
│   ├── app.ts                # Express app factory
│   └── index.ts              # Server bootstrap
├── tests/
│   └── unit/
│       ├── middlewares/
│       │   ├── rbac.test.ts
│       │   └── validate.test.ts
│       └── utils/
│           ├── errors.test.ts
│           ├── pagination.test.ts
│           └── constants.test.ts
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

##  Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **Redis** ≥ 6

### 1. Clone & Install

```bash
git clone <repo-url>
cd hospitalManagementAnti
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npm run seed
```

### 4. Start the Server

```bash
# Development (with hot-reload)
npm run dev:watch

# Development (single run)
npm run dev

# Production
npm run build
npm start
```

### 5. Verify

```bash
curl http://localhost:3000/health
```

---

## Default Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hospital.com` | `Admin@123456` |
| Doctor | `priya.sharma@hospital.com` | `Doctor@123456` |
| Doctor | `rajesh.gupta@hospital.com` | `Doctor@123456` |
| Patient | `amit.kumar@example.com` | `Patient@123456` |
| Patient | `sneha.reddy@example.com` | `Patient@123456` |

---

## API Reference

Base URL: `http://localhost:3000/api/v1`

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login (supports TOTP) |
| POST | `/auth/logout` | ✅ | Logout (blacklists token) |
| POST | `/auth/refresh-token` | ❌ | Refresh access token |
| POST | `/auth/change-password` | ✅ | Change password |
| POST | `/auth/totp/enable` | ✅ | Enable 2FA (returns QR code) |
| POST | `/auth/totp/verify` | ✅ | Verify & activate TOTP |
| POST | `/auth/totp/disable` | ✅ | Disable 2FA |

### Users (`/users`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/me` | ✅ | Any | Get own profile |
| PATCH | `/users/me` | ✅ | Any | Update own profile |
| PATCH | `/users/me/avatar` | ✅ | Any | Upload avatar |
| GET | `/users` | ✅ | ADMIN | List all users |
| PATCH | `/users/:id/role` | ✅ | ADMIN | Change user role |
| PATCH | `/users/:id/status` | ✅ | ADMIN | Activate/deactivate user |

### Patients (`/patients`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/patients` | ✅ | Any | Create patient profile |
| GET | `/patients/me` | ✅ | Any | Get own patient profile |
| GET | `/patients/:id` | ✅ | Any | Get patient by ID |
| PATCH | `/patients/:id` | ✅ | Owner/ADMIN | Update patient |
| GET | `/patients` | ✅ | ADMIN/DOCTOR | List all patients |
| DELETE | `/patients/:id` | ✅ | ADMIN | Delete patient |

### Doctors (`/doctors`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/doctors/available` | ❌ | — | Get available doctors |
| GET | `/doctors/search` | ❌ | — | Search by specialization |
| GET | `/doctors` | ✅ | Any | List all doctors |
| GET | `/doctors/:id` | ✅ | Any | Get doctor details |
| POST | `/doctors` | ✅ | ADMIN | Create doctor profile |
| PATCH | `/doctors/:id` | ✅ | ADMIN/DOCTOR | Update doctor |
| DELETE | `/doctors/:id` | ✅ | ADMIN | Delete doctor |
| POST | `/doctors/:id/schedules` | ✅ | DOCTOR | Add schedule |
| GET | `/doctors/:id/schedules` | ✅ | Any | Get doctor schedules |
| PATCH | `/doctors/schedules/:id` | ✅ | DOCTOR | Update schedule |
| DELETE | `/doctors/schedules/:id` | ✅ | DOCTOR | Remove schedule |

### Appointments (`/appointments`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/appointments` | ✅ | Any | Book appointment |
| GET | `/appointments/me` | ✅ | Any | My appointments |
| GET | `/appointments/:id` | ✅ | Any | Get appointment details |
| PATCH | `/appointments/:id/status` | ✅ | ADMIN/DOCTOR | Update status |
| PATCH | `/appointments/:id/reschedule` | ✅ | Any | Reschedule |
| PATCH | `/appointments/:id/cancel` | ✅ | Any | Cancel appointment |
| GET | `/appointments` | ✅ | ADMIN | List all appointments |

### Prescriptions (`/prescriptions`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/prescriptions` | ✅ | DOCTOR | Create prescription |
| GET | `/prescriptions/:id` | ✅ | Any | Get prescription |
| GET | `/prescriptions/appointment/:id` | ✅ | Any | Get by appointment |
| PATCH | `/prescriptions/:id` | ✅ | DOCTOR | Update prescription |
| DELETE | `/prescriptions/:id` | ✅ | DOCTOR | Delete prescription |

### Payments (`/payments`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/payments/webhook` | ❌ | — | Razorpay webhook |
| POST | `/payments/order` | ✅ | Any | Create payment order |
| POST | `/payments/verify` | ✅ | Any | Verify payment |
| GET | `/payments/appointment/:id` | ✅ | Any | Get by appointment |
| GET | `/payments` | ✅ | ADMIN | List all payments |

### Departments (`/departments`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/departments/active` | ❌ | — | Active departments |
| GET | `/departments` | ✅ | Any | List departments |
| GET | `/departments/:id` | ✅ | Any | Get with doctors |
| POST | `/departments` | ✅ | ADMIN | Create department |
| PATCH | `/departments/:id` | ✅ | ADMIN | Update department |
| DELETE | `/departments/:id` | ✅ | ADMIN | Delete department |

### Medical Records (`/medical-records`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/medical-records` | ✅ | ADMIN/DOCTOR | Create (+ file upload) |
| GET | `/medical-records/:id` | ✅ | Any | Get record |
| GET | `/medical-records/patient/:id` | ✅ | Any | Get by patient |
| PATCH | `/medical-records/:id` | ✅ | ADMIN/DOCTOR | Update (+ file) |
| DELETE | `/medical-records/:id` | ✅ | ADMIN | Delete record |
| GET | `/medical-records` | ✅ | ADMIN/DOCTOR | List all |

---

##  Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

##  Environment Variables

See [`.env.example`](.env.example) for the full list. Key ones:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_URL` | Redis connection string | ✅ |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | ✅ |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | For payments |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | For payments |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | For uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | For uploads |
| `SMTP_USER` | SMTP username/email | For emails |
| `SMTP_PASSWORD` | SMTP password/app password | For emails |

---

##  Architecture

```
Request → Rate Limiter → Helmet/CORS/Compression
       → Auth Middleware (JWT) → RBAC Middleware
       → Validation Middleware (Zod) → Controller
       → Service (Business Logic) → Repository (Data Access)
       → Prisma ORM → PostgreSQL
```

**Layer Responsibilities:**
- **Config** — environment variables, external service initialization
- **Middlewares** — cross-cutting concerns (auth, validation, rate limiting, uploads, errors)
- **Validators** — Zod schemas for input validation
- **Controllers** — HTTP request/response handling
- **Services** — business logic, orchestration, audit logging
- **Repositories** — data access via Prisma with error mapping
- **Utils** — shared helpers (JWT, TOTP, email, cloudinary, pagination, errors)

---

##  License

This project is licensed under the MIT License.
