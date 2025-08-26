# Claude Code Implementation Prompt

Build a Sports Betting Platform application: **Admin Approval Platform**

## Domain Analysis
- **Detected Domain**: Sports-gaming
- **Domain Confidence**: 100%
- **Matched Keywords**: game, square, admin, request, name, player, user, display, display, login, request, view, remove, score
- **Original Requirements**: "# **BV Squares - MVP Requirements**

## 📋 **OVERVIEW**
Web application for managing sports betting squares. Players register and request squares on game grids. Admins approve requests, assign random numbers, and update scores to determine winners. No payments - display names shown in squares for identification.

---

## 🎯 **BUSINESS REQUIREMENTS**

### **MVP Scope**
- Core sports squares game functionality with admin approval system
- Basic user registration (username/password/display name)
- Game creation and management by admins
- Square requesting with approval workflow
- Manual score updates and winner determination

### **Excluded from MVP**
- ❌ Payments ❌ Analytics ❌ Communications ❌ Social features

---

## ⚡ **FUNCTIONAL REQUIREMENTS**

### **1. User Authentication**
- Players: username/password/display name registration, separate login page
- Admins: separate login system, manual account creation only
- Display names shown in squares, must be unique
- Separate session management for each user type

### **2. Game Management (Admin)**
- Create/edit games for football, basketball, soccer
- Games have Setup/Active/Completed states
- Fixed 10x10 grid (100 squares)
- Include payout structure for reference (no actual payments)

### **3. Square Request System**
- Players request squares (multiple per game allowed)
- Requests show as "requested" with display name until admin approval
- Players can cancel their own pending requests (before approval only)
- Admin approves/rejects requests individually
- Once approved, only admin can remove squares from players
- Only approved squares count as owned
- Grid shows: available, requested (with name), approved (with name)
- Error handling: prevent duplicate requests on same square

### **4. Game Information**
- Public pages with game details, rules, payout structure
- All users can browse games without logging in

### **5. Scoring & Winners**
- No game score information will be displayed
- Winners calculated by last digit of each team's score
- Support multiple payout periods (quarters, halftime, final)
- Results immediately visible to all users

### **6. Number Assignment**
- Admin triggers random 0-9 assignment to rows/columns
- Only after squares are approved
- Once numbers are assigned, they cannot be changed
- Error handling: prevent assignment if no approved squares

---

## 👥 **USER REQUIREMENTS**

### **Player User Requirements**

**Registration and Login:**
- Account creation with username, password, display name
- Login/logout with session management
- Separate player login page from admin

**Game Discovery:**
- Browse all available games with basic filtering (sport, status)
- View game details before participating

**Square Selection:**
- View interactive 10x10 grid
- See available, requested (with names), approved (with names) squares
- Request squares with click/tap
- Cancel pending requests only (before approval)
- See own display name in "requested" squares while awaiting approval

**Game Participation:**
- Understand game rules and payout structure
- View winning squares and results

**User Experience:**
- Mobile-friendly interface with clear error messages

### **Admin User Requirements**

**Admin Authentication:**
- Separate admin login/logout with distinct interface
- Secure session management

**Game Creation:**
- Create games with team names, dates, sport types
- Add descriptions, rules, payout structures
- Save drafts and publish when ready

**Square Request Management:**
- Review pending requests with player display names
- Approve/reject individual requests with optional rejection reasons
- Remove approved squares from players if needed
- See which names are requesting which squares

**Game Management:**
- View/edit all games before activation
- Monitor request/approval progress
- Assign random numbers and manage game status

**Scoring:**
- No game score information displayed
- View results by payout period, mark games completed

**Administration:**
- Dashboard with game overview
- Basic user management

---

## 📱 **PAGES**

**Public:** / (home), /login, /register, /admin/login, /games, /games/{id}/info, /games/{id}/grid, /games/{id}/results

**Player:** /dashboard

**Admin:** /admin, /admin/games, /admin/games/new, /admin/games/{id}/edit, /admin/games/{id}/requests, /admin/games/{id}/manage, /admin/games/{id}/scoring, /admin/requests

---

## ✅ **ACCEPTANCE CRITERIA**

- [ ] Separate player/admin authentication with logout functionality
- [ ] Players can request squares, cancel pending requests, but not remove approved squares
- [ ] Admins can approve/reject individual requests and remove approved squares
- [ ] Grid shows three states: available, requested (with names), approved (with names)
- [ ] Game creation, number assignment, and scoring work end-to-end
- [ ] Basic filtering and mobile-friendly interface"

**Domain-Specific Enhancements Applied**: Component names and features have been tailored to the sports-gaming domain for better relevance and user experience.


## Project Overview
- **Type**: Sports Betting Platform
- **Features**: Admin Panel, Mobile Responsive Design, Authentication, User Management, Dashboard, Game Management, Square Management, Admin Management
- **Database**: DynamoDB
- **Authentication**: AWS Cognito
- **AWS Services**: AWS Lambda, API Gateway, DynamoDB, AWS Cognito

## Tech Stack
- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: AWS Lambda + API Gateway + DynamoDB
- **Authentication**: AWS Cognito
- **Deployment**: Serverless Framework

