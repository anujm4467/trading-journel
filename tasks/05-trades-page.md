# Trades Page (Journal View) Tasks

**Module:** Trades Page (Journal View)  
**Priority:** High  
**Dependencies:** Trade module, UI framework  
**Estimated Time:** 4-5 days  

## Tasks

### 1. Build trades table with all required columns and sorting
- [ ] Create TradesTable component with all 15 columns
- [ ] Add column sorting functionality (date, symbol, P&L, etc.)
- [ ] Implement multi-column sorting with Shift+click
- [ ] Add sort direction indicators (↑↓)
- [ ] Create default sorting (newest first)
- [ ] Add column width management

### 2. Implement advanced filtering system (date, symbol, P&L, strategy)
- [ ] Create FilterPanel component with accordion sections
- [ ] Add date range filtering with presets (Today, 7D, 30D, etc.)
- [ ] Build symbol filtering with autocomplete
- [ ] Add P&L range filtering with dual sliders
- [ ] Create strategy tag filtering with multi-select
- [ ] Add instrument type filtering (Equity, Futures, Options)
- [ ] Implement filter persistence and URL state

### 3. Create trade detail modal with tabs (Overview, Charges, Notes)
- [ ] Build TradeDetailModal component
- [ ] Create Overview tab with trade summary
- [ ] Add Charges tab with detailed breakdown
- [ ] Build Notes tab with attachments
- [ ] Add Charts tab placeholder for future
- [ ] Implement modal state management
- [ ] Add modal accessibility features

### 4. Build bulk actions (edit, delete, export selected trades)
- [ ] Add row selection checkboxes
- [ ] Create "Select All" functionality
- [ ] Build bulk edit modal
- [ ] Add bulk delete with confirmation
- [ ] Create bulk export functionality
- [ ] Implement selection state management

### 5. Implement search functionality across all trade fields
- [ ] Create global search input component
- [ ] Add search across symbol, notes, tags
- [ ] Implement debounced search (300ms)
- [ ] Add search highlighting
- [ ] Create search result filtering
- [ ] Add search history and suggestions

### 6. Create responsive card view for mobile devices
- [ ] Build TradeCard component for mobile
- [ ] Add card layout with key information
- [ ] Implement swipe actions for mobile
- [ ] Create card expansion for details
- [ ] Add mobile-specific filtering
- [ ] Implement responsive breakpoints

### 7. Build pagination and virtual scrolling for large datasets
- [ ] Create Pagination component
- [ ] Add page size selection (25, 50, 100, All)
- [ ] Implement virtual scrolling for >1000 rows
- [ ] Add infinite scroll option
- [ ] Create pagination state management
- [ ] Add loading states for pagination

### 8. Implement real-time P&L updates and calculations
- [ ] Add real-time P&L calculation service
- [ ] Create live price update mechanism
- [ ] Implement P&L color coding (green/red)
- [ ] Add percentage return calculations
- [ ] Create P&L trend indicators
- [ ] Add real-time data refresh

## Acceptance Criteria
- [ ] Table displays all required columns correctly
- [ ] Filtering works across all filter types
- [ ] Search functionality covers all relevant fields
- [ ] Mobile responsive design implemented
- [ ] Bulk actions work with selected trades
- [ ] Real-time updates function properly
