# Trade Recording Module Tasks

**Module:** Trade Recording Module  
**Priority:** High  
**Dependencies:** Database schema, UI framework, Authentication  
**Estimated Time:** 5-6 days  

## Tasks

### 1. Create Add/Edit Trade form with all required fields
- [ ] Build TradeForm component with multi-step layout
- [ ] Add basic trade information section (date, symbol, quantity, price)
- [ ] Create instrument type selection (Equity, Futures, Options)
- [ ] Add position direction selection (Buy/Long, Sell/Short)
- [ ] Build entry/exit date and time pickers
- [ ] Add quantity and price input fields with validation

### 2. Implement real-time charge calculation engine
- [ ] Create charge calculation service
- [ ] Implement STT calculation (0.1% on sell value)
- [ ] Add Exchange transaction charges (0.00173% on turnover)
- [ ] Implement SEBI turnover fee (0.0001% on turnover)
- [ ] Add Stamp duty calculation (0.003% on turnover)
- [ ] Create brokerage calculation (flat per side or percentage)
- [ ] Build total charges aggregation

### 3. Build options-specific form fields and validation
- [ ] Create OptionsTradeForm component
- [ ] Add option type selection (Call/Put)
- [ ] Build strike price input with validation
- [ ] Add expiry date picker with valid dates
- [ ] Create lot size input with auto-calculation
- [ ] Add underlying symbol field
- [ ] Implement options-specific validation rules

### 4. Create strategy tags and emotional state selection
- [ ] Build StrategyTagsSelector component
- [ ] Create predefined strategy tags (Breakout, Momentum, etc.)
- [ ] Add custom tag creation functionality
- [ ] Build EmotionalStateSelector component
- [ ] Add MarketConditionSelector component
- [ ] Create confidence level slider (1-10 scale)
- [ ] Implement tag validation and limits

### 5. Implement file upload for trade attachments
- [ ] Create FileUpload component with drag & drop
- [ ] Add file type validation (PNG, JPG, PDF)
- [ ] Implement file size limits (5MB max)
- [ ] Create thumbnail preview functionality
- [ ] Add file removal capability
- [ ] Implement file storage and retrieval

### 6. Build trade validation and error handling
- [ ] Create comprehensive form validation
- [ ] Add real-time validation feedback
- [ ] Implement cross-field validation (exit > entry date)
- [ ] Add business rule validation
- [ ] Create validation error display system
- [ ] Add form submission error handling

### 7. Create trade calculation preview panel
- [ ] Build CalculationPreview component
- [ ] Add real-time P&L calculation display
- [ ] Create charges breakdown table
- [ ] Add turnover and value calculations
- [ ] Implement holding duration calculation
- [ ] Add risk/reward ratio calculation

### 8. Implement draft saving functionality
- [ ] Create draft save mechanism
- [ ] Add auto-save functionality
- [ ] Implement draft loading and restoration
- [ ] Create draft management interface
- [ ] Add draft cleanup system
- [ ] Implement draft sharing capability

## Acceptance Criteria
- [ ] All trade types (Equity, Futures, Options) supported
- [ ] Real-time charge calculations accurate to ₹0.01
- [ ] Form validation prevents invalid data entry
- [ ] File uploads working with proper validation
- [ ] Draft saving and loading functional
- [ ] Mobile responsive design implemented
