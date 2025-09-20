# Database Schema & Implementation Tasks

**Module:** Database Schema & Implementation  
**Priority:** High  
**Dependencies:** Project setup completed  
**Estimated Time:** 3-4 days  

## Tasks

### 1. Setup SQLite database with Prisma ORM
- [ ] Install Prisma CLI and dependencies
- [ ] Initialize Prisma with SQLite provider
- [ ] Configure database connection string
- [ ] Setup Prisma client for Next.js

### 2. Design User and Profile tables with authentication fields
- [ ] Create User table (id, email, password, createdAt, updatedAt)
- [ ] Create Profile table (userId, fullName, phone, timezone, currency)
- [ ] Add authentication fields (emailVerified, twoFactorEnabled)
- [ ] Create indexes for performance

### 3. Create Trade table with all required fields (entry/exit, P&L, charges)
- [ ] Design Trade table schema
- [ ] Add entry fields (entryDate, entryPrice, quantity, position)
- [ ] Add exit fields (exitDate, exitPrice, holdingDuration)
- [ ] Add P&L fields (grossPnl, netPnl, totalCharges)
- [ ] Add instrument type and symbol fields
- [ ] Create foreign key relationships

### 4. Design Options-specific tables (strike, expiry, lot size)
- [ ] Create OptionsTrade table
- [ ] Add option-specific fields (strikePrice, expiryDate, optionType)
- [ ] Add lot size and premium fields
- [ ] Create relationship with main Trade table
- [ ] Add option chain data structure

### 5. Create Charges breakdown table for detailed calculations
- [ ] Design TradeCharges table
- [ ] Add charge types (brokerage, stt, exchange, sebi, stamp)
- [ ] Add rate and amount fields
- [ ] Create relationship with Trade table
- [ ] Add charge calculation metadata

### 6. Design Strategy tags and emotional state tables
- [ ] Create StrategyTag table
- [ ] Create EmotionalState table
- [ ] Create MarketCondition table
- [ ] Create many-to-many relationships with Trade
- [ ] Add tag management fields

### 7. Create Settings and Configuration tables
- [ ] Create UserSettings table
- [ ] Add charge configuration fields
- [ ] Add display preferences
- [ ] Add notification settings
- [ ] Create system configuration table

### 8. Design Portfolio/Positions tracking tables
- [ ] Create Position table for open positions
- [ ] Add position tracking fields
- [ ] Create position history table
- [ ] Add portfolio allocation tracking
- [ ] Create risk metrics storage

### 9. Create Audit trail and logging tables
- [ ] Create AuditLog table
- [ ] Add action tracking fields
- [ ] Create system events table
- [ ] Add user activity logging
- [ ] Create data change tracking

### 10. Setup database migrations and seed data
- [ ] Create initial migration
- [ ] Add seed data for testing
- [ ] Create sample trades data
- [ ] Add default settings data
- [ ] Test migration rollback

## Acceptance Criteria
- [ ] All tables created with proper relationships
- [ ] Indexes added for performance
- [ ] Migrations run successfully
- [ ] Seed data loads correctly
- [ ] Database queries optimized
