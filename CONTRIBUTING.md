# Contributing to Mingle

Thank you for your interest in contributing to Mingle! This document provides guidelines for testing and contributing to the project.

## Before You Submit a Pull Request

### 1. Local Testing Requirements

Before submitting a PR, ensure you have tested your changes thoroughly:

#### ✅ Multi-Browser Testing

Test your changes in **at least two browsers**:

- **Chrome/Edge** (Chromium-based)
- **Firefox**
- **Safari** (if on macOS)

#### ✅ Responsive Design Testing

Test on multiple screen sizes:

- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x667, 414x896

Use browser DevTools (F12) to test different viewport sizes.

#### ✅ Feature Testing

Depending on your changes, test relevant features:

- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Chat functionality
- [ ] Navigation and routing
- [ ] Form validation
- [ ] Error handling

### 2. Code Quality

#### TypeScript

Ensure no TypeScript errors:

```bash
npx tsc --noEmit
```

#### Build

Verify the project builds successfully:

```bash
npm run build
```

#### Linting (if configured)

Run linting checks:

```bash
npm run lint
```

### 3. Database Changes

If you've modified the Prisma schema:

```bash
# Generate new Prisma Client
npx prisma generate

# Create a migration (for production)
npx prisma migrate dev --name your_migration_name

# Or push changes (for development)
npx prisma db push
```

### 4. Environment Variables

If you've added new environment variables:

1. Update `.env.example` with the new variables
2. Document them in `SETUP.md`
3. Mention them in your PR description

## Testing Checklist

Use this checklist when testing your changes:

### Authentication & Authorization

- [ ] Sign up works with valid data
- [ ] Sign up fails with invalid data (proper error messages)
- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials (proper error messages)
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated
- [ ] Session persists across page refreshes
- [ ] Session persists across browser tabs

### User Profile

- [ ] Profile creation works
- [ ] Profile editing saves changes
- [ ] Gender values work correctly (MALE, FEMALE, NON_BINARY, OTHER)
- [ ] Gender preferences work correctly (MALE, FEMALE, NON_BINARY, EVERYONE)
- [ ] Profile pictures upload and display correctly
- [ ] Form validation works (required fields, format validation)

### UI/UX

- [ ] All buttons are clickable and functional
- [ ] Forms are user-friendly and accessible
- [ ] Error messages are clear and helpful
- [ ] Loading states are displayed appropriately
- [ ] Success messages appear after successful actions
- [ ] Navigation is intuitive
- [ ] Mobile menu works correctly (if applicable)
- [ ] No layout breaks on different screen sizes

### Performance

- [ ] Pages load within reasonable time
- [ ] No console errors in browser DevTools
- [ ] No unnecessary re-renders (check React DevTools)
- [ ] Images are optimized (use Next.js Image component)

### Security

- [ ] No sensitive data exposed in client-side code
- [ ] No passwords or tokens visible in URLs
- [ ] Forms use proper sanitization (check for XSS vulnerabilities)
- [ ] Authentication tokens are secure
- [ ] HTTPS is used in production (if applicable)

## Browser Testing Tips

### Chrome DevTools

1. Open DevTools: `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
2. **Console**: Check for errors and warnings
3. **Network**: Verify API requests and responses
4. **Application**: Check local storage, cookies, and session data
5. **Device Toolbar**: Test responsive design (`Ctrl+Shift+M` / `Cmd+Shift+M`)

### Firefox Developer Tools

1. Open DevTools: `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
2. Similar tabs to Chrome DevTools
3. **Responsive Design Mode**: `Ctrl+Shift+M` / `Cmd+Shift+M`

### Safari Web Inspector (macOS)

1. Enable Developer menu: Safari → Preferences → Advanced → Show Develop menu
2. Open Web Inspector: `Cmd+Option+I`
3. **Responsive Design Mode**: Develop → Enter Responsive Design Mode

## Common Test Scenarios

### New User Flow

1. Open the app in incognito/private mode
2. Sign up with a new account
3. Verify email validation (if applicable)
4. Complete profile setup
5. Navigate through the app
6. Test main features
7. Log out and log back in

### Existing User Flow

1. Log in with existing credentials
2. View and edit profile
3. Test all major features
4. Check if data persists correctly
5. Test logout

### Edge Cases

- [ ] Test with very long text inputs
- [ ] Test with special characters in inputs
- [ ] Test with empty required fields
- [ ] Test with invalid email formats
- [ ] Test with weak passwords
- [ ] Test rapid clicking (double-submit prevention)
- [ ] Test slow internet connection (throttle in DevTools)

## Reporting Issues

When reporting bugs found during testing:

1. **Browser and OS**: Specify which browser and OS version
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: Include screenshots or screen recordings
6. **Console Errors**: Copy any error messages from the console

## Pull Request Guidelines

### PR Title

Use clear, descriptive titles:

- ✅ `Add user profile editing functionality`
- ✅ `Fix login form validation error`
- ❌ `Update`
- ❌ `Changes`

### PR Description

Include:

1. **What**: Summary of changes
2. **Why**: Reason for the changes
3. **How**: Technical approach
4. **Testing**: What you tested and how
5. **Screenshots**: For UI changes
6. **Breaking Changes**: If any

### Example PR Description

```markdown
## What
Adds user profile editing functionality with image upload support.

## Why
Users need to be able to update their profile information and profile picture.

## How
- Created new API endpoint for profile updates
- Added profile editing form with validation
- Implemented image upload with Next.js Image optimization

## Testing
- ✅ Tested in Chrome, Firefox, and Safari
- ✅ Tested on desktop, tablet, and mobile viewports
- ✅ Verified form validation works correctly
- ✅ Confirmed image upload and display
- ✅ Checked database updates persist

## Screenshots
[Include before/after screenshots]

## Breaking Changes
None
```

## Code Review Process

1. Submit your PR
2. Automated checks will run (if configured)
3. Reviewers will provide feedback
4. Address feedback and update PR
5. Once approved, PR will be merged

## Questions?

If you have questions about testing or contributing, please:

1. Check the [Setup Guide](./SETUP.md)
2. Review existing issues and PRs
3. Open a new issue for discussion

Thank you for contributing to Mingle! 🎉
