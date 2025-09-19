# Trade Journal - Comprehensive Product Requirements Document

**Version:** 2.0  
**Last Updated:** September 19, 2025  
**Document Type:** Functional Requirements (UI/UX Focused)

---

## 1. Executive Summary

### 1.1 Product Vision
Create a comprehensive trading journal application that enables traders to meticulously track, analyze, and improve their trading performance across equity, futures, and options markets. The system must provide automated charge calculations, advanced analytics, and actionable insights to help traders identify patterns, optimize strategies, and achieve consistent profitability.

### 1.2 Success Metrics
- **User Engagement**: 80% of users log trades within 24 hours of execution
- **Data Accuracy**: 99.5% accuracy in charge calculations vs broker statements
- **Insight Generation**: Users identify at least 3 actionable improvements within first month
- **Performance Tracking**: Clear visualization of trading evolution over time

---

## 2. Global UI Framework & Navigation

### 2.1 Application Header (Fixed Top Bar)
**Always Visible Elements:**
- **App Logo/Title**: "TradeJournal Pro" (left-aligned)
- **Global Date Range Selector**: 
  - Preset buttons: `Today` | `7D` | `30D` | `90D` | `MTD` | `YTD` | `Custom`
  - Custom range opens date picker overlay
  - Active selection highlighted with blue background
- **Global Instrument Filter Chips**:
  - `Equity` | `Futures` | `Options` (multi-select toggles)
  - Selected chips show blue background with white text
  - Show count badge when filters applied: "Equity (45)"
- **Quick Add Trade Button**: Primary blue CTA button, right-aligned
- **Export Menu**: Dropdown with options `CSV` | `Excel` | `PDF`
- **User Profile**: Avatar/initial circle with dropdown menu

### 2.2 Primary Navigation (Left Sidebar)
**Fixed Width: 240px on desktop, collapsible overlay on mobile**

**Navigation Items (with icons):**
1. 📊 **Dashboard** - Overview and key metrics
2. 📝 **Trades** - Complete trade journal/listing
3. 📈 **Analytics** - Performance analysis and insights
4. 💼 **Portfolio** - Current positions and allocation
5. ⚙️ **Settings** - Configuration and preferences
6. 📤 **Reports** - Export and reporting tools

**Visual States:**
- Active page: Blue background, white text, blue left border
- Hover: Light gray background
- Icons: 20px, consistent style

### 2.3 Filter Panel (Left Side, Collapsible)
**Width: 280px when expanded**

**Filter Sections (Expandable Accordions):**

#### A. Date & Time Filters
- **Date Range**: Calendar picker with presets
- **Time of Day**: Multi-select checkboxes
  - `Pre-Market (9:00-9:15)`
  - `Opening (9:15-10:00)`
  - `Morning (10:00-12:00)`
  - `Afternoon (12:00-15:00)`
  - `Closing (15:00-15:30)`
- **Day of Week**: Checkbox group for Mon-Fri

#### B. Instrument Filters
- **Asset Type**: Radio buttons with counts
  - `Equity (125 trades)`
  - `Futures (67 trades)`
  - `Options (89 trades)`
- **Options Specific** (shown only when Options selected):
  - **Option Type**: `Call` | `Put` checkboxes
  - **Strike Range**: Dual slider (min-max)
  - **Expiry Week**: Multi-select dropdown
  - **Underlying**: Searchable multi-select

#### C. Trade Characteristics
- **Position Type**: `Long` | `Short` checkboxes
- **Trade Status**: `Open` | `Closed` | `Partial` checkboxes
- **Holding Duration**:
  - `Scalp (<15 min)`
  - `Intraday (15min-1day)`
  - `Swing (1-7 days)`
  - `Positional (>7 days)`

#### D. Performance Filters
- **P&L Range**: Dual slider with currency input boxes
- **Win/Loss**: `Winners Only` | `Losers Only` | `Breakeven` checkboxes
- **Strategy Tags**: Multi-select chips (dynamically populated)

#### E. Risk Filters
- **Risk Amount**: Dual slider range
- **R:R Ratio**: Dropdown `<1:1` | `1:1-2:1` | `2:1-3:1` | `>3:1`
- **Stop Loss**: `With SL` | `Without SL` | `Hit SL` checkboxes

**Filter Panel Footer:**
- `Apply Filters` button (blue, full width)
- `Clear All` link (gray text)
- `Save as Preset` button
- **Saved Presets Dropdown**: "My Swing Trades", "Options Strategies", etc.

---

## 3. Trade Recording Module

### 3.1 Add/Edit Trade Form Layout

#### Trade Form Structure (Modal or Full Page)
**Form Width: 800px, 2-column layout for desktop**

#### Section A: Basic Trade Information
**Left Column:**
1. **Trade Type** (Required)
   - Radio buttons: `Entry Only` | `Round Trip` | `Multi-Leg`
   - Default: Round Trip
   - Help text: "Round trip includes both entry and exit"

2. **Entry Date & Time** (Required)
   - Date picker + Time picker (24hr format)
   - Format: DD/MM/YYYY HH:MM
   - Default: Current date/time

3. **Exit Date & Time** (Conditional)
   - Only shown for Round Trip trades
   - Validation: Must be after Entry Date & Time
   - Auto-calculate holding duration

4. **Symbol/Ticker** (Required)
   - Autocomplete text input
   - Dropdown suggestions from popular symbols
   - Format: Uppercase (e.g., "RELIANCE", "NIFTY50")

5. **Instrument Type** (Required)
   - Radio buttons with icons: `🏢 Equity` | `📊 Futures` | `📈 Options`
   - Changes form fields dynamically

**Right Column:**
6. **Position Direction** (Required)
   - Radio buttons: `📈 Buy/Long` | `📉 Sell/Short`
   - Color coded: Green for Buy, Red for Sell

7. **Quantity** (Required)
   - Number input with step controls
   - For Options: Label as "Number of Lots"
   - Show effective units calculation below

8. **Entry Price** (Required)
   - Number input with 2 decimal precision
   - Currency symbol prefix (₹)

9. **Exit Price** (Conditional)
   - Only for Round Trip trades
   - Same format as Entry Price

#### Section B: Options-Specific Fields (Conditional)
**Visible only when Instrument Type = Options**

**Left Column:**
10. **Option Type** (Required)
    - Radio buttons: `📞 Call` | `📞 Put`

11. **Strike Price** (Required)
    - Number input
    - Auto-suggest based on symbol

12. **Expiry Date** (Required)
    - Date picker limited to valid expiry dates
    - Show days to expiry

**Right Column:**
13. **Lot Size** (Required)
    - Number input
    - Pre-filled from system defaults
    - Show total units calculation

#### Section C: Risk Management
**Full Width:**
14. **Stop Loss** (Optional)
    - Number input with currency prefix
    - Show risk amount calculation: |Entry Price - Stop Loss| × Quantity

15. **Target/Take Profit** (Optional)
    - Number input with currency prefix
    - Show reward calculation: |Target - Entry Price| × Quantity

