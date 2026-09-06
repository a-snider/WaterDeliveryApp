# Mountain Park Spring Water App — Project Notes

## Overview
React Native app (Expo SDK 54) for a small water delivery business. Two-sided: customer ordering app + staff dispatch view. Built by Alex, a beginner learning React Native from scratch with Claude's help.

## Tech Stack
- **Frontend:** React Native, Expo SDK 54, Expo Router (file-based routing)
- **Backend:** Firebase (Authentication, Firestore)
- **Build:** EAS Build (`preview` profile → APK for direct install)
- **Editor:** VS Code | **Version control:** GitHub (`github.com/a-snider/WaterDeliveryApp`)
- **Local path:** `C:\Dev\WaterDeliveryApp` (moved out of OneDrive — sync caused file corruption)

## Firebase Project
- Project ID: `mountainparkspringwater-a873b`
- Package name: `com.mountainparkspringwater.waterdeliveryapp`
- Firestore currently in **test mode** (open read/write) — security rules NOT yet set up, this is a known priority
- Collections: `products`, `orders`, `recurringOrders`, `users` (stores push tokens)

## Features Built
- Branded Home screen: logo, gradient header, website link, product grid (from Firestore)
- Product cards: quantity stepper, recurring frequency picker (1/2/4 wks), "Add to Order" with toast confirmation
- Cart/checkout (`modal.tsx`): delivery instructions, recurring order creation, animated order-success screen
- Firebase Auth (email/password) with persistent login (uses `initializeAuth` + AsyncStorage — required `metro.config.js` fix for `unstable_enablePackageExports`)
- Orders tab: real orders from Firestore, filtered per user, pull-to-refresh, animated delivery-truck progress bar (shows only when `approved: true` in Firestore)
- Account tab: login/signup/logout with friendly error messages + validation
- **Dispatch tab** (staff-only, gated by email list in `constants/staff.ts`): shows ALL orders, Approve toggle, advance status buttons (Scheduled → Out for Delivery → Delivered)
- Push notifications: local "day before delivery" reminder (5-gallon jugs only, scheduled at checkout) + remote "Delivered" push (sent from Dispatch screen via Expo's push API)
- Custom app icon/splash screen, button press animations, toast notifications

## Known Quirks / Gotchas
- **Full file replacements preferred** — partial edits via str_replace have caused repeated corruption (invisible chars, mismatched brackets). Always do "select all → delete → paste fresh" in VS Code.
- New files require a full server restart (`Ctrl+C` → `npx expo start`), not just hot reload.
- Firestore composite index required for any `where + orderBy` combo query (Firebase gives a direct link to create it when the error occurs).
- Push notifications don't work in Expo Go (SDK 53+ limitation) — shows a dismissible error, only testable in a real built APK.
- Icon mapping for tab bar icons lives in `components/ui/icon-symbol.tsx` — any new SF Symbol name used must be manually mapped to a Material Icons name or it silently fails to render on Android.

## Still To Do
- Firestore security rules (test mode expires 30 days from setup — HIGH PRIORITY)
- Recurring order automation (currently just stores the schedule; no auto-generation of repeat orders yet — would need Firebase Cloud Functions)
- Stripe payment integration
- Formal driver/route management view
- Manager-level demo (rescheduled, still pending)