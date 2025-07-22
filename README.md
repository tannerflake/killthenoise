# KillTheNoise.ai 🚀

**AI-powered product issue triage and prioritization platform**

KillTheNoise.ai is a full-stack PERN application that ingests data from multiple sources (Slack, HubSpot, Jira, Google Docs) and uses AI to identify and rank product issues based on frequency and severity.

## 🎯 Project Overview

This is **Phase 0** of the startup, focusing on:
- ✅ Core project structure and architecture
- ✅ Database schema for issue tracking
- ✅ REST API endpoints for issue management
- ✅ Modern React dashboard with TypeScript
- ✅ Placeholder integration services
- ✅ AI-ready infrastructure

## 🏗️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **PostgreSQL** for data persistence
- **ts-node-dev** for development
- **CORS** and **Helmet** for security

### Frontend
- **React 18** with **TypeScript**
- **React Router** for navigation
- **Axios** for API communication
- **CSS Modules** for styling
- **Modern responsive design**

## 📁 Project Structure

```
killthenoise/
├── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── db.ts          # Database connection
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd killthenoise

# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb killthenoise

# Or using psql
psql -U postgres
CREATE DATABASE killthenoise;
\q
```

### 3. Environment Configuration

```bash
# Copy environment example
cp server/env.example server/.env

# Edit server/.env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=killthenoise
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Start Development Servers

```bash
# Start both server and client concurrently
npm start

# Or start individually:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:3000
```

## 📊 API Endpoints

### Issues
- `GET /api/issues` - Get all issues with filtering
- `GET /api/issues/top` - Get top issues by priority
- `GET /api/issues/analytics` - Get issues with AI analytics
- `GET /api/issues/:id` - Get specific issue
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

### Integrations
- `POST /api/integrations/test` - Run integration test (populates mock data)

### Health Check
- `GET /health` - Server health status

## 🎨 Dashboard Features

### Current Features
- 📊 **Issue Dashboard** - View top product issues
- 📈 **Statistics Cards** - Key metrics overview
- 🔗 **Integration Status** - Data source connections
- 🧪 **Integration Testing** - Populate mock data
- 📱 **Responsive Design** - Mobile-friendly interface

### Issue Display
- **Severity Indicators** - Color-coded priority levels
- **Source Icons** - Visual data source identification
- **Frequency Tracking** - Report count per issue
- **Tag System** - Categorization and filtering
- **Status Management** - Open/closed issue tracking

## 🔌 Integration Architecture

### Current Placeholder Integrations

The application includes placeholder services for:

1. **Slack Integration** (`server/src/services/integrationService.ts`)
   - Location: Lines 27-73
   - Mock data: Customer support channel issues
   - Future: Real Slack API with bot token

2. **HubSpot Integration** (`server/src/services/integrationService.ts`)
   - Location: Lines 75-106
   - Mock data: Support ticket issues
   - Future: Real HubSpot API with API key

3. **Jira Integration** (`server/src/services/integrationService.ts`)
   - Location: Lines 108-139
   - Mock data: Bug reports and feature requests
   - Future: Real Jira API with API token

4. **Google Docs Integration** (`server/src/services/integrationService.ts`)
   - Location: Lines 141-172
   - Mock data: User feedback documents
   - Future: Real Google Docs API with service account

### Adding Real Integrations

To implement real integrations, you would:

1. **Install API SDKs**:
   ```bash
   cd server
   npm install @slack/web-api @hubspot/api-client jira-client googleapis
   ```

2. **Update Environment Variables**:
   ```env
   SLACK_BOT_TOKEN=your_slack_bot_token
   HUBSPOT_API_KEY=your_hubspot_api_key
   JIRA_API_TOKEN=your_jira_api_token
   GOOGLE_DOCS_API_KEY=your_google_docs_api_key
   ```

3. **Replace Mock Methods** in `integrationService.ts`:
   - Replace mock data with real API calls
   - Add proper error handling
   - Implement rate limiting
   - Add authentication logic

## 🗄️ Database Schema

### Tables

1. **issues** - Main issue tracking
   - `id`, `title`, `description`, `source`, `source_id`
   - `severity` (1-5), `frequency`, `status`, `tags`
   - `created_at`, `updated_at`

2. **data_sources** - Integration configuration
   - `id`, `name`, `type`, `config` (JSONB)
   - `is_active`, `last_sync`, timestamps

3. **issue_analytics** - AI analysis results
   - `issue_id`, `ai_score`, `sentiment_score`, `priority_score`
   - `analysis_data` (JSONB), `analyzed_at`

## 🧪 Testing the Application

### 1. Start the Application
```bash
npm start
```

### 2. Access the Dashboard
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 3. Populate Test Data
- Click "Run Integration Test" button in the dashboard
- This will populate the database with mock issues from all integrations

### 4. View Results
- Dashboard will show statistics and issue table
- Integration status shows all sources as "Active"

## 🔮 Future Phases

### Phase 1: Real Integrations
- Implement actual API connections
- Add authentication and webhooks
- Real-time data synchronization

### Phase 2: AI Implementation
- OpenAI integration for issue analysis
- Sentiment analysis and categorization
- Priority scoring algorithms

### Phase 3: Advanced Features
- User authentication and roles
- Advanced filtering and search
- Issue assignment and workflow
- Reporting and analytics

## 🛠️ Development

### Available Scripts

```bash
# Root level
npm start              # Start both server and client
npm run server         # Start backend only
npm run client         # Start frontend only
npm run install-all    # Install all dependencies

# Server
cd server
npm run dev           # Development with hot reload
npm run build         # Build for production
npm start             # Production start

# Client
cd client
npm start             # Development server
npm run build         # Build for production
```

### Code Organization

- **Controllers**: Handle HTTP requests and responses
- **Models**: Database operations and data validation
- **Services**: Business logic and external integrations
- **Routes**: API endpoint definitions
- **Components**: Reusable React components
- **Pages**: Main application views

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Open an issue on GitHub

---

**Built with ❤️ for better product management** 