16. **Risk:Reward Ratio** (Auto-calculated)
    - Display only, calculated from SL and Target
    - Format: "1:2.5" with color coding

#### Section D: Strategy & Classification
**Left Column:**
17. **Strategy Tags** (Required)
    - Multi-select dropdown with common tags:
    - `Breakout` | `Pullback` | `Trend Following` | `Mean Reversion`
    - `Scalping` | `Swing` | `Position` | `Momentum`
    - `Support/Resistance` | `Chart Pattern` | `News Based`
    - Allow custom tag creation with "+" button

18. **Confidence Level** (Optional)
    - Slider: 1-10 scale
    - Visual indicator: Low (1-3) Red, Medium (4-7) Yellow, High (8-10) Green

**Right Column:**
19. **Emotional State** (Optional)
    - Dropdown: `Calm` | `Confident` | `Nervous` | `FOMO` | `Revenge` | `Overconfident`

20. **Market Condition** (Optional)
    - Dropdown: `Trending` | `Range-bound` | `Volatile` | `News Event` | `Normal`

#### Section E: Brokerage & Charges
**Full Width:**
21. **Broker Name** (Optional)
    - Dropdown with common brokers + "Other" option
    - Useful for multi-broker comparison

22. **Brokerage Override** (Optional)
    - Checkbox: "Use custom brokerage for this trade"
    - When checked, show:
      - **Brokerage Type**: `Flat per side` | `Percentage of turnover`
      - **Brokerage Value**: Number input

23. **Custom Charges** (Advanced)
    - Expandable section: "Override default charge rates"
    - Individual inputs for STT, Exchange, SEBI, etc.

#### Section F: Notes & Attachments
**Full Width:**
24. **Trade Notes** (Optional)
    - Large text area (4 rows)
    - Placeholder: "Trade reasoning, market analysis, lessons learned..."
    - Character counter: 0/1000

25. **Attachments** (Optional)
    - File upload area: "Drag chart screenshots here"
    - Support: PNG, JPG, PDF (max 5MB each)
    - Show thumbnail previews

#### Form Footer
**Button Layout (Right-aligned):**
- `Cancel` (Gray, secondary)
- `Save Draft` (Blue, outline)
- `Save & Add Another` (Blue, solid)
- `Save & Close` (Blue, solid, primary)

### 3.2 Auto-Calculated Fields Display

#### Real-time Calculations Panel (Right Side)
**Always visible during form completion:**

**Entry Value Calculation:**
```
Entry Value = Entry Price × Quantity × Lot Size
Example: ₹500 × 100 × 1 = ₹50,000
```

**Exit Value Calculation:**
```
Exit Value = Exit Price × Quantity × Lot Size
Example: ₹520 × 100 × 1 = ₹52,000
```

**Turnover Calculation:**
```
Turnover = Entry Value + Exit Value
Example: ₹50,000 + ₹52,000 = ₹1,02,000
```

**Gross P&L:**
```
Gross P&L = Exit Value - Entry Value
Example: ₹52,000 - ₹50,000 = ₹2,000
```

#### Detailed Charges Breakdown
**Expandable "Charges Preview" Panel:**

**STT (Securities Transaction Tax):**
- Rate: 0.1% on sell value
- Calculation: ₹52,000 × 0.001 = ₹52.00
- Applied to: Sell side only

**Exchange Transaction Charges:**
- Rate: 0.00173% on turnover
- Calculation: ₹1,02,000 × 0.0000173 = ₹1.76
- Applied to: Both sides

**SEBI Turnover Fee:**
- Rate: 0.0001% on turnover
- Calculation: ₹1,02,000 × 0.000001 = ₹0.10
- Applied to: Both sides

**Stamp Duty:**
- Rate: 0.003% on turnover
- Calculation: ₹1,02,000 × 0.00003 = ₹3.06
- Applied to: Both sides

**Brokerage:**
- Type: Flat per side
- Calculation: ₹20 × 2 sides = ₹40.00
- Applied to: Both sides

**Total Charges:**
```
₹52.00 + ₹1.76 + ₹0.10 + ₹3.06 + ₹40.00 = ₹96.92
```

**Net P&L:**
```
₹2,000.00 - ₹96.92 = ₹1,903.08
```

---

## 4. Trades Page (Journal View)

### 4.1 Page Layout & Structure

#### Page Header
- **Page Title**: "Trade Journal" (H1)
- **Trade Summary Cards** (4 cards in row):
  1. **Total Trades**: "1,247 trades" with period filter applied
  2. **Net P&L**: "₹1,25,670" (green/red based on value)
  3. **Win Rate**: "68.5%" with trend arrow
  4. **Avg Trade**: "₹985" per trade

#### Action Bar
**Left Side:**
- **Bulk Actions**: Checkbox for "Select All" + dropdown "Bulk Edit", "Delete Selected", "Export Selected"
- **View Options**: Toggle buttons `Table View` | `Card View`

**Right Side:**
- **Search Bar**: "Search by symbol, notes, tags..."
- **Quick Filters**: Dropdown buttons for common filters
- **Add Trade Button**: Primary CTA
- **Export Menu**: `CSV` | `Excel` | `PDF Report`

### 4.2 Trades Table Design

#### Table Structure (Responsive, Horizontal Scroll)
**Column Order & Specifications:**

1. **☐** (Checkbox - 40px)
   - Select individual trades for bulk actions

2. **Entry Date** (120px)
   - Format: DD/MM/YY
   - Sortable (default sort: newest first)
   - Click to sort by date

3. **Symbol** (100px)
   - Bold text, uppercase
   - Click to filter by symbol
   - Show instrument icon (🏢📊📈)

4. **Type** (80px)
   - Badge style: "EQ", "FUT", "OPT"
   - Color coded backgrounds

5. **Position** (80px)
   - "BUY"/"SELL" with color coding
   - Green for BUY, Red for SELL

6. **Qty** (80px)
   - Number + unit (shares/lots)
   - Right-aligned

7. **Entry ₹** (100px)
   - Currency format: ₹1,250.50
   - Right-aligned, 2 decimals

8. **Exit ₹** (100px)
   - Same format as Entry
   - Show "--" if open trade

9. **Duration** (100px)
   - Format: "2h 30m" or "3d 5h"
   - Show "--" if open

10. **Gross P&L** (120px)
    - Currency with + or - sign
    - Color coded: Green +, Red -
    - Bold font weight

11. **Charges** (100px)
    - Total charges amount
    - Hover to show breakdown tooltip

12. **Net P&L** (120px)
    - Most important column - emphasized
    - Large font, bold, color coded
    - Include percentage return

13. **Strategy** (120px)
    - Show primary tag as colored badge
    - "+" indicator if multiple tags

14. **R:R** (80px)
    - Format: "1:2.3"
    - Color coded by ratio quality

15. **Actions** (100px)
    - Icon buttons: 👁️ View | ✏️ Edit | 📋 Copy | 🗑️ Delete

