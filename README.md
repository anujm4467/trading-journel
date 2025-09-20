# TradeJournal Pro

A comprehensive trading journal application built with Next.js 14, TypeScript, and modern UI components. Track, analyze, and improve your trading performance across equity, futures, and options markets.

## 🚀 Features

### 📊 **Trading Journal**
- **Multi-step Trade Entry**: Intuitive form with real-time calculations
- **Real-time Charge Calculation**: Automatic brokerage, STT, exchange, SEBI, and stamp duty calculations
- **Support for All Instruments**: Equity, Futures, and Options trading
- **Advanced Trade Management**: Draft saving, bulk operations, and trade history
- **File Attachments**: Upload trade-related documents and screenshots

### 📈 **Analytics Dashboard**
- **Performance Metrics**: Win rate, profit factor, Sharpe ratio, and more
- **Interactive Charts**: Modern charts using Recharts for data visualization
- **Strategy Analysis**: Compare performance across different trading strategies
- **Time-based Analysis**: Performance by day of week and time of day
- **Risk Metrics**: Drawdown analysis and risk management insights

### 💼 **Portfolio Management**
- **Real-time Position Tracking**: Current positions with live P&L
- **Portfolio Overview**: Total value, day change, and risk exposure
- **Position Management**: Close positions, edit stop losses, and targets
- **Risk Alerts**: Warnings for high-risk positions

### 📋 **Advanced Table Features**
- **Sortable Columns**: Click headers to sort by any column
- **Advanced Filtering**: Filter by date range, instruments, strategies, and more
- **Bulk Operations**: Select multiple trades for batch operations
- **Search Functionality**: Quick search across all trade data
- **Export Options**: CSV, Excel, and PDF export formats

### ⚙️ **Settings & Configuration**
- **Customizable Charge Rates**: Set your own brokerage and fee structures
- **Display Preferences**: Dense mode, zebra striping, and theme options
- **Export Settings**: Configure file naming and export formats
- **Backup & Restore**: Complete data backup and restore functionality

### 📊 **Reports & Export**
- **Multiple Report Templates**: Monthly, tax, strategy, and custom reports
- **Scheduled Reports**: Automatic report generation
- **Export Formats**: CSV, Excel, and PDF with customizable templates
- **Email Integration**: Send reports directly via email

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trading-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── trades/            # Trades page
│   ├── analytics/         # Analytics dashboard
│   ├── portfolio/         # Portfolio management
│   ├── settings/          # Settings page
│   └── reports/           # Reports & export
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   ├── layout/           # Layout components
│   ├── trades/           # Trade-specific components
│   ├── analytics/        # Analytics components
│   ├── portfolio/        # Portfolio components
│   ├── settings/         # Settings components
│   └── reports/          # Reports components
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
└── prisma/               # Database schema and migrations
```

## 🎨 Design System

### Color Scheme
- **Primary**: Professional blue for main actions
- **Success/Profit**: Green for positive values
- **Loss/Error**: Red for negative values
- **Warning**: Orange for alerts
- **Info**: Blue for information

### Components
- **Modern UI**: Built with shadcn/ui components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Full dark mode support
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG AA compliant

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Trades**: Core trading data with P&L calculations
- **Positions**: Current portfolio positions
- **Charges**: Detailed charge breakdowns
- **Tags**: Strategy, emotional, and market tags
- **Attachments**: File uploads for trades
- **Settings**: User preferences and configuration

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_NAME="TradeJournal Pro"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Charge Configuration

The application supports customizable charge rates:

- **Brokerage**: Flat rate or percentage
- **STT**: Different rates for equity, futures, and options
- **Exchange Charges**: Configurable exchange fees
- **SEBI Charges**: SEBI turnover fees
- **Stamp Duty**: State-wise stamp duty

## 📈 Features in Detail

### Trade Recording
- **Multi-step Form**: Step-by-step trade entry process
- **Real-time Calculations**: Live P&L and charge calculations
- **Draft Saving**: Save incomplete trades for later completion
- **Bulk Import**: Import trades from CSV files
- **File Attachments**: Upload trade-related documents

### Analytics
- **Performance Metrics**: Comprehensive trading statistics
- **Chart Visualizations**: Interactive charts for data analysis
- **Strategy Comparison**: Compare different trading strategies
- **Time Analysis**: Performance by time periods
- **Risk Analysis**: Drawdown and risk metrics

### Portfolio Management
- **Live Positions**: Real-time position tracking
- **P&L Monitoring**: Unrealized P&L calculations
- **Risk Alerts**: Warnings for high-risk positions
- **Position Management**: Close and modify positions

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables**
   - Add your environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Real-time market data integration
- [ ] Advanced charting with TradingView
- [ ] Social features and sharing
- [ ] API for third-party integrations
- [ ] Advanced backtesting
- [ ] AI-powered insights

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced analytics and reporting
- **v1.2.0**: Mobile responsiveness improvements
- **v2.0.0**: Real-time data integration

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Prisma](https://prisma.io/) - Database ORM
- [Recharts](https://recharts.org/) - Chart library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**TradeJournal Pro** - Track, Analyze, Improve Your Trading Performance 🚀