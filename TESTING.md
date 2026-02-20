# Quick Testing Checklist

Use this checklist when testing changes locally before pushing to a branch.

## 🔧 Setup Verification

- [ ] Repository cloned and on correct branch
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created and configured
- [ ] Database is running (PostgreSQL)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Project builds successfully (`npm run build`)

## 🌐 Browser Testing

### Chrome/Edge (Chromium)
- [ ] Application loads at http://localhost:3000
- [ ] No console errors (F12 → Console)
- [ ] All features work as expected
- [ ] Responsive design works (Device Toolbar: Ctrl+Shift+M)

### Firefox
- [ ] Application loads at http://localhost:3000
- [ ] No console errors (F12 → Console)
- [ ] All features work as expected
- [ ] Responsive design works (Ctrl+Shift+M)

### Safari (macOS only)
- [ ] Application loads at http://localhost:3000
- [ ] No console errors (Cmd+Option+I)
- [ ] All features work as expected

## 📱 Responsive Design Testing

Test on the following viewports (use DevTools Device Toolbar):

- [ ] **Desktop Large**: 1920x1080
- [ ] **Desktop**: 1366x768
- [ ] **Tablet**: 768x1024
- [ ] **Mobile Large**: 414x896 (iPhone 11 Pro Max)
- [ ] **Mobile**: 375x667 (iPhone 8)

## 🔐 Authentication Flow

- [ ] Sign Up page loads
- [ ] Can create account with valid data
- [ ] Proper validation for invalid data
- [ ] Login page loads
- [ ] Can login with valid credentials
- [ ] Error shown for invalid credentials
- [ ] Can logout successfully
- [ ] Session persists on page refresh
- [ ] Protected routes redirect to login

## 👤 User Profile

- [ ] Profile page loads
- [ ] Can view profile information
- [ ] Can edit profile information
- [ ] Changes save correctly
- [ ] Gender options work (MALE, FEMALE, NON_BINARY, OTHER)
- [ ] Gender preferences work (MALE, FEMALE, NON_BINARY, EVERYONE)
- [ ] Profile picture upload works (if applicable)

## 🧭 Navigation

- [ ] All navigation links work
- [ ] No broken links (404 errors)
- [ ] Back button works correctly
- [ ] URL routing works correctly
- [ ] Active page highlighted in navigation

## 📝 Forms & Validation

- [ ] All form inputs are accessible
- [ ] Required fields are validated
- [ ] Email format validation works
- [ ] Password strength validation works
- [ ] Clear error messages displayed
- [ ] Success messages displayed
- [ ] Form submission works correctly
- [ ] Loading states shown during submission

## 🎨 UI/UX

- [ ] Layout is consistent across pages
- [ ] No visual glitches or overlapping elements
- [ ] Buttons are clickable and responsive
- [ ] Hover states work correctly
- [ ] Focus states work (keyboard navigation)
- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing is appropriate

## ⚡ Performance

- [ ] Pages load quickly (< 3 seconds)
- [ ] Images are optimized
- [ ] No unnecessary API calls
- [ ] No console warnings
- [ ] No memory leaks (check DevTools Performance tab)

## 🔒 Security

- [ ] No sensitive data in console logs
- [ ] No credentials in URLs
- [ ] Forms are sanitized (no XSS vulnerabilities)
- [ ] Authentication tokens are secure
- [ ] HTTPS in production (if deployed)

## 🐛 Edge Cases

- [ ] Empty form submissions handled
- [ ] Very long text inputs handled
- [ ] Special characters in inputs work
- [ ] Invalid email formats rejected
- [ ] Weak passwords rejected
- [ ] Network errors handled gracefully
- [ ] Double-click protection on submit buttons

## 📊 Database

- [ ] Data persists correctly
- [ ] Database queries work
- [ ] Relationships are correct
- [ ] No database errors in logs

## 🚀 Final Checks

- [ ] All features tested work as expected
- [ ] No console errors in any browser
- [ ] Responsive design works on all viewports
- [ ] Git changes are reviewed
- [ ] Commit message is descriptive
- [ ] Ready to push to remote branch

---

## Browser DevTools Quick Reference

### Open DevTools
- **Chrome/Edge/Firefox**: `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
- **Safari**: `Cmd+Option+I` (enable Developer menu first)

### Device Toolbar (Responsive Mode)
- **Chrome/Edge/Firefox**: `Ctrl+Shift+M` (Windows/Linux) / `Cmd+Shift+M` (Mac)
- **Safari**: Develop → Enter Responsive Design Mode

### Console Tab
- View JavaScript errors and warnings
- View console.log() output
- View network request errors

### Network Tab
- Monitor API requests
- Check response status codes
- View request/response data
- Throttle network speed for testing

### Application/Storage Tab
- View cookies
- View local storage
- View session storage
- Clear site data

---

**Note**: This checklist should be completed for each significant change before pushing to a branch or creating a pull request.