#### Table Features
**Sorting:**
- Click column header to sort
- Show sort direction arrow (↑↓)
- Multi-column sort with Shift+click

**Row Styling:**
- Alternating row colors (white/light gray)
- Hover: Light blue background
- Selected: Blue border left + light blue background
- Open trades: Subtle yellow left border

**Responsive Behavior:**
- Mobile: Convert to card layout
- Tablet: Hide less important columns
- Desktop: Full table view

### 4.3 Trade Detail Modal

#### Modal Structure (800px width)
**Header:**
- **Trade ID**: "TRD-2025-001247"
- **Symbol & Type**: "RELIANCE Equity" (large font)
- **Entry Date**: "15 Sep 2025, 10:30 AM"
- **Status Badge**: "Closed" (green) or "Open" (orange)
- **Close Button**: ✕ (top right)

#### Content Tabs:
1. **📊 Overview** (Default)
2. **💰 Charges**
3. **📝 Notes**
4. **📈 Charts** (if implemented)

#### Overview Tab Content

**Trade Summary Section:**
```
Entry Date & Time:     15 Sep 2025, 10:30 AM
Exit Date & Time:      15 Sep 2025, 14:45 PM
Symbol:                RELIANCE
Instrument:            Equity
Position:              BUY
Quantity:              100 shares
Entry Price:           ₹2,450.50
Exit Price:            ₹2,485.75
Stop Loss:             ₹2,420.00
Target:                ₹2,500.00
Holding Duration:      4h 15m
```

**P&L Calculation Section:**
```
Entry Value:           ₹2,45,050.00
Exit Value:            ₹2,48,575.00
Turnover:              ₹4,93,625.00
Gross P&L:             ₹3,525.00
Total Charges:         ₹147.23
Net P&L:               ₹3,377.77 (1.38% return)
```

**Strategy & Risk Section:**
```
Strategy Tags:         Breakout, Momentum
Confidence Level:      8/10
Emotional State:       Confident
Market Condition:      Trending
Risk Amount:           ₹3,050.00 (Entry - SL)
Reward Amount:         ₹4,950.00 (Target - Entry)
Planned R:R:           1:1.62
Actual R:R:            1:1.11
```

#### Charges Tab Content
**Detailed Breakdown Table:**

| Charge Type | Rate | Base Amount | Calculation | Amount |
|-------------|------|-------------|-------------|---------|
| Brokerage | ₹20/side | N/A | ₹20 × 2 | ₹40.00 |
| STT | 0.1% | ₹2,48,575 | ₹2,48,575 × 0.001 | ₹248.58 |
| Exchange | 0.00173% | ₹4,93,625 | ₹4,93,625 × 0.0000173 | ₹8.54 |
| SEBI | 0.0001% | ₹4,93,625 | ₹4,93,625 × 0.000001 | ₹0.49 |
| Stamp Duty | 0.003% | ₹4,93,625 | ₹4,93,625 × 0.00003 | ₹14.81 |
| **Total** | | | | **₹312.42** |

#### Notes Tab Content
- **Trade Notes**: Large text area showing user notes
- **Attachments**: List of uploaded files with preview
- **Trade Lessons**: What worked/didn't work
- **Market Context**: News, events, technical setup

#### Modal Footer
- **Edit Trade** (Blue button)
- **Duplicate Trade** (Gray button)
- **Delete Trade** (Red button, requires confirmation)
- **Export PDF** (Generate single-trade report)

---

## 5. Analytics Dashboard

### 5.1 Dashboard Layout Structure

#### Page Header
- **Page Title**: "Trading Analytics"
- **Time Period Selector**: Connected to global filter
- **Quick Stats Bar**: 4 key metrics in cards

#### Widget Grid Layout
**3-column grid on desktop, 1-column on mobile**
**Each widget is a card with header, content, and optional actions**

### 5.2 Overview Widgets (Top Row)

#### Widget 1: Performance Summary
**Card Header**: "Performance Overview"
**Content:**
```
Total Net P&L:        ₹2,15,670 (+12.8%)
Win Rate:            68.5% (157/229 trades)
Profit Factor:       2.34 (₹3,45,200 wins / ₹1,47,400 losses)
Avg Win:             ₹2,197
Avg Loss:            ₹-1,034
Best Trade:          ₹12,450 (NIFTY Call)
Worst Trade:         ₹-5,680 (RELIANCE)
```
**Visual**: Small equity curve sparkline
**Action**: "View Details" → filters to all trades

#### Widget 2: Risk Metrics
**Card Header**: "Risk Analysis"
**Content:**
```
Max Drawdown:        -8.7% (₹18,450)
Drawdown Duration:   12 days
Avg Risk per Trade:  1.2% of account
Risk:Reward Avg:     1:2.1
Sharpe Ratio:        1.67
Max Consecutive Loss: 5 trades
Recovery Factor:     2.8
```
**Visual**: Drawdown curve (small chart)
**Action**: "Risk Details" → opens risk analysis page

#### Widget 3: Trading Activity
**Card Header**: "Activity Metrics"
**Content:**
```
Total Trades:        229 trades
Avg Trades/Day:      3.2
Trading Days:        68 of 90 days (75.6%)
Most Active Day:     Monday (34 trades)
Best Trading Hour:   10:30-11:30 AM
Overtrading Days:    12 days (>5 trades)
```
**Visual**: Activity heatmap (calendar style)
**Action**: "View Calendar" → detailed activity view

### 5.3 Time-Based Analysis Widgets

#### Widget 4: Performance by Time
**Card Header**: "Time-Based Performance"
**Content Tabs**: `Day of Week` | `Time of Day` | `Monthly`

**Day of Week Tab:**
- Bar chart showing Net P&L by weekday
- Monday: ₹45,200 (89 trades)
- Tuesday: ₹38,700 (82 trades)
- Wednesday: ₹-2,400 (78 trades)
- Thursday: ₹52,100 (91 trades)
- Friday: ₹28,070 (89 trades)

**Time of Day Tab:**
- Line chart showing cumulative P&L by hour
- Peak: 10:30-11:30 AM (₹67,200)
- Worst: 2:30-3:30 PM (₹-12,400)

**Monthly Tab:**
- Bar chart by month with trend line
- Best: August ₹89,200
- Worst: June ₹-15,600

#### Widget 5: Holding Period Analysis
**Card Header**: "Holding Duration Performance"
**Content:**
```
Scalp (<15 min):     ₹45,200 (89 trades) - 68% win rate
Intraday (15m-1d):   ₹89,600 (134 trades) - 72% win rate
Swing (1-7 days):    ₹67,400 (45 trades) - 64% win rate
Positional (>7d):    ₹13,470 (12 trades) - 58% win rate
```
**Visual**: Stacked bar chart showing P&L breakdown
**Insight**: "Your sweet spot is intraday trading"

### 5.4 Strategy & Instrument Analysis

#### Widget 6: Strategy Performance
**Card Header**: "Strategy Tag Analysis"
**Content Table:**

