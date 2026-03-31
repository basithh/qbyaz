# QBYAZ - QR-Based Queue Management System

A production-ready MVP for walk-in queue management using QR codes, real-time SSE updates, and optional WhatsApp notifications.

## Features

- **QR Code Sessions**: Admin creates a queue session, generates unique QR code
- **Customer Token System**: Customers scan QR → join queue → get unique token number
- **Real-time Queue**: Live updates via Server-Sent Events (SSE)
- **Admin Dashboard**: Manage queue, call next customer, view queue state
- **Public Display**: TV screen showing now serving + upcoming tokens
- **WhatsApp Ready**: Modular notification system (plug-in your Twilio/WhatsApp Business API)
- **Mobile-first UI**: Glassmorphism design with Framer Motion animations
- **Scalable Architecture**: Clean separation of concerns, easily deployable

## Tech Stack

### Backend
- **Java 21** + **Spring Boot 3.4** (Maven)
- **H2** (dev) / **PostgreSQL** (prod)
- **Spring Data JPA** + **Hibernate**
- **Server-Sent Events (SSE)** for real-time
- **ZXing** for QR code generation

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v4** + glassmorphism
- **Framer Motion** for micro-animations
- **React Router** for navigation
- **Lucide React** for icons

## Local Development

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.9+
- npm 10+

### Setup

```bash
# Backend (Terminal 1)
cd server
mvn spring-boot:run
# Listens on http://localhost:8080

# Frontend (Terminal 2)
cd client
npm install
npm run dev
# Listens on http://localhost:5173
```

### API Documentation

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/sessions` | Create session |
| GET | `/api/sessions/{slug}` | Get session info |
| GET | `/api/sessions/{slug}/qr` | Download QR code (PNG) |
| POST | `/api/sessions/{slug}/tokens` | Customer joins queue |
| GET | `/api/sessions/{slug}/tokens` | List tokens |
| GET | `/api/sessions/{slug}/queue` | Get queue state |
| POST | `/api/sessions/{slug}/next` | Call next customer |
| PATCH | `/api/tokens/{id}/status` | Update token status |
| GET | `/api/sessions/{slug}/events` | SSE stream |

## Routes

| Path | Page | Role |
|------|------|------|
| `/` | CreateSession | Admin setup |
| `/join/:slug` | JoinQueue | Customer join |
| `/join/:slug/status/:tokenId` | JoinSuccess | Live tracking |
| `/admin/:slug` | AdminDashboard | Queue management |
| `/display/:slug` | PublicDisplay | TV display |

## Deployment

### Free Tier (Railway + Vercel)

1. **Push to GitHub**
2. **Backend**: [Railway](https://railway.app)
   - New Project → Deploy from GitHub
   - Root Directory: `server`
   - Add PostgreSQL database
   - Set `CLIENT_URL` env var to your Vercel URL
3. **Frontend**: [Vercel](https://vercel.com)
   - Import GitHub repo
   - Root Directory: `client`
   - Set `VITE_API_URL` to your Railway backend URL

**Total Cost**: $0 for MVP traffic, Railway gives $5 credit/month

## Project Structure

```
QBYAZ/
├── server/                    # Spring Boot backend
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/qbyaz/
│       ├── QbyazApplication.java
│       ├── model/            # JPA entities
│       ├── repository/       # Spring Data JPA
│       ├── service/          # Business logic
│       ├── controller/       # REST endpoints
│       ├── dto/              # Request/response objects
│       └── config/           # Spring config
├── client/                    # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── src/
│       ├── pages/           # 5 main pages
│       ├── components/      # Reusable UI
│       ├── hooks/           # useSSE for real-time
│       ├── api/             # Fetch client
│       └── index.css        # Tailwind + animations
└── README.md
```

## Key Design Decisions

1. **H2 for Dev, PostgreSQL for Prod**: Single `application.properties` + `application-prod.properties`
2. **SSE for Real-time**: Simpler than WebSockets, perfect for broadcasting queue updates
3. **Modular Notifications**: `NotificationService` interface lets you swap implementations
4. **Token Numbers in DB**: Sequential `MAX(token_number) + 1` in transaction prevents duplicates
5. **Glass UI + Framer Motion**: Modern, delightful experience without overcomplication
6. **Vite + React Router**: Fast dev iteration, production-optimized bundle

## Database Schema

```sql
-- Sessions
CREATE TABLE sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  slug VARCHAR(12) NOT NULL UNIQUE,
  status ENUM('ACTIVE', 'CLOSED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tokens
CREATE TABLE tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  token_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  purpose VARCHAR(255),
  category VARCHAR(50) DEFAULT 'general',
  phone VARCHAR(20),
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  INDEX (session_id, status)
);
```

## What's Not Included (MVP Scope)

- User authentication / multi-tenancy
- Analytics / historical reports
- Advanced WhatsApp integration (stub only)
- Admin PIN protection (can be added)
- SMS notifications
- Mobile app (web-first MVP)

## Next Steps for Production

1. **Add Admin PIN** for session access
2. **Integrate WhatsApp API** (replace `ConsoleNotificationService`)
3. **Add Analytics**: Track queue times, peak hours, etc.
4. **Database Backups**: Enable auto-backups on Railway
5. **Monitoring**: Set up error tracking (Sentry, Rollbar)
6. **Load Testing**: Test with 100+ concurrent tokens

## License

MIT

## Support

For issues or questions, open a GitHub issue.

---

Built with ❤️ for businesses managing queues efficiently.
