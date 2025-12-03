# TypeScript to JavaScript Conversion Plan

## Project: campus-connect-hub
**Date:** November 24, 2025
**Total Files to Convert:** 117+ TypeScript files

---

## PHASE 1: MAIN CONFIG FILES (Priority: CRITICAL)

These files control the entire build system and must be converted first:

### 1. `vite.config.ts` → `vite.config.js`
**Location:** Root directory
**Changes Required:**
- Remove type annotations from function parameters: `({ mode })` stays as-is (no change needed)
- Change file extension in module imports (none needed for this file)
- Remove `import type` statements (none present)
- Keep all other code as-is

**Conversion Strategy:**
```javascript
// Before: import type parameters and defineConfig type
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // ... rest stays the same
}));

// After: Same, just remove type annotations if any
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // ... rest stays the same
}));
```

---

### 2. `tailwind.config.ts` → `tailwind.config.js`
**Location:** Root directory
**Changes Required:**
- Remove `import type { Config } from "tailwindcss"`
- Remove `satisfies Config` from export statement
- Keep the configuration object as-is

**Key Changes:**
- Remove: `import type { Config } from "tailwindcss";`
- Remove: `} satisfies Config;` → Replace with `};`

---

### 3. `eslint.config.js` → Modify in-place (already .js)
**Location:** Root directory
**Changes Required:**
- Update file patterns from `"**/*.{ts,tsx}"` to `"**/*.{js,jsx}"`
- Remove `tseslint` references
- Simplify ESLint configuration to use standard JS rules

**Conversion Strategy:**
```javascript
// Before:
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    // ...
  }
);

// After:
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended],
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
```

---

### 4. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
**Action:** DELETE or KEEP as-is (not needed in JS-only project, but safe to keep)
- Can be left as-is if you want future migration options
- Or delete entirely to clean up

---

### 5. `src/vite-env.d.ts`
**Action:** DELETE
- Type definition file, no longer needed in JavaScript project

---

## PHASE 2: CORE SOURCE FILES

### A. Main Entry Point
**File:** `src/main.tsx` → `src/main.jsx`
**Changes:**
- Remove the non-null assertion operator `!`
- Update import paths from `.tsx` to `.jsx`

**Example:**
```javascript
// Before:
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// After:
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
```

---

### B. App Root Component
**File:** `src/App.tsx` → `src/App.jsx`
**Changes:**
- Remove all type annotations
- Update all import paths from `.tsx` to `.jsx`
- Remove `: React.ReactNode` or similar type annotations
- Keep JSX syntax as-is

**Pattern for this file:**
- All 26 page imports: change `.tsx` to `.jsx`
- Remove any type annotations from component definition
- Keep route configuration as-is

---

## PHASE 3: COMPONENTS (60+ files)

### Directory: `src/components/`

**Main Components (8 files):**
1. `EventCard.tsx` → `EventCard.jsx`
2. `EventsSection.tsx` → `EventsSection.jsx`
3. `Features.tsx` → `Features.jsx`
4. `Footer.tsx` → `Footer.jsx`
5. `Hero.tsx` → `Hero.jsx`
6. `Navbar.tsx` → `Navbar.jsx`
7. `NavLink.tsx` → `NavLink.jsx`
8. `ProtectedRoute.tsx` → `ProtectedRoute.jsx`

**Conversion for Main Components:**
- Remove type definitions for props
- Remove generic parameters from React functions (e.g., `React.FC<Props>` → just function)
- Update imports from `.tsx` to `.jsx`
- Keep JSX structure completely unchanged

**Example Pattern:**
```javascript
// Before:
import React from 'react';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ title, description, onClick }) => {
  return (
    <Button onClick={onClick}>{title}</Button>
  );
};

export default EventCard;

// After:
import React from 'react';
import { Button } from '@/components/ui/button';

const EventCard = ({ title, description, onClick }) => {
  return (
    <Button onClick={onClick}>{title}</Button>
  );
};

export default EventCard;
```

---

### Sub-directory: `src/components/ui/` (58 shadcn UI components)

All files follow the same pattern:
- `.tsx` → `.jsx`
- Remove type annotations and interfaces
- Remove `React.FC<T>` declarations
- Update all internal imports from `.tsx` to `.jsx`

**Files in ui directory:**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, use-toast

**Special case - `use-toast.ts` in ui directory:**
- Convert to `use-toast.js`
- Remove type annotations from export

---

## PHASE 4: CONTEXT (1 file)

**File:** `src/context/AuthContext.tsx` → `src/context/AuthContext.jsx`

**Conversion Pattern:**
```javascript
// Before:
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userType: "user" | "admin" | null;
  userName: string | null;
  userEmail: string | null;
  login: (type: "user" | "admin", name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "admin" | null>(null);
  // ...
};

// After:
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  // ...
};
```

---

## PHASE 5: HOOKS (12 files)

**Directory:** `src/hooks/`