| Strategy | Trades | Win Rate | Net P&L | Avg P&L | Best | Worst |
|----------|--------|----------|---------|---------|------|-------|
| Breakout | 67 | 72% | ₹89,200 | ₹1,331 | ₹8,900 | ₹-3,200 |
| Pullback | 45 | 64% | ₹34,600 | ₹769 | ₹5,600 | ₹-4,100 |
| Momentum | 56 | 75% | ₹76,800 | ₹1,371 | ₹12,450 | ₹-2,800 |
| Mean Rev | 34 | 59% | ₹-8,900 | ₹-262 | ₹4,200 | ₹-5,680 |
| Scalping | 89 | 68% | ₹45,200 | ₹508 | ₹2,100 | ₹-1,800 |

**Visual**: Horizontal bar chart of Net P&L by strategy
**Insight**: "Avoid Mean Reversion strategy"
**Action**: Click strategy name to filter trades

#### Widget 7: Instrument Performance
**Card Header**: "Asset Class Breakdown"
**Content:**
```
Equity (125 trades):     ₹89,400 (69% win rate)
Futures (67 trades):     ₹67,800 (65% win rate)
Options (89 trades):     ₹58,470 (71% win rate)
```
**Visual**: Donut chart showing allocation and P&L
**Sub-breakdown**:
- **Options**: Calls (₹34,200), Puts (₹24,270)
- **Futures**: Index (₹45,600), Stock (₹22,200)
- **Equity**: Large Cap (₹56,700), Mid Cap (₹32,700)

### 5.5 Advanced Analytics Widgets

#### Widget 8: Performance Heatmap
**Card Header**: "Day vs Time Performance Heatmap"
**Content**: 
- Grid: Days (Mon-Fri) vs Time slots (9:15 AM - 3:30 PM in 30-min intervals)
- Color coding: Green (profitable), Red (losses), Gray (no trades)
- Cell values show average P&L for that day-time combination
- Hover shows: "Tuesday 10:30-11:00: ₹1,450 avg (12 trades)"

#### Widget 9: Equity Curve Analysis
**Card Header**: "Equity Growth Curve"
**Content:**
- Line chart showing cumulative P&L over time
- Annotations for major drawdowns and recovery periods
- Trend line showing overall growth trajectory
- Key metrics overlay:
  - Starting Balance: ₹5,00,000
  - Current Balance: ₹7,15,670
  - Total Return: 43.1%
  - CAGR: 28.4%

#### Widget 10: Behavioral Insights
**Card Header**: "Trading Psychology Analysis"
**Content:**
```
Revenge Trading:       18 instances detected (8% of losses followed by immediate trade)
FOMO Trades:          23 trades marked with FOMO emotion (65% win rate vs 68% avg)
Overconfident Trades: 34 trades (74% win rate - good self-assessment)
Emotional Impact:     Calm trades: 72% win rate, Nervous: 61% win rate
```
**Visual**: Emotional state vs performance scatter plot
**Insights**: 
- "Take a break after losses"
- "Your calm trades perform best"
- "Good at identifying high-confidence setups"

### 5.6 Widget Customization

#### Widget Controls (Top-right of each widget)
- **⚙️ Settings**: Configure widget parameters
- **📊 Expand**: Open widget in full-screen modal
- **📤 Export**: Export widget data as CSV
- **❌ Hide**: Remove widget from dashboard

#### Dashboard Customization
- **Add Widget** button to add new analytics widgets
- **Drag & Drop** reordering of widgets
- **Save Layout** as personal default
- **Reset to Default** layout option

---

## 6. Portfolio/Positions Page

### 6.1 Page Structure

#### Page Header
- **Title**: "Portfolio Overview"
- **Last Updated**: Real-time timestamp
- **Total Portfolio Value**: Large, prominent display
- **Portfolio P&L Cards** (3 cards):
  1. **Realized P&L**: ₹2,15,670 (closed trades)
  2. **Unrealized P&L**: ₹12,450 (open positions)
  3. **Total P&L**: ₹2,28,120 (combined)

### 6.2 Portfolio Summary Widgets

#### Portfolio Allocation Donut Chart
**Visual Breakdown:**
- **By Asset Class**: Equity (60%), Futures (25%), Options (15%)
- **By Sector**: Technology (22%), Banking (18%), Pharma (12%), etc.
- **By Strategy**: Momentum (35%), Breakout (28%), Swing (20%), etc.
- Click segments to filter positions table

#### Key Portfolio Metrics
```
Total Capital Deployed:    ₹4,85,200
Available Margin:          ₹2,14,800
Portfolio Beta:            1.23
Correlation to NIFTY:      0.78
Max Position Size:         8.5% (RELIANCE)
Number of Positions:       12 open
```

### 6.3 Open Positions Table

#### Table Columns (Responsive Design)

1. **Symbol** (120px)
   - Large, bold text
   - Instrument type icon
   - Click to view symbol analytics

2. **Type** (80px)
   - Badge: "EQ", "FUT", "CE", "PE"
   - Color coded by type

3. **Position** (80px)
   - "LONG" (green) or "SHORT" (red)
   - Position size indicator

4. **Quantity** (100px)
   - Number with units
   - For options: lot count + total units

5. **Avg Entry Price** (120px)
   - Weighted average for multiple entries
   - Currency format

6. **Current Price** (120px)
   - Live price (if available)
   - Manual input if no live feed
   - Last updated time

7. **Unrealized P&L** (140px)
   - Absolute amount + percentage
   - Color coded, large font
   - Include charges allocated

8. **Days Held** (100px)
   - Number of days position is open
   - Calendar days, not trading days

9. **Stop Loss** (120px)
   - Current SL price
   - Distance from current price
   - Edit icon for quick updates

10. **Target** (120px)
    - Target price
    - Distance to target
    - Edit icon for updates

11. **Risk Amount** (120px)
    - Current risk (Current Price - SL) × Qty
    - Risk as % of portfolio

12. **Actions** (140px)
    - **Exit**: Quick exit order
    - **Modify**: Edit SL/Target
    - **View**: Position details
    - **Chart**: Price chart

#### Position Row Interactions
- **Click Row**: Expand to show position details
- **Hover**: Highlight with subtle animation
- **Right-click**: Context menu (Exit, Modify, Chart)

### 6.4 Position Detail Expansion

#### Expanded Row Content (Slides down below selected row)
**Left Section - Trade History:**
```
Entry Legs:
Leg 1: 50 shares @ ₹2,450 on 15-Sep-2025 10:30 AM
Leg 2: 30 shares @ ₹2,465 on 15-Sep-2025 11:45 AM
Leg 3: 20 shares @ ₹2,440 on 16-Sep-2025 09:30 AM

Weighted Avg Entry: ₹2,451.50
Total Investment: ₹2,45,150
```

**Right Section - Current Status:**
```
Current Price: ₹2,487.25 (Last updated: 15:28:45)
Current Value: ₹2,48,725
Unrealized P&L: ₹3,575 (+1.46%)
Days Held: 3 days
Stop Loss: ₹2,420 (-2.7% from current)
Target: ₹2,520 (+1.3% from current)
```

