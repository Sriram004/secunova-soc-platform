# SecuNova SOC Platform

A modern, enterprise-grade Extended Detection & Response (XDR) platform for security operations teams. Built with React, TypeScript, and Supabase, this platform enables real-time threat detection, investigation, and response.

## Features

- **Real-time Alert Management** - Centralized dashboard for monitoring, filtering, and triaging security alerts with severity levels
- **Incident Response** - Create, track, and manage security incidents with automated workflows and alert correlation
- **Detection Rules Engine** - Deploy and manage custom detection rules across your infrastructure
- **Security Analytics** - Track key metrics including alert volumes, severity distribution, and incident statistics
- **Role-Based Access Control** - Enterprise authentication with user isolation and Row Level Security (RLS)
- **Dark-themed Interface** - Optimized for 24/7 security operations with minimal eye strain
- **Real-time Synchronization** - Live updates for alerts and incidents across the platform

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account with a configured database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secunova-soc-platform.git
   cd secunova-soc-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── AuthPage.tsx     # Login/registration interface
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── AlertsView.tsx   # Alerts management
│   ├── IncidentsView.tsx # Incidents management
│   └── RulesView.tsx    # Detection rules management
├── contexts/            # React context providers
│   └── AuthContext.tsx  # Authentication state management
├── lib/                 # Utility functions and services
│   └── supabase.ts      # Supabase client configuration
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types and interfaces
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.5** - Type-safe development
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Icon library
- **React Hooks** - State management

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Data isolation and access control

### Authentication
- **Supabase Auth** - Email/password authentication
- **JWT** - Secure session management

### Development Tools
- **ESLint** - Code quality
- **TypeScript ESLint** - Type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## Database Schema

### Tables

**users** - User account information (managed by Supabase Auth)
- id (uuid, primary key)
- email (text, unique)
- created_at (timestamp)
- updated_at (timestamp)

**alerts** - Security alerts
- id (uuid, primary key)
- title (text)
- description (text)
- severity (text: 'critical', 'high', 'medium', 'low')
- status (text: 'new', 'acknowledged', 'resolved')
- source (text)
- created_at (timestamp)
- updated_at (timestamp)
- user_id (uuid, foreign key)

**incidents** - Security incidents
- id (uuid, primary key)
- title (text)
- description (text)
- status (text: 'open', 'investigating', 'resolved', 'closed')
- severity (text)
- created_at (timestamp)
- updated_at (timestamp)
- user_id (uuid, foreign key)

**detection_rules** - Custom detection rules
- id (uuid, primary key)
- name (text)
- description (text)
- enabled (boolean)
- rule_condition (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
- user_id (uuid, foreign key)

All tables have Row Level Security enabled to ensure users only access their own data.

## Authentication

The platform uses Supabase's built-in email/password authentication. Users can:
- Register a new account
- Log in with email and password
- Manage their authentication session
- Access their isolated data through RLS policies

## Usage

### Viewing Alerts
1. Navigate to the **Alerts** tab
2. View all security alerts with severity levels
3. Filter alerts by status (New, Acknowledged, Resolved)
4. Click on an alert to view details

### Managing Incidents
1. Go to the **Incidents** tab
2. Click **Create Incident** to open a new incident
3. Fill in incident details and linked alerts
4. Track incident status through workflow stages

### Deploying Detection Rules
1. Open the **Rules** tab
2. Create a new rule with custom conditions
3. Enable/disable rules as needed
4. Monitor rule effectiveness in the dashboard

### Dashboard Analytics
- View total alert count
- Monitor alert severity distribution
- Track incident metrics
- Review recent activity

## Development

### Build for Production
```bash
npm run build
```

### Run Type Checking
```bash
npm run typecheck
```

### Lint Code
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind CSS

Tailwind is configured in `tailwind.config.js`. Customize the theme and extend utilities as needed.

### ESLint

Linting rules are defined in `eslint.config.js`. Modify rules to match your team's code style standards.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- TypeScript types are properly defined
- Components are modular and reusable
- Database changes follow the migration pattern

## Performance Optimization

- Lazy loading for components
- Optimized database queries with indexes
- CSS minification via Tailwind
- JavaScript tree-shaking via Vite
- RLS policies for efficient data filtering

## Security Considerations

- All user data is isolated through Row Level Security
- Authentication handled by Supabase
- Environment variables never exposed in client code
- Type-safe data operations with TypeScript
- CORS configured appropriately
- Input validation on all forms

## Troubleshooting

**Issue: "Cannot find module '@supabase/supabase-js'"**
- Solution: Run `npm install` to install all dependencies

**Issue: Database connection errors**
- Check your `.env` file has correct Supabase URL and keys
- Verify your Supabase project is active and accessible

**Issue: Authentication not working**
- Ensure Supabase Auth is enabled in your project
- Check that email/password authentication is configured

## Roadmap

- [ ] WebSocket real-time updates for live alerts
- [ ] Advanced threat intelligence integration
- [ ] Automated incident response workflows
- [ ] Machine learning-based alert correlation
- [ ] Multi-tenant organization support
- [ ] SIEM integration connectors
- [ ] Mobile app for on-the-go SOC monitoring

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

## Acknowledgments

- Built with React and modern web technologies
- Powered by Supabase for backend infrastructure
- UI components styled with Tailwind CSS
- Icons from Lucide React

---

**SecuNova SOC Platform** - Protecting organizations from security threats in real-time.