**Files to Convert:**
1. `use-mobile.tsx` → `use-mobile.jsx`
2. `use-toast.ts` → `use-toast.js`
3. `useClubApplications.ts` → `useClubApplications.js`
4. `useClubs.ts` → `useClubs.js`
5. `useEventNotifications.ts` → `useEventNotifications.js`
6. `useEvents.ts` → `useEvents.js`
7. `useGroupRegistrations.ts` → `useGroupRegistrations.js`
8. `useOpportunities.ts` → `useOpportunities.js`
9. `usePayments.ts` → `usePayments.js`
10. `useRegistrations.ts` → `useRegistrations.js`
11. `useResumeAnalysis.ts` → `useResumeAnalysis.js`
12. `useTickets.ts` → `useTickets.js`

**Conversion Pattern:**
```javascript
// Before (useEvents.ts):
import { useState, useEffect } from 'react';
import { eventService, Event } from '@/services/eventService';

export const useEvents = (category?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    // ...
  };
};

// After (useEvents.js):
import { useState, useEffect } from 'react';
import { eventService } from '@/services/eventService';

export const useEvents = (category) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const addEvent = (eventData) => {
    // ...
  };
};
```

**Key Removals:**
- Generic type parameters: `<Event[]>` → remove
- Optional parameters: `category?` → `category`
- Type imports: remove `Event` from imports
- Utility types: `Omit<Event, ...>` → just `eventData`

---

## PHASE 6: SERVICES (10 files)

**Directory:** `src/services/`

**Files to Convert:**
1. `clubApplicationService.ts` → `clubApplicationService.js`
2. `clubService.ts` → `clubService.js`
3. `emailService.ts` → `emailService.js`
4. `eventService.ts` → `eventService.js`
5. `groupRegistrationService.ts` → `groupRegistrationService.js`
6. `opportunityService.ts` → `opportunityService.js`
7. `paymentService.ts` → `paymentService.js`
8. `registrationService.ts` → `registrationService.js`
9. `resumeAnalysisService.ts` → `resumeAnalysisService.js`
10. `ticketService.ts` → `ticketService.js`

**Conversion Pattern:**
```javascript
// Before:
export interface Event {
  id: string;
  title: string;
  category: string;
  date: Date;
  registrations: number;
}

export const eventService = {
  getAllEvents: (): Event[] => {
    return JSON.parse(localStorage.getItem('events') || '[]');
  },

  addEvent: (event: Omit<Event, 'id' | 'createdAt'>): Event => {
    // ...
  }
};

// After:
export const eventService = {
  getAllEvents: () => {
    return JSON.parse(localStorage.getItem('events') || '[]');
  },

  addEvent: (event) => {
    // ...
  }
};
```

**Key Changes:**
- Remove all `export interface` definitions
- Remove type annotations from function parameters and returns
- Remove generic types
- Keep all logic and localStorage operations exactly as-is
- Remove type exports

---

## PHASE 7: UTILITY FILES (2 files)

**Directory:** `src/utils/`

**Files to Convert:**
1. `initializeSampleData.ts` → `initializeSampleData.js`

**Directory:** `src/lib/`

**Files to Convert:**
1. `utils.ts` → `utils.js`

**Example - utils.ts:**
```javascript
// Before:
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// After:
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

---

## PHASE 8: PAGES (28+ files)

**Directory:** `src/pages/`

**All Page Files (`.tsx` → `.jsx`):**
1. AdminAddCampusDrive.tsx
2. AdminAddClub.tsx
3. AdminAddEvent.tsx
4. AdminAddOpportunity.tsx
5. AdminDashboard.tsx
6. CampusDriveDetail.tsx
7. CampusDrives.tsx
8. ClubDetail.tsx
9. Community.tsx
10. CreateAccountNow.tsx
11. EventDetails.tsx
12. Events.tsx
13. Hackathons.tsx
14. Index.tsx
15. JoinClub.tsx
16. Login.tsx
17. MyPayments.tsx
18. MyTickets.tsx
19. NotFound.tsx
20. Opportunities.tsx
21. OpportunityDetail.tsx
22. PaymentCheckout.tsx
23. PaymentSuccess.tsx
24. Placements.tsx
25. Resources.tsx
26. ResumeAnalysis.tsx
27. Signup.tsx
28. UserDashboard.tsx
29. Workshops.tsx

**Conversion Pattern (same as components):**
- Remove all type annotations from component props
- Remove `React.FC<T>` or component generics
- Remove interface definitions for component props
- Update all internal imports from `.tsx` to `.jsx` and `.ts` to `.js`
- Keep all JSX structure unchanged

---

## PHASE 9: UPDATE IMPORTS ACROSS ALL FILES

This must be done systematically. For each converted file, update all imports:

### Import Path Changes:
- `.tsx` → `.jsx` (all component imports)
- `.ts` → `.js` (all service/hook/util imports)
- Remove `type` imports and exports
- Remove type-only imports

### Examples of Import Updates:

```javascript
// Before:
import type { Event } from '@/services/eventService';
import { EventCard } from '@/components/EventCard';
import { useEvents } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