**Action Buttons:**
- **Partial Exit**: Exit specific quantity
- **Full Exit**: Close entire position
- **Modify SL/Target**: Quick adjustment
- **Add to Position**: Buy more at current price
- **View Chart**: Technical analysis

### 6.5 Portfolio Analytics Section

#### Risk Metrics Panel
```
Portfolio Heat:           Medium Risk
Largest Position:         8.5% (RELIANCE - ₹41,250)
Top 3 Positions:         22.7% of portfolio
Sector Concentration:     Technology 22%, Banking 18%
Open Position Risk:       ₹18,450 (total SL risk)
Daily Volatility:         2.3% (based on positions)
Beta-Adjusted Exposure:   1.23x market movement
```

#### Portfolio Performance Chart
- **Time Series**: Portfolio value over time
- **Benchmark Comparison**: vs NIFTY50 performance
- **Drawdown Overlay**: Show portfolio drawdown periods
- **Trade Markers**: Entry/exit points on chart

#### Correlation Matrix (Advanced)
**Heatmap showing correlations between open positions:**
- Color scale: Dark red (-1) to Dark green (+1)
- Diagonal shows 1.0 (self-correlation)
- Identify diversification opportunities
- Warn about high correlation clusters

---

## 7. Settings & Configuration

### 7.1 Settings Navigation (Tabs)

#### Tab Structure
1. **⚙️ General** - Basic app settings
2. **💰 Charges** - Fee and commission rates
3. **🏷️ Tags & Labels** - Strategy and emotion tags
4. **📊 Display** - UI preferences and formats
5. **📤 Export** - Data export preferences
6. **🔔 Alerts** - Notification settings
7. **🔒 Privacy** - Data and security settings

### 7.2 General Settings Tab

#### User Profile Section
```
Full Name:           [John Trader]
Email:              [john@example.com]
Phone:              [+91-9876543210]
Timezone:           [Asia/Kolkata (UTC+5:30)]
Default Currency:   [INR (₹)] dropdown
Trading Start Date: [01-Jan-2024] (for experience calculations)
```

#### Trading Preferences
```
Default Instrument:     [Equity] dropdown
Default Position:       [Buy/Long] radio buttons
Default Lot Size:       
  - Equity: [1] shares
  - Futures: [Auto-detect] checkbox
  - Options: [Auto-detect] checkbox
Auto-calculate Charges: [✓] Enabled
Require Strategy Tag:   [✓] Make strategy tags mandatory
```

#### Data Retention
```
Keep Trade History:     [Forever] dropdown (1yr/2yr/5yr/Forever)
Auto-backup Frequency:  [Weekly] dropdown
Export Format Default: [Excel] dropdown
```

### 7.3 Charges Configuration Tab

#### Brokerage Settings
```
Default Brokerage Model: [Flat per side] radio
  ○ Flat per side: ₹[20.00] per executed side
  ○ Percentage: [0.03]% of turnover
  ○ Slab-based: [Configure Slabs] button

Per-Broker Brokerage (Optional):
[+ Add Broker] button

Broker: [Zerodha] - Equity: ₹20 flat, Options: ₹20 flat, Futures: ₹20 flat
Broker: [ICICI]   - Equity: 0.05%, Options: ₹25 flat, Futures: 0.03%
```

#### Statutory Charges Configuration
**Table Format with Edit Controls:**

| Charge Type | Rate (%) | Applied To | Min Amount | Max Amount | Status |
|-------------|----------|------------|------------|------------|---------|
| STT - Equity Delivery | 0.1000 | Sell Value | ₹0.01 | No Limit | ✓ Active |
| STT - Equity Intraday | 0.0250 | Buy+Sell Value | ₹0.01 | No Limit | ✓ Active |
| STT - Futures | 0.0100 | Sell Value | ₹0.01 | No Limit | ✓ Active |
| STT - Options | 0.0500 | Premium on Sell | ₹0.01 | No Limit | ✓ Active |
| Exchange - NSE Equity | 0.0000325 | Turnover | ₹0.01 | No Limit | ✓ Active |
| Exchange - NSE F&O | 0.0001730 | Turnover | ₹0.01 | No Limit | ✓ Active |
| SEBI Charges | 0.000001 | Turnover | ₹0.01 | No Limit | ✓ Active |
| Stamp Duty | 0.0030 | Turnover | ₹0.01 | No Limit | ✓ Active |

**Actions for each row:**
- **Edit** button: Modify rate, min/max amounts
- **Disable** toggle: Temporarily disable charge
- **Info** icon: Show charge description and legal reference

#### Custom Charges
```
[+ Add Custom Charge] button

Examples:
- DP Charges: ₹15.93 per sell transaction
- GST on Brokerage: 18% of brokerage amount
- Call & Trade: ₹50 per order
```

#### Charges Validation
```
⚠️ Validation Rules:
- Rates must be between 0% and 10%
- Maximum amounts must be greater than minimum
- At least one charge type must be active
- STT rates must match current legal requirements

Last Updated: 15-Sep-2025
Legal Disclaimer: "Rates are user-configurable. Verify with current regulations."
```

### 7.4 Tags & Labels Tab

#### Strategy Tags Management
**Current Strategy Tags:**
```
[Breakout]      [×] 67 trades    Edit | Delete
[Momentum]      [×] 56 trades    Edit | Delete  
[Pullback]      [×] 45 trades    Edit | Delete
[Mean Reversion][×] 34 trades    Edit | Delete
[Scalping]      [×] 89 trades    Edit | Delete
[Swing Trading] [×] 23 trades    Edit | Delete
[News Based]    [×] 12 trades    Edit | Delete
[Chart Pattern][×] 18 trades    Edit | Delete
```

**Add New Strategy Tag:**
```
Tag Name: [________________] (max 20 characters)
Color:    [🔵] Color picker
Description: [Optional description for this strategy...]
[Add Tag] button
```

#### Emotional Tags Management
**Current Emotional Tags:**
```
[Calm]          [×] 89 trades
[Confident]     [×] 67 trades  
[Nervous]       [×] 34 trades
[FOMO]          [×] 23 trades
[Revenge]       [×] 12 trades
[Overconfident] [×] 18 trades
```

#### Market Condition Tags
```
[Trending]      [×] 134 trades
[Range-bound]   [×] 67 trades
[Volatile]      [×] 45 trades
[News Event]    [×] 23 trades
[Normal]        [×] 89 trades
[Pre-Market]    [×] 12 trades
```

#### Tag Analytics
```
Most Used Strategy: Scalping (89 trades)
Most Profitable Tag: Momentum (₹76,800 total P&L)
Least Profitable: Mean Reversion (₹-8,900 total P&L)
Emotional Performance: Calm trades have 72% win rate vs 68% average
```

### 7.5 Display Preferences Tab

