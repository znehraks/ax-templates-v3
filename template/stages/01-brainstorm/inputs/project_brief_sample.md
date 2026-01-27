# Project Brief: SimpleNotes

> A minimal note-taking app for testing the claude-symphony pipeline.
> This is a sample project brief demonstrating the expected format and content.

## Overview

SimpleNotes is a minimalist note-taking application with basic CRUD (Create, Read, Update, Delete) functionality. The app stores notes locally in the browser using LocalStorage, requiring no backend infrastructure.

## Target Users

- Anyone who wants quick, simple note-taking
- Users who prefer lightweight applications without cloud sync
- Developers testing the claude-symphony pipeline

## Core Features (MVP - 3 Features Only)

1. **Note Creation and Saving**
   - Text-based note composition
   - Auto-save to LocalStorage
   - Timestamp on creation

2. **Note List Display**
   - View all saved notes in a list
   - Show note title/preview
   - Most recent notes first

3. **Note Deletion**
   - Delete individual notes
   - Confirmation before deletion
   - Immediate removal from list

## Technical Constraints

| Category | Requirement |
|----------|-------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Storage | Browser LocalStorage (no database) |
| Architecture | Single Page Application (SPA) |
| Bundler | Vite |
| Testing | Vitest + Playwright |

## Non-Goals (Explicitly Out of Scope)

- User authentication
- Cloud sync/backup
- Rich text editing (Markdown only if time permits)
- Mobile app (web responsive only)
- Real-time collaboration

## Success Criteria

### Functional Requirements
- [ ] User can create a new note with title and content
- [ ] User can view a list of all notes
- [ ] User can delete a note
- [ ] Notes persist after page refresh (LocalStorage)

### Non-Functional Requirements
- [ ] Page loads in under 2 seconds
- [ ] Works on Chrome, Firefox, Safari (latest versions)
- [ ] Responsive design (desktop and mobile web)
- [ ] Accessibility: keyboard navigation, ARIA labels

## Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Sprint 1 | Week 1 | Core CRUD implementation |
| Sprint 2 | Week 2 | UI/UX polish and styling |
| Sprint 3 | Week 3 | Testing and deployment |

## Design Preferences

### Visual Style
- **Theme**: Minimal, clean, monochromatic
- **Background**: White (#FFFFFF) or light gray (#F9FAFB)
- **Text**: Dark gray (#1F2937) or black (#000000)
- **Accent**: Blue (#3B82F6) for interactive elements
- **Font**: Inter or system default sans-serif

### Layout
- Single column layout
- Fixed header with app title
- Note input form at top
- Scrollable note list below
- Each note card with title, preview, and delete button

### Interaction
- Minimal animations (subtle transitions only)
- Clear visual feedback on actions
- Simple confirmation dialogs
- No complex navigation

## Reference Projects (Optional)

- [Simplenote](https://simplenote.com/) - Inspiration for simplicity
- [Standard Notes](https://standardnotes.com/) - Clean design reference

---

## How to Use This Sample

1. Copy this file to your project's `stages/01-brainstorm/inputs/project_brief.md`
2. Modify the content to match your actual project
3. Ensure all required sections are filled:
   - Overview
   - Core Features (keep to 3-5 for MVP)
   - Technical Constraints
   - Success Criteria
4. Run `/run-stage 01-brainstorm` to start the pipeline

## Required Sections Checklist

- [x] Overview
- [x] Target Users
- [x] Core Features (MVP)
- [x] Technical Constraints
- [x] Non-Goals
- [x] Success Criteria
- [x] Timeline
- [x] Design Preferences
