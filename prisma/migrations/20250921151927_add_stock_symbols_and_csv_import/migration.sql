-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT,
    "phone" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeType" TEXT NOT NULL DEFAULT 'INTRADAY',
    "entryDate" DATETIME NOT NULL,
    "entryPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "exitDate" DATETIME,
    "exitPrice" REAL,
    "holdingDuration" INTEGER,
    "entryValue" REAL NOT NULL,
    "exitValue" REAL,
    "turnover" REAL NOT NULL,
    "grossPnl" REAL,
    "netPnl" REAL,
    "totalCharges" REAL,
    "percentageReturn" REAL,
    "stopLoss" REAL,
    "target" REAL,
    "riskAmount" REAL,
    "rewardAmount" REAL,
    "riskRewardRatio" REAL,
    "confidenceLevel" INTEGER,
    "emotionalState" TEXT,
    "marketCondition" TEXT,
    "planning" TEXT,
    "brokerName" TEXT,
    "customBrokerage" BOOLEAN NOT NULL DEFAULT false,
    "brokerageType" TEXT,
    "brokerageValue" REAL,
    "notes" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "options_trades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeId" TEXT NOT NULL,
    "optionType" TEXT NOT NULL,
    "strikePrice" REAL NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "lotSize" INTEGER NOT NULL DEFAULT 50,
    "underlying" TEXT NOT NULL,
    CONSTRAINT "options_trades_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hedge_positions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "entryDate" DATETIME NOT NULL,
    "entryPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exitDate" DATETIME,
    "exitPrice" REAL,
    "entryValue" REAL NOT NULL,
    "exitValue" REAL,
    "grossPnl" REAL,
    "netPnl" REAL,
    "totalCharges" REAL,
    "percentageReturn" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "hedge_positions_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hedge_charges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hedgeId" TEXT NOT NULL,
    "chargeType" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "baseAmount" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hedge_charges_hedgeId_fkey" FOREIGN KEY ("hedgeId") REFERENCES "hedge_positions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trade_charges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeId" TEXT NOT NULL,
    "chargeType" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "baseAmount" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trade_charges_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "strategy_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "emotional_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#8B5CF6',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "market_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#10B981',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "trade_strategy_tags" (
    "tradeId" TEXT NOT NULL,
    "strategyTagId" TEXT NOT NULL,

    PRIMARY KEY ("tradeId", "strategyTagId"),
    CONSTRAINT "trade_strategy_tags_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trade_strategy_tags_strategyTagId_fkey" FOREIGN KEY ("strategyTagId") REFERENCES "strategy_tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trade_emotional_tags" (
    "tradeId" TEXT NOT NULL,
    "emotionalTagId" TEXT NOT NULL,

    PRIMARY KEY ("tradeId", "emotionalTagId"),
    CONSTRAINT "trade_emotional_tags_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trade_emotional_tags_emotionalTagId_fkey" FOREIGN KEY ("emotionalTagId") REFERENCES "emotional_tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trade_market_tags" (
    "tradeId" TEXT NOT NULL,
    "marketTagId" TEXT NOT NULL,

    PRIMARY KEY ("tradeId", "marketTagId"),
    CONSTRAINT "trade_market_tags_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trade_market_tags_marketTagId_fkey" FOREIGN KEY ("marketTagId") REFERENCES "market_tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trade_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trade_attachments_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "avgEntryPrice" REAL NOT NULL,
    "currentPrice" REAL,
    "unrealizedPnl" REAL,
    "unrealizedPnlPercent" REAL,
    "daysHeld" INTEGER,
    "stopLoss" REAL,
    "target" REAL,
    "riskAmount" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "capital_pools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "poolType" TEXT NOT NULL DEFAULT 'TOTAL',
    "initialAmount" REAL NOT NULL,
    "currentAmount" REAL NOT NULL,
    "totalInvested" REAL NOT NULL DEFAULT 0,
    "totalWithdrawn" REAL NOT NULL DEFAULT 0,
    "totalPnl" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "capital_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poolId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "balanceAfter" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "capital_transactions_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "capital_pools" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stock_symbols" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT,
    "series" TEXT NOT NULL DEFAULT 'EQ',
    "isinCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "csv_import_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "headers" JSONB NOT NULL,
    "columnMapping" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "csv_imports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT,
    "fileName" TEXT NOT NULL,
    "originalHeaders" JSONB NOT NULL,
    "columnMapping" JSONB NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "processedRows" INTEGER NOT NULL,
    "successRows" INTEGER NOT NULL,
    "errorRows" INTEGER NOT NULL,
    "duplicateRows" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "csv_imports_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "csv_import_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultInstrument" TEXT NOT NULL DEFAULT 'EQUITY',
    "defaultPosition" TEXT NOT NULL DEFAULT 'BUY',
    "defaultLotSize" JSONB,
    "autoCalculateCharges" BOOLEAN NOT NULL DEFAULT true,
    "requireStrategyTag" BOOLEAN NOT NULL DEFAULT false,
    "currencySymbol" TEXT NOT NULL DEFAULT '₹',
    "decimalPlaces" INTEGER NOT NULL DEFAULT 2,
    "thousandsSeparator" TEXT NOT NULL DEFAULT 'comma',
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "timeFormat" TEXT NOT NULL DEFAULT '24',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "defaultPageSize" INTEGER NOT NULL DEFAULT 50,
    "denseMode" BOOLEAN NOT NULL DEFAULT false,
    "zebraStriping" BOOLEAN NOT NULL DEFAULT true,
    "stickyHeaders" BOOLEAN NOT NULL DEFAULT true,
    "autoRefresh" BOOLEAN NOT NULL DEFAULT true,
    "defaultExportFormat" TEXT NOT NULL DEFAULT 'excel',
    "includeFilters" BOOLEAN NOT NULL DEFAULT true,
    "includeCharts" BOOLEAN NOT NULL DEFAULT true,
    "fileNamingTemplate" TEXT NOT NULL DEFAULT 'TradeJournal_YYYY-MM-DD',
    "keepTradeHistory" TEXT NOT NULL DEFAULT 'forever',
    "autoBackupFrequency" TEXT NOT NULL DEFAULT 'weekly',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "options_trades_tradeId_key" ON "options_trades"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "hedge_positions_tradeId_key" ON "hedge_positions"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_tags_name_key" ON "strategy_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "emotional_tags_name_key" ON "emotional_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "market_tags_name_key" ON "market_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stock_symbols_symbol_key" ON "stock_symbols"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");
