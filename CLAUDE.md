# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Description

SideBling is a business idea generation platform that helps users discover entrepreneurial opportunities based on their hobbies and interests. Users enter what they enjoy doing in their free time, and the application generates potential business ideas related to those interests. The name "SideBling" suggests turning side interests into profitable ventures.

## Development Commands

```bash
# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Generate static site
npm run generate

# Type checking (no script available, use directly)
npx nuxi typecheck
```

## Architecture Overview

This is a Nuxt 3 business idea generation application with a single-page interface. The entire application logic resides in `pages/index.vue`.

### Key Technical Details

- **Framework**: Nuxt 3.18.1 with Vue 3.5.18 Composition API
- **Routing**: File-based routing (currently single page at `/`)
- **Styling**: Scoped CSS with no external UI framework
- **Assets**: SVG assets served from `localhost:3845` (external asset server)
- **State Management**: Local component state using Vue refs

### Component Structure

The main page (`pages/index.vue`) contains:
- **Navbar**: Logo and navigation menu
- **Hero Section**: CTA container with floating label textfield and "Show me the money" button
- **Footer Cards**: Horizontally scrollable cards displaying hobby/interest examples

### Design System

Color constants defined in the component:
- Primary: `#009358` (main green background)
- Panel BG: `#00A160` (CTA container background)
- Textfield Stroke: `#00d37e` (input border)

### Important Implementation Details

1. **Floating Label Pattern**: Custom implementation with transform animations - label moves up when field is focused or has value

2. **Responsive Breakpoint**: Mobile styles apply at 768px width, stacking CTA elements vertically

3. **Data Structure**: Hobbies array contains 10 predefined example statements for the footer cards

4. **External Dependencies**: The app references localhost:3845 for asset serving - ensure this server is running for proper asset display

### Current State

The application is a polished UI prototype with:
- Complete responsive landing page design
- Interactive floating label text input
- Static example data (10 hobby statements)
- No backend API integration yet
- No actual business idea generation logic implemented

When modifying this codebase, maintain the existing Vue 3 Composition API patterns and keep all styling scoped to components.