#### Number Formatting
```
Currency Symbol:        [₹] dropdown (₹, $, €, £, ¥)
Decimal Places:         [2] dropdown (0, 1, 2, 3, 4)
Thousands Separator:    [Comma] radio (Comma, None, Space)
Negative Numbers:       [Red Color] radio (Red, Parentheses, Minus Sign)

Example: ₹1,25,670.50 vs ₹125670.5 vs ₹1 25 670,50
```

#### Date & Time Format
```
Date Format:            [DD/MM/YYYY] dropdown
Time Format:            [24 Hour] radio (12 Hour, 24 Hour)
Timezone Display:       [Local Time] radio (Local, UTC, Market Time)
Week Start:             [Monday] dropdown

Example: 15/09/2025 14:30 vs 09/15/2025 2:30 PM
```

#### Table Display Options
```
Default Page Size:      [50] dropdown (25, 50, 100, All)
Dense Mode:            [○] Enable compact row spacing
Zebra Striping:        [✓] Alternate row colors
Sticky Headers:        [✓] Keep headers visible when scrolling
Auto-refresh:          [✓] Refresh data every 30 seconds
```

#### Chart Preferences
```
Default Chart Type:     [Line] dropdown
Color Scheme:          [Profit/Loss] dropdown (P&L, Blue/Orange, Custom)
Animation:             [✓] Enable chart animations
Grid Lines:            [✓] Show grid lines
Data Labels:           [○] Show values on charts
```

### 7.6 Export Preferences Tab

#### Default Export Settings
```
File Format:           [Excel (.xlsx)] dropdown (CSV, Excel, PDF)
Include Filters:       [✓] Export shows active filter criteria
Include Charts:        [✓] Include visualizations in reports
File Naming:           [TradeJournal_YYYY-MM-DD] template

Custom Filename Template:
[TradeJournal_][Date Range]_[Filter Applied]
Example: TradeJournal_2025-Sep_EquityOnly.xlsx
```

#### CSV Export Options
```
Delimiter:             [Comma] dropdown (Comma, Semicolon, Tab)
Text Qualifier:        [Double Quote] dropdown
Header Row:            [✓] Include column headers
UTF-8 Encoding:        [✓] Support international characters
```

#### PDF Report Settings
```
Page Size:             [A4] dropdown
Orientation:           [Portrait] radio
Include Logo:          [✓] Add company/personal logo
Include Summary:       [✓] Executive summary on first page
Charts per Page:       [2] dropdown (1, 2, 4)
```

#### Automated Exports
```
Weekly Summary:        [○] Auto-email every Monday
Monthly Report:        [○] Auto-email first of month
Email Recipients:      [john@example.com] (comma separated)
Cloud Backup:          [○] Auto-backup to Google Drive
```

### 7.7 Alerts & Notifications Tab

#### Position Alerts
```
Stop Loss Hit:         [✓] Browser notification + Email
Target Reached:        [✓] Browser notification + Email
Large Loss Alert:      [✓] Notify if single trade loss > ₹[5,000]
Portfolio Drawdown:    [✓] Alert if portfolio down > [5]% from peak
Daily Loss Limit:      [✓] Alert if daily loss > ₹[10,000]
```

#### Performance Alerts
```
Losing Streak:         [✓] Alert after [3] consecutive losses
Overtrading:           [✓] Alert if more than [5] trades in one day
Low Win Rate:          [✓] Alert if weekly win rate < [50]%
High Charges:          [✓] Alert if charges > [2]% of gross profit
```

#### Data Alerts
```
Missing Trade Data:    [✓] Remind to enter trades after market hours
Price Update Required: [✓] Remind to update open position prices
Backup Reminder:       [✓] Weekly backup reminder
```

#### Notification Channels
```
Browser Notifications: [✓] Enabled
Email Notifications:   [✓] Enabled
SMS Alerts:           [○] Disabled (premium feature)
Webhook URL:          [________________] (for integration)
```

---

## 8. Reports & Export Module

### 8.1 Reports Dashboard

#### Report Types (Card Layout)
```
📊 Daily Trading Summary
📈 Weekly Performance Report  
📋 Monthly Analysis Report
💰 Quarterly P&L Statement
📑 Annual Tax Report
🎯 Strategy Performance Report
📊 Risk Assessment Report
📈 Comparative Analysis Report
```

#### Quick Report Generation
**Fast Reports (One-click generation):**
- **Today's Trades**: All trades executed today
- **This Week P&L**: Weekly performance summary  
- **Open Positions**: Current portfolio status
- **Recent Performance**: Last 30 days analysis

### 8.2 Custom Report Builder

#### Report Configuration Panel
```
Report Name: [My Custom Report]
Description: [Weekly momentum strategy analysis]

Data Range:
  From Date: [01-Sep-2025] 
  To Date:   [15-Sep-2025]
  
Filters Applied:
  ✓ Instrument: Options only
  ✓ Strategy: Momentum, Breakout
  ✓ P&L: Winners only
  ○ Holding Period: All
```

#### Report Sections (Drag & Drop Builder)
**Available Sections:**
- **Executive Summary**: Key metrics overview
- **Trade List**: Detailed trade table
- **Performance Charts**: Visual analysis
- **Strategy Breakdown**: Performance by strategy
- **Risk Analysis**: Drawdown and risk metrics
- **Time Analysis**: Day/time performance
- **Charges Summary**: Cost analysis

**Selected Sections (Reorderable):**
1. Executive Summary
2. Performance Charts  
3. Strategy Breakdown
4. Trade List
5. Risk Analysis

#### Report Output Options
```
Format: [PDF] dropdown (PDF, Excel, PowerPoint, HTML)
Layout: [Professional] dropdown (Professional, Detailed, Summary)
Branding: [✓] Include logo and company name
Charts: [✓] High-resolution charts
Raw Data: [○] Include detailed calculations
```

### 8.3 Scheduled Reports

#### Automated Report Schedule
```
Report Name: Weekly Performance Review
Schedule: Every Monday at 9:00 AM
Recipients: john@example.com, manager@company.com
Format: PDF + Excel attachment
Filters: All trades from previous week

[Edit] [Disable] [Delete] [Send Now]
```

#### Report Templates
**Pre-built Templates:**
- **Daily Trader Report**: Quick daily summary
- **Weekly Review**: Comprehensive weekly analysis
- **Monthly Statement**: Detailed monthly performance
- **Quarterly Business Review**: Executive summary
- **Annual Tax Report**: Tax preparation document
- **Strategy Analysis**: Deep dive into specific strategies

### 8.4 Export Data Center

#### Bulk Data Export
```
Export Type: [Complete Database] dropdown
  - Complete Database: All trades and settings
  - Filtered Trades: Current filter applied
  - Date Range: Specific time period
  - Strategy Specific: Selected strategies only
  - Open Positions: Current portfolio only

Format: [Excel] dropdown (Excel, CSV, JSON, XML)
Compression: [✓] ZIP file for large exports
Password Protect: [○] Secure sensitive data
```

#### Data Backup & Restore
```
Last Backup: 15-Sep-2025 at 11:30 PM (automated)
Backup Size: 2.3 MB
Backup Location: Local Download + Cloud Storage

[Create Backup Now] [Schedule Backups] [Restore from Backup]

Backup Schedule: [Weekly] on [Sunday] at [11:00 PM]
Retention: Keep [12] backups (older ones auto-deleted)
Cloud Storage: [Google Drive] connected ✓
```

#### API Export (Advanced)
```
API Endpoint: https://api.tradejournal.com/v1/export
API Key: [Generate New Key] [Copy] [Revoke]
Rate Limit: 100 requests per hour
Webhook URL: [________________] (for real-time updates)

Documentation: [View API Docs] [Download SDK]
```

---

## 9. Data Import & Integration

### 9.1 CSV Import Module

#### Import Interface
```
📁 File Upload Area (Drag & Drop)
"Drag your CSV file here or click to browse"
Supported formats: .csv, .xlsx, .txt
Maximum file size: 10 MB
```

#### Column Mapping Interface
**CSV Preview (First 5 rows):**
```
| Date       | Symbol   | Side | Qty | Price  | Type |
|------------|----------|------|-----|--------|------|
| 15-09-2025 | RELIANCE | BUY  | 100 | 2450.5 | EQ   |
| 15-09-2025 | NIFTY    | SELL | 50  | 19850  | FUT  |
```

**Field Mapping:**
```
CSV Column          →  TradeJournal Field
[Date]              →  [Entry Date] dropdown
[Symbol]            →  [Symbol] dropdown  
[Side]              →  [Position] dropdown
[Qty]               →  [Quantity] dropdown
[Price]             →  [Entry Price] dropdown
[Type]              →  [Instrument] dropdown
[Not Mapped]        →  [Skip Column]
```

#### Import Validation
```
✓ 45 rows processed successfully
⚠️ 3 rows have warnings:
  - Row 12: Invalid date format (15/Sep/2025)
  - Row 28: Unknown symbol (RELIANCEE)
  - Row 35: Missing quantity value

❌ 2 rows failed validation:
  - Row 18: Negative price not allowed
  - Row 42: Exit date before entry date

[Fix Errors] [Import Valid Rows] [Cancel Import]
```

#### Import Options
```
Duplicate Handling: [Skip Duplicates] dropdown
  - Skip Duplicates
  - Overwrite Existing  
  - Create New Records
  - Ask for Each

Default Values:
  Strategy Tag: [Imported] 
  Emotional State: [Not Set]
  Notes: [Imported from [filename]]

Charge Calculation: [✓] Auto-calculate charges for imported trades
```

### 9.2 Broker Integration Templates

#### Popular Broker Formats
**Zerodha (Kite)**
```
Template: Zerodha Tradebook Export
Columns: tradingsymbol, exchange, qty, price, order_type, side, time
Date Format: YYYY-MM-DD HH:MM:SS
Special Handling: 
  - Convert tradingsymbol to standard format
  - Map order_type to instrument type
  - Handle partial fills automatically
```

**ICICI Direct**
```
Template: ICICI Portfolio Export  
Columns: Symbol, Series, Trade Date, Trade Price, Quantity, Transaction Type
Date Format: DD-MMM-YYYY
Special Handling:
  - Parse series code for instrument type
  - Convert transaction type to position
```

**Angel Broking**
```
Template: Angel Back Office Export
Columns: ScripName, TradeDate, TradeTime, BuySell, Quantity, Rate
Special Features:
  - Automatic symbol normalization
  - Time zone conversion
  - Charge breakdown import
```

### 9.3 Real-time Integration (Future Feature)

#### Broker API Connection
```
Broker: [Select Broker] dropdown
API Credentials:
  API Key: [________________]
  Secret Key: [________________]  
  User ID: [________________]

Connection Status: 🔴 Disconnected
[Test Connection] [Connect] [Disconnect]

Auto-sync Settings:
  ○ Manual sync only
  ○ Sync every 15 minutes  
  ○ Real-time sync
  ○ End-of-day sync only
```

#### Sync Configuration
```
Import Settings:
  ✓ New trades automatically
  ✓ Position updates
  ○ Order modifications
  ○ Cancelled orders

Data Validation:
  ✓ Verify against existing trades
  ✓ Flag potential duplicates
  ✓ Auto-calculate charges
  ○ Import broker charges exactly
```

---

## 10. User Experience & Interaction Design

### 10.1 Responsive Design Specifications

#### Desktop Layout (≥1200px)
```
Header: 64px height, fixed position
Sidebar: 240px width, collapsible
Main Content: Remaining width, max 1400px centered
Filter Panel: 280px width when expanded
Grid: 3-4 column layout for cards/widgets
```

#### Tablet Layout (768px - 1199px)  
```
Header: 56px height
Sidebar: Overlay mode, 280px width
Main Content: Full width with padding
Filter Panel: Bottom sheet overlay
Grid: 2 column layout for cards
Tables: Horizontal scroll with sticky columns
```

#### Mobile Layout (<768px)
```
Header: 48px height, hamburger menu
Navigation: Bottom tab bar (5 tabs max)
Content: Single column, full width
Filter Panel: Full-screen overlay
Tables: Card-based layout, vertical stack
Forms: Single column, large touch targets
```

### 10.2 Loading States & Performance

#### Page Load Sequence
```
1. App Shell (Header + Navigation): <200ms
2. Critical Data (Summary metrics): <500ms  
3. Secondary Data (Charts, tables): <1000ms
4. Background Data (Analytics): <2000ms
```

#### Loading Indicators
```
Skeleton Screens: For tables and charts
Progress Bars: For data imports and exports
Spinners: For quick actions (<3 seconds)
Loading Messages: For longer operations

Examples:
- "Loading your trades..." (with progress %)
- "Calculating analytics..." (with spinner)
- "Generating report..." (with progress bar)
```

#### Error States
```
Network Error: Retry button + offline indicator
Data Error: Clear explanation + contact support
Validation Error: Inline messages + fix suggestions
System Error: Friendly message + error code

Error Recovery:
- Auto-retry for network issues
- Save draft data for form errors
- Graceful degradation for missing data
```

### 10.3 Accessibility Features

#### Keyboard Navigation
```
Tab Order: Logical flow through interactive elements
Skip Links: Jump to main content, skip navigation
Focus Indicators: Clear visual focus states
Keyboard Shortcuts:
  - Ctrl+N: New trade
  - Ctrl+E: Export data
  - Ctrl+F: Focus search
  - Esc: Close modals/overlays
```

#### Screen Reader Support
```
ARIA Labels: All interactive elements labeled
ARIA Descriptions: Complex charts and tables
Heading Structure: Proper h1-h6 hierarchy
Alt Text: All images and icons described
Live Regions: Dynamic content updates announced
```

#### Visual Accessibility
```
Color Contrast: WCAG AA compliance (4.5:1 minimum)
Text Size: Minimum 16px, scalable to 200%
Color Coding: Never rely solely on color
High Contrast Mode: Alternative theme available
Reduced Motion: Respect prefers-reduced-motion
```