// After:
import { EventCard } from '@/components/EventCard.jsx';
import { useEvents } from '@/hooks/useEvents.js';
import { cn } from '@/lib/utils.js';
```

---

## PHASE 10: PACKAGE.JSON UPDATES (Optional but Recommended)

**Changes to package.json:**

Remove TypeScript-related dev dependencies:
- `@types/react`
- `@types/react-dom`
- `@types/node`
- `typescript`
- `typescript-eslint`

Updated scripts (optional):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

Note: This step is optional. Keeping TypeScript dependencies won't break anything.

---

## SUMMARY OF FILES TO CONVERT

### By Category:

| Category | Count | New Extension |
|----------|-------|---|
| Config Files (root) | 3 | .js |
| Components (main) | 8 | .jsx |
| Components (ui) | 58 | .jsx |
| Context | 1 | .jsx |
| Hooks | 12 | .js/.jsx |
| Services | 10 | .js |
| Pages | 29 | .jsx |
| Utils/Lib | 2 | .js |
| Main Entry | 1 | .jsx |
| App Root | 1 | .jsx |
| **TOTAL** | **~125** | **.js/.jsx** |

### Files to DELETE:
- `src/vite-env.d.ts` (type definitions)
- `tsconfig*.json` (optional - can keep)

---

## CONVERSION PRIORITY ORDER

1. **First:** Config files (vite, tailwind, eslint)
2. **Second:** Core entry files (main.jsx, App.jsx)
3. **Third:** Utility files (lib, utils)
4. **Fourth:** Services (shared business logic)
5. **Fifth:** Hooks (used by components)
6. **Sixth:** Context (AuthContext)
7. **Seventh:** UI Components (dependencies)
8. **Eighth:** Main Components (depend on UI)
9. **Ninth:** Pages (depend on all above)

---

## COMMON PATTERNS TO REMOVE

### 1. Type Annotations
```typescript
// Remove: const variable: Type = value;
const count: number = 0;
// Becomes:
const count = 0;
```

### 2. Function Parameter Types
```typescript
// Remove type annotations
const add = (a: number, b: number): number => a + b;
// Becomes:
const add = (a, b) => a + b;
```

### 3. React Component Types
```typescript
// Remove these:
const MyComponent: React.FC<Props> = (props) => { ... }
// Becomes:
const MyComponent = (props) => { ... }
```

### 4. Interface and Type Declarations
```typescript
// Remove entirely:
interface Props {
  title: string;
  onClick: () => void;
}
// No replacement needed - just use destructuring
```

### 5. Generic Types
```typescript
// Remove angle brackets:
const [items, setItems] = useState<Item[]>([]);
// Becomes:
const [items, setItems] = useState([]);
```

### 6. Type Imports
```typescript
// Remove:
import type { Event } from '@/services/eventService';
import { type ClassValue } from 'clsx';

// Keep only:
import { EventCard } from '@/components/EventCard';
```

### 7. Union Types with Type Keywords
```typescript
// Remove 'type' keyword and type definitions:
type UserRole = 'user' | 'admin';
// Just use the literal values in code
```

### 8. Satisfies Operator
```typescript
// Remove:
const config = { ... } satisfies Config;
// Becomes:
const config = { ... };
```

---

## VALIDATION CHECKLIST

After conversion, verify:

- [ ] All `.tsx` files converted to `.jsx`
- [ ] All `.ts` files converted to `.js`
- [ ] All import paths updated (remove type imports)
- [ ] File extensions in imports match new files
- [ ] No `interface` keyword remains in source files
- [ ] No `type` keyword remains (except in type narrowing)
- [ ] No generic parameters with `<>` in React components
- [ ] No type assertions with `as Type` or `as const`
- [ ] No optional chaining with `?.!` 
- [ ] No non-null assertions with `!`
- [ ] ESLint config updated to support `.js/.jsx`
- [ ] vite.config converted and working
- [ ] tailwind.config converted
- [ ] `npm run build` succeeds
- [ ] `npm run dev` runs without errors
- [ ] `npm run lint` passes

---

## EXECUTION NOTES

1. **Batch by Folder:** Convert all files in one directory before moving to next
2. **Update Imports:** After converting a file, update all files that import from it
3. **Test Incrementally:** After each phase, try `npm run build` to catch import errors early
4. **Search and Replace:** Use VS Code find/replace to update multiple imports at once
5. **Extension Changes:** When renaming files, check all import statements
6. **Config Files:** These must be converted first - they control the entire build

---

## ROLLBACK STRATEGY

If issues arise:
1. Git history is preserved - can revert anytime
2. TypeScript dependencies can be reinstalled
3. Original `.tsx`/`.ts` files can be restored from git
4. Keep TypeScript in devDependencies during transition

---

**Next Steps:** Execute phase by phase, starting with config files.