## Complete File Structure (MUST CREATE ALL)
```
src/components/
src/components/ui/
src/components/layout/
src/components/pages/
src/utils/
src/types/
src/hooks/
src/services/
src/styles/
src/types/entities/
src/services/entities/
src/components/entities/
src/components/game/
src/components/square/
src/components/admin/

Core Files:
src/components/ui/BaseCard.tsx
src/components/ui/Button.tsx
src/components/ui/Modal.tsx
src/components/ui/FormField.tsx
src/components/ui/LoadingSpinner.tsx
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/components/layout/Navigation.tsx
src/components/layout/Sidebar.tsx
src/utils/apiClient.ts
src/utils/validation.ts
src/utils/formatters.ts
src/types/index.ts
src/hooks/useApi.ts
src/hooks/useAuth.ts

Configuration Files:
tsconfig.json
next.config.js
tailwind.config.js
package.json
jest.config.js
.eslintrc.json
```

## UI/UX Design System

### Color Palette
**Primary Colors**: #3B82F6, #1D4ED8, #1E40AF
**Secondary Colors**: #8B5CF6, #7C3AED, #6D28D9
**Semantic Colors**: Success: #10B981, Error: #EF4444, Warning: #F59E0B

### Typography
**Primary Font**: Inter, sans-serif
**Font Sizes**: xs: 0.75rem, base: 1rem, lg: 1.125rem, xl: 1.25rem

### Component Standards

#### Button Component (REQUIRED)
**Variants**: 
- Primary: Background #3B82F6, Color #FFFFFF
- Secondary: Background transparent, Border 1px solid #3B82F6

**Sizes**: 
- Small: 0.5rem 1rem, 0.875rem
- Medium: 0.75rem 1.5rem, 1rem

#### Form Standards
**Input Styling**: Border 1px solid #9CA3AF, Padding 0.75rem
**Error State**: Border 1px solid #EF4444
**Validation**: Real-time validation enabled

## Responsive Design Requirements

### Mobile (100%)
- Layout: stacked
- Navigation: hamburger_menu
- Touch targets: 44px minimum

### Tablet
- Layout: grid_2_column
- Navigation: tab_bar
- Content width: 90%

### Desktop
- Layout: grid_multi_column
- Navigation: horizontal_menu
- Content width: 80%

## Accessibility Requirements (WCAG AA)
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Indicators**: Visible focus states required
- **Text Scaling**: Support up to 200% zoom

## Core Features Implementation


### 1. Admin Panel
**Required Components**:
- Page: `src/components/pages/AdminPanelPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 2. Mobile Responsive Design
**Required Components**:
- Page: `src/components/pages/MobileResponsiveDesignPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 3. Authentication
**Required Components**:
- Page: `src/components/pages/AuthenticationPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 4. User Management
**Required Components**:
- Page: `src/components/pages/UserManagementPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 5. Dashboard
**Required Components**:
- Page: `src/components/pages/DashboardPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 6. Game Management
**Required Components**:
- Page: `src/components/pages/GameManagementPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 7. Square Management
**Required Components**:
- Page: `src/components/pages/SquareManagementPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling

### 8. Admin Management
**Required Components**:
- Page: `src/components/pages/AdminManagementPage.tsx`
- UI Components: Follow design system standards
- API Integration: Use `src/hooks/useApi.ts`

**UI Requirements**:
- Implement responsive design for all breakpoints
- Follow accessibility guidelines (WCAG AA)
- Use design system color palette and typography
- Include loading states and error handling


## Required TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    // IMPORTANT: Prevent build errors
    "noUnusedLocals": false,
    "exactOptionalPropertyTypes": false
  }
}
```

## Tailwind Configuration (Design System Integration)
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          0: '#3B82F6',
          1: '#1D4ED8',
          2: '#1E40AF'
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B'
      },
      fontFamily: {
        sans: ['Inter, sans-serif']
      }
    }
  }
};
```

## Critical Implementation Notes
1. **MUST create all files in file structure** - prevents import errors
2. **Follow exact color palette** - ensures design consistency
3. **Implement responsive breakpoints** - mobile-first approach
4. **Include accessibility features** - WCAG AA compliance required
5. **Use TypeScript interfaces** - prevent build errors
6. **NO private methods in object literals** - causes TypeScript errors

## Success Criteria
- ✅ All components render without errors
- ✅ Responsive design works on all screen sizes
- ✅ Accessibility standards met (WCAG AA)
- ✅ Design system consistently applied
- ✅ TypeScript builds successfully
- ✅ Ready for deployment

Build this application step by step, ensuring each component follows the design system and accessibility requirements.

## Entity Implementation Guide

When implementing data operations:
1. Use exact entity and field names from the data model above
2. Implement field validation at both frontend and backend layers
3. Respect relationship constraints and cascade rules
4. Follow the entity lifecycle permissions for CRUD operations
5. Use the field consistency mappings to ensure data integrity


IMPORTANT: If entity relationships are defined above, they are MANDATORY for proper data consistency and must be implemented exactly as specified.