### 10.4 Performance Optimization

#### Data Loading Strategy
```
Pagination: 50 trades per page default
Virtual Scrolling: For large datasets (>1000 rows)
Lazy Loading: Images and charts load on demand
Caching: Recent data cached for 5 minutes
Prefetching: Likely next pages preloaded
```

#### Real-time Updates
```
WebSocket Connection: For live price updates
Debounced Search: 300ms delay for search queries
Optimistic Updates: UI updates before server confirmation
Background Sync: Sync data when app regains focus
```

---

## 11. Security & Data Privacy

### 11.1 Data Security Measures

#### Data Encryption
```
Data at Rest: AES-256 encryption
Data in Transit: TLS 1.3 encryption
Database: Encrypted fields for sensitive data
Backups: Encrypted backup files
API Keys: Hashed and salted storage
```

#### Access Control
```
Authentication: Email + Password (minimum 8 chars)
Two-Factor Auth: Optional TOTP support
Session Management: 24-hour timeout, secure cookies
Password Policy: Complexity requirements
Account Lockout: 5 failed attempts = 15-min lockout
```

#### Data Privacy
```
Personal Data: Minimal collection, explicit consent
Third-party Sharing: No sharing without consent
Data Retention: User-controlled retention periods
Right to Delete: Complete data deletion option
Data Export: Full data portability
```

### 11.2 Audit & Compliance

#### Audit Trail
```
User Actions: All CRUD operations logged
Data Changes: Before/after values tracked
Login Activity: IP address, device, timestamp
Export Activity: What data, when, by whom
System Events: Errors, performance issues
```

#### Compliance Features
```
GDPR Compliance: EU data protection standards
Data Minimization: Only necessary data collected
Consent Management: Granular privacy controls
Breach Notification: Automated incident reporting
Regular Audits: Security assessment schedules
```

---

## 12. Implementation Phases & Acceptance Criteria

### 12.1 Phase 1: Core Trading Journal (MVP)

#### Scope
- Basic trade entry (equity only)
- Manual charge calculation
- Simple trade listing
- Basic filters (date, symbol, P&L)
- CSV export

#### Acceptance Criteria
```
✓ User can add round-trip equity trade
✓ All charges calculated correctly (±₹0.01 accuracy)
✓ Trade list shows all entered trades
✓ Filters work correctly
✓ CSV export includes all trade data
✓ Form validation prevents invalid data
✓ Responsive design works on mobile
```

#### Success Metrics
- 100% charge calculation accuracy vs manual calculation
- <2 seconds page load time
- Mobile usability score >85%

### 12.2 Phase 2: Advanced Features

#### Scope
- Futures and options support
- Basic analytics dashboard
- Portfolio view
- Advanced filters
- Strategy tag system

#### Acceptance Criteria
```
✓ Options trades with lot size handling
✓ Futures trades with proper calculations  
✓ Analytics match manual calculations
✓ Portfolio shows unrealized P&L correctly
✓ Strategy tags work across all views
✓ Advanced filters apply globally
```

### 12.3 Phase 3: Analytics & Insights

#### Scope
- Complete analytics dashboard
- Performance heatmaps
- Behavioral insights
- Advanced reporting
- Export functionality

#### Acceptance Criteria
```
✓ All analytics metrics match specifications
✓ Heatmaps accurately represent data
✓ Reports generate without errors
✓ Export includes charts and formatting
✓ Insights provide actionable information
```

### 12.4 Final Acceptance Criteria

#### Functional Requirements
```
✓ 100+ test trades processed correctly
✓ All charge types calculate accurately
✓ Analytics match manual verification
✓ All export formats work properly
✓ Performance meets specified benchmarks
✓ Security measures implemented
✓ Accessibility compliance achieved
```

#### Performance Requirements  
```
✓ Page load time <2 seconds
✓ Search results <500ms
✓ Export generation <30 seconds
✓ 99.9% uptime during testing
✓ Support 1000+ concurrent users
```

#### User Experience Requirements
```
✓ Mobile responsiveness verified
✓ Cross-browser compatibility confirmed
✓ User testing feedback addressed
✓ Documentation completed
✓ Training materials provided
```

---

## 13. Appendix

### 13.1 Sample Data Formats

#### CSV Import Format
```
date,symbol,instrument,position,quantity,entry_price,exit_price,strategy,notes
2025-09-15,RELIANCE,EQUITY,BUY,100,2450.50,2485.75,Breakout,"Strong volume breakout"
2025-09-15,NIFTY25SEP19850CE,OPTIONS,SELL,50,125.50,87.25,Momentum,"Sold calls on resistance"
```

#### API Response Format
```json
{
  "trade_id": "TRD-2025-001247",
  "entry_date": "2025-09-15T10:30:00Z",
  "symbol": "RELIANCE",
  "instrument": "EQUITY",
  "position": "BUY",
  "quantity": 100,
  "entry_price": 2450.50,
  "exit_price": 2485.75,
  "gross_pnl": 3525.00,
  "charges": {
    "brokerage": 40.00,
    "stt": 248.58,
    "exchange": 8.54,
    "total": 312.42
  },
  "net_pnl": 3212.58
}
```

### 13.2 Calculation Examples

#### Complex Options Trade Example
```
Trade: Sold NIFTY 19800 Call, 3 lots
Entry Premium: ₹125.50 per share
Exit Premium: ₹87.25 per share  
Lot Size: 50 shares per lot
Quantity: 3 lots = 150 shares

Calculations:
Entry Value = 125.50 × 150 = ₹18,825
Exit Value = 87.25 × 150 = ₹13,087.50
Turnover = 18,825 + 13,087.50 = ₹31,912.50
Gross P&L = 18,825 - 13,087.50 = ₹5,737.50

Charges:
Brokerage = ₹20 × 2 = ₹40.00
STT = 18,825 × 0.0005 = ₹9.41  
Exchange = 31,912.50 × 0.0003503 = ₹11.18
SEBI = 31,912.50 × 0.000001 = ₹0.03
Stamp = 31,912.50 × 0.00003 = ₹0.96
Total Charges = ₹61.58

Net P&L = 5,737.50 - 61.58 = ₹5,675.92
```

### 13.3 Browser Compatibility

#### Supported Browsers
```
Desktop:
- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile:
- Chrome Mobile 90+
- Safari iOS 14+
- Samsung Internet 14+

Not Supported:
- Internet Explorer (all versions)
- Chrome <90
- Firefox <88
```

### 13.4 System Requirements

#### Minimum Requirements
```
Hardware:
- 4GB RAM minimum
- 1GB available storage
- 1920×1080 screen resolution

Network:
- Broadband internet connection
- 1 Mbps minimum speed
- Low latency (<100ms) preferred

Software:
- Modern web browser (see compatibility)
- JavaScript enabled
- Cookies enabled
- Local storage available
```

---

**End of Document**

*This PRD serves as the complete functional specification for the Trade Journal application. All features, calculations, and user interactions are defined in detail to ensure accurate implementation and testing.*