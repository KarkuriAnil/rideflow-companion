export const SECTIONS = [
  "Auth & Onboarding",
  "Profile & Verification",
  "Home & Ride Creation",
  "Matching & Search",
  "Request & Chat",
  "Chat Unlock & Payment",
  "Ride Lifecycle",
  "SOS & Safety",
  "Rating & Feedback",
  "Admin Panel",
] as const;

export type SectionName = typeof SECTIONS[number];

export type NodeType = "screen" | "home" | "action" | "decision" | "system" | "success" | "error" | "warning" | "info" | "next" | "status";

export interface FlowNode {
  id: string;
  label: string;
  sub: string;
  type: NodeType;
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string;
}

export interface FlowSection {
  color: string;
  light: string;
  nodes: FlowNode[];
  edges: [string, string, string][];
}

export const typeStyles: Record<NodeType, { bg: string; border: string; text: string; badge: string; badgeText: string; label: string }> = {
  screen: { bg: "#FFFFFF", border: "#2563EB", text: "#1e3a8a", badge: "#DBEAFE", badgeText: "#1B2A6B", label: "SCREEN" },
  home: { bg: "#1B2A6B", border: "#1B2A6B", text: "#FFFFFF", badge: "#3B4FBB", badgeText: "#FFFFFF", label: "HOME" },
  action: { bg: "#FEF3C7", border: "#D97706", text: "#78350F", badge: "#FDE68A", badgeText: "#78350F", label: "ACTION" },
  decision: { bg: "#EDE9FE", border: "#7C3AED", text: "#4C1D95", badge: "#DDD6FE", badgeText: "#4C1D95", label: "CHECK" },
  system: { bg: "#F0FDF4", border: "#16A34A", text: "#14532D", badge: "#BBF7D0", badgeText: "#14532D", label: "SYSTEM" },
  success: { bg: "#F0FDF4", border: "#16A34A", text: "#14532D", badge: "#BBF7D0", badgeText: "#14532D", label: "SUCCESS" },
  error: { bg: "#FEF2F2", border: "#DC2626", text: "#7F1D1D", badge: "#FECACA", badgeText: "#7F1D1D", label: "ERROR" },
  warning: { bg: "#FFF7ED", border: "#EA580C", text: "#7C2D12", badge: "#FED7AA", badgeText: "#7C2D12", label: "ALERT" },
  info: { bg: "#F0F9FF", border: "#0284C7", text: "#0C4A6E", badge: "#BAE6FD", badgeText: "#0C4A6E", label: "INFO" },
  next: { bg: "#F5F3FF", border: "#7C3AED", text: "#4C1D95", badge: "#DDD6FE", badgeText: "#4C1D95", label: "NEXT" },
  status: { bg: "#F8FAFC", border: "#475569", text: "#1E293B", badge: "#E2E8F0", badgeText: "#475569", label: "STATUS" },
};

export const flows: Record<SectionName, FlowSection> = {
  "Auth & Onboarding": {
    color: "#1B2A6B", light: "#DBEAFE",
    nodes: [
      { id: "splash", label: "Splash Screen", sub: "Logo + Animation", type: "screen" },
      { id: "onboard", label: "Onboarding (4 screens)", sub: "Same Route / Shared Ride / Save More / Safer Commute", type: "screen" },
      { id: "home_public", label: "HOME SCREEN", sub: "Public — No login required", type: "home" },
      { id: "action", label: "User taps action", sub: "Need a Ride OR Offer a Ride", type: "action" },
      { id: "auth_check", label: "Logged in?", sub: "Firebase UID check", type: "decision" },
      { id: "login", label: "Login / Register", sub: "Phone OTP (Firebase) / Google / Facebook / Apple", type: "screen" },
      { id: "otp", label: "OTP Verification", sub: "6-digit SMS code — Auto-submit on fill\nResend after 30s · Expires in 5min", type: "screen" },
      { id: "uid", label: "Firebase UID Created", sub: "FCM Token saved & updated", type: "system" },
      { id: "new_check", label: "New User?", sub: "", type: "decision" },
      { id: "profile_setup", label: "→ Profile Setup", sub: "Continue to Section B", type: "next" },
      { id: "profile_check", label: "→ Profile Complete Check", sub: "Continue to Section B", type: "next" },
    ],
    edges: [
      ["splash", "onboard", "First Install"],
      ["splash", "home_public", "Returning User"],
      ["onboard", "home_public", "Skip / Complete"],
      ["home_public", "action", ""],
      ["action", "auth_check", ""],
      ["auth_check", "login", "NO"],
      ["auth_check", "new_check", "YES"],
      ["login", "otp", ""],
      ["otp", "uid", "Verified ✓"],
      ["uid", "new_check", ""],
      ["new_check", "profile_setup", "New User"],
      ["new_check", "profile_check", "Existing User"],
    ]
  },
  "Profile & Verification": {
    color: "#7C3AED", light: "#EDE9FE",
    nodes: [
      { id: "basic_profile", label: "Basic Profile Setup", sub: "Name · Photo · Gender · DOB · Bio\nEmergency Contact · Women-Only Mode (Female)", type: "screen" },
      { id: "role_gate", label: "What does user want?", sub: "", type: "decision" },
      { id: "id_verify", label: "ID Verification", sub: "Aadhaar / Voter ID / Passport / PAN / DL\nvia Cashfree API", type: "screen" },
      { id: "id_status", label: "Verification Status", sub: "", type: "decision" },
      { id: "id_ok", label: "ID Verified ✓", sub: "Seeker ready to search", type: "success" },
      { id: "id_reject", label: "Rejected", sub: "Show reason → Re-upload", type: "error" },
      { id: "driver_docs", label: "Driver Verification", sub: "DL (front+back) · RC (front+back)\nVehicle details: Type/Make/Model/Color/Plate/Seats/AC", type: "screen" },
      { id: "driver_status", label: "Driver Docs Status", sub: "", type: "decision" },
      { id: "driver_ok", label: "Driver Verified ✓", sub: "Rider ready to offer rides", type: "success" },
      { id: "upgrade", label: "Seeker → Rider Upgrade", sub: "ID already done ✓\nOnly show DL + RC step", type: "info" },
    ],
    edges: [
      ["basic_profile", "role_gate", ""],
      ["role_gate", "id_verify", "Need a Ride OR Offer a Ride"],
      ["id_verify", "id_status", "Submit"],
      ["id_status", "id_ok", "Verified"],
      ["id_status", "id_reject", "Rejected"],
      ["id_reject", "id_verify", "Re-upload"],
      ["id_ok", "driver_docs", "If Offer a Ride"],
      ["driver_docs", "driver_status", "Submit"],
      ["driver_status", "driver_ok", "Verified"],
      ["driver_status", "id_reject", "Rejected"],
      ["upgrade", "driver_docs", "Skip ID → Only Driver Docs"],
    ]
  },
  "Home & Ride Creation": {
    color: "#0D9488", light: "#CCFBF1",
    nodes: [
      { id: "home", label: "HOME SCREEN", sub: "Need a Ride | Offer a Ride", type: "home" },
      { id: "ride_type", label: "Select Ride Type", sub: "", type: "action" },
      { id: "instant", label: "Instant", sub: "Right now", type: "screen" },
      { id: "daily", label: "Daily Commute", sub: "Recurring schedule", type: "screen" },
      { id: "long", label: "Long Distance", sub: "Intercity trip", type: "screen" },
      { id: "form", label: "Ride Details Form", sub: "Pickup · Drop · Date · Time · Seats\nPrice · Gender Pref · Luggage · Notes", type: "screen" },
      { id: "active_check", label: "Active ride exists?", sub: "One active ride rule", type: "decision" },
      { id: "block", label: "Blocked!", sub: "Update or cancel existing ride first", type: "error" },
      { id: "preview", label: "Route Preview", sub: "Map · Distance · Duration\nEdit or Confirm", type: "screen" },
      { id: "confirm_post", label: "Ride Posted / Search Started", sub: "Status: Active", type: "success" },
    ],
    edges: [
      ["home", "ride_type", "Auth ✓ + Verified ✓"],
      ["ride_type", "instant", ""],
      ["ride_type", "daily", ""],
      ["ride_type", "long", ""],
      ["instant", "form", ""],
      ["daily", "form", ""],
      ["long", "form", ""],
      ["form", "active_check", "Submit"],
      ["active_check", "block", "YES"],
      ["active_check", "preview", "NO"],
      ["preview", "confirm_post", "Confirm"],
    ]
  },
  "Matching & Search": {
    color: "#2563EB", light: "#DBEAFE",
    nodes: [
      { id: "search", label: "System Searches Matches", sub: "Location overlap · Date/Time · Ride type\nSeats · Gender pref · Excludes blocked users", type: "system" },
      { id: "no_match", label: "No Matches?", sub: "", type: "decision" },
      { id: "alert_me", label: "'Alert Me' Option", sub: "Notify when someone matches", type: "info" },
      { id: "results", label: "Matching Results Screen", sub: "Cards: Photo · Rating · Badge · Route overlap\nPrice · Seats · Gender badge", type: "screen" },
      { id: "filter", label: "Filter & Sort", sub: "Recommended / Price / Rating\nFemale Only / Seats / Rating min", type: "action" },
      { id: "ride_detail", label: "Ride Details Page", sub: "Full profile · Vehicle · Route · Cost\nReviews · Preferences · Request button", type: "screen" },
    ],
    edges: [
      ["search", "no_match", ""],
      ["no_match", "alert_me", "No Results"],
      ["no_match", "results", "Results Found"],
      ["results", "filter", "Apply Filters"],
      ["filter", "results", "Refresh"],
      ["results", "ride_detail", "Tap Card"],
    ]
  },
  "Request & Chat": {
    color: "#EA580C", light: "#FEF3C7",
    nodes: [
      { id: "request_btn", label: "'Request Ride' Tapped", sub: "", type: "action" },
      { id: "chatroom", label: "Chat Room Created", sub: "System links both users", type: "system" },
      { id: "fcm", label: "FCM Push Notification Sent", sub: "To the other user", type: "system" },
      { id: "locked_chat", label: "LOCKED CHAT", sub: "Only 1 default message per side allowed\nRider: 'Hi! I have a ride...' | Seeker: 'Hi! Can I join...'", type: "warning" },
      { id: "inbox", label: "Incoming Requests Screen", sub: "In Notification bell + Inbox\nCard: Photo · Match% · Route · Seats · Decline/Accept", type: "screen" },
      { id: "decision", label: "Accept or Decline?", sub: "", type: "decision" },
      { id: "declined", label: "Declined", sub: "Request closed · No charge", type: "error" },
      { id: "confirmed", label: "Ride Confirmed!", sub: "Both get push notification\nSeats decremented on rider's ride", type: "success" },
      { id: "chat_locked_state", label: "Chat Still Locked", sub: "Pay to unlock full messaging", type: "warning" },
    ],
    edges: [
      ["request_btn", "chatroom", ""],
      ["chatroom", "fcm", ""],
      ["fcm", "locked_chat", ""],
      ["locked_chat", "inbox", "Other user sees request"],
      ["inbox", "decision", ""],
      ["decision", "declined", "Decline"],
      ["decision", "confirmed", "Accept"],
      ["confirmed", "chat_locked_state", ""],
    ]
  },
  "Chat Unlock & Payment": {
    color: "#16A34A", light: "#D1FAE5",
    nodes: [
      { id: "unlock_tap", label: "User taps 'Unlock Chat'", sub: "", type: "action" },
      { id: "balance_check", label: "Check Wallet Balance", sub: "", type: "decision" },
      { id: "recharge", label: "Recharge Wallet", sub: "₹50 / ₹100 / ₹200 / ₹500 / Custom", type: "screen" },
      { id: "razorpay", label: "Razorpay Payment", sub: "UPI / Card / Net Banking / Wallet", type: "screen" },
      { id: "webhook", label: "Payment Success Webhook", sub: "Razorpay → Backend", type: "system" },
      { id: "wallet_update", label: "Wallet Balance Updated", sub: "Transaction logged in DB", type: "system" },
      { id: "deduct", label: "Deduct Unlock Fee", sub: "From wallet balance", type: "system" },
      { id: "unlocked", label: "CHAT UNLOCKED 🔓", sub: "Both users can now send free messages\nBanner: Chats monitored for safety", type: "success" },
      { id: "auto_disable", label: "Chat Auto-Disabled", sub: "After ride marked Complete\nLogs retained 30 days", type: "info" },
    ],
    edges: [
      ["unlock_tap", "balance_check", ""],
      ["balance_check", "deduct", "Sufficient"],
      ["balance_check", "recharge", "Insufficient"],
      ["recharge", "razorpay", ""],
      ["razorpay", "webhook", "Success"],
      ["webhook", "wallet_update", ""],
      ["wallet_update", "deduct", ""],
      ["deduct", "unlocked", ""],
      ["unlocked", "auto_disable", "Ride Completed"],
    ]
  },
  "Ride Lifecycle": {
    color: "#1B2A6B", light: "#DBEAFE",
    nodes: [
      { id: "s_active", label: "Active", sub: "Searching for match", type: "status" },
      { id: "s_requested", label: "Requested", sub: "Request sent/received", type: "status" },
      { id: "s_confirmed", label: "Confirmed", sub: "Both accepted", type: "status" },
      { id: "s_inprogress", label: "In Progress", sub: "Ride started", type: "status" },
      { id: "s_completed", label: "Completed", sub: "Ride ended", type: "success" },
      { id: "s_cancelled", label: "Cancelled", sub: "By either party", type: "error" },
      { id: "confirmed_screen", label: "Ride Confirmed Screen", sub: "Driver on way · Vehicle + plate\nPickup time · Track Ride · Safety Center", type: "screen" },
      { id: "inprogress_screen", label: "Ride In-Progress Screen", sub: "Live map · Elapsed time · ETA\n🔴 SOS Button (always visible) · Share Location", type: "screen" },
      { id: "completed_screen", label: "Ride Completed Screen", sub: "Summary · Distance · Cost · Receipt\nRate Your Ride prompt", type: "screen" },
    ],
    edges: [
      ["s_active", "s_requested", "Request sent"],
      ["s_requested", "s_confirmed", "Accepted"],
      ["s_requested", "s_cancelled", "Declined"],
      ["s_confirmed", "s_inprogress", "Ride starts"],
      ["s_confirmed", "s_cancelled", "Cancel"],
      ["s_inprogress", "s_completed", "Ride ends"],
      ["s_confirmed", "confirmed_screen", ""],
      ["s_inprogress", "inprogress_screen", ""],
      ["s_completed", "completed_screen", ""],
    ]
  },
  "SOS & Safety": {
    color: "#DC2626", light: "#FEE2E2",
    nodes: [
      { id: "sos_btn", label: "🔴 SOS Button", sub: "Hold 3 seconds to activate\nAlways visible during active ride", type: "warning" },
      { id: "sos_screen", label: "Emergency & SOS Screen", sub: "", type: "screen" },
      { id: "call_contact", label: "Call Safety Contact", sub: "Calls emergency contact from profile", type: "action" },
      { id: "call_112", label: "Call 112 / Local Emergency", sub: "Direct call to local services", type: "action" },
      { id: "share_loc", label: "Share Live Location", sub: "GPS link sent to emergency contact", type: "action" },
      { id: "sos_log", label: "SOS Event Logged", sub: "Timestamp · GPS · Ride ID\nAdmin notified immediately", type: "system" },
      { id: "deviation", label: "Route Deviation Alert", sub: ">500m from planned route triggers alert\nHelp! SOS | I'm Safe buttons shown", type: "warning" },
      { id: "report", label: "Report User Screen", sub: "Reason · Description · Evidence\nAnonymous · Linked to Ride ID", type: "screen" },
      { id: "block", label: "Block User", sub: "Hidden from all future matches", type: "action" },
      { id: "safety_center", label: "Safety Center", sub: "Rules · Tips · Community Guidelines\nGet Emergency Help button", type: "screen" },
      { id: "im_safe", label: "'I'm Safe' — Cancel SOS", sub: "Accidental trigger resolution", type: "info" },
    ],
    edges: [
      ["sos_btn", "sos_screen", "Activated"],
      ["sos_screen", "call_contact", ""],
      ["sos_screen", "call_112", ""],
      ["sos_screen", "share_loc", ""],
      ["sos_btn", "sos_log", "Auto"],
      ["sos_screen", "im_safe", "Accidental"],
      ["deviation", "sos_screen", "User taps Help SOS"],
      ["report", "sos_log", "Admin notified"],
      ["block", "sos_log", "Logged"],
    ]
  },
  "Rating & Feedback": {
    color: "#D97706", light: "#FEF3C7",
    nodes: [
      { id: "prompt", label: "Rate Your Ride Prompt", sub: "Shown after ride completion\nMandatory (prompted again if skipped)", type: "screen" },
      { id: "stars", label: "Star Rating", sub: "1–5 stars\nQuick Reaction: Superb / Good / Okay / Poor", type: "screen" },
      { id: "feedback", label: "Written Feedback Screen", sub: "Positive tags: Safe Ride / On-time / Friendly\nSmooth / Clean car / Good music\nFree text box (max 500 chars)", type: "screen" },
      { id: "anonymous", label: "Feedback is Anonymous", sub: "Rated user never sees who rated them", type: "info" },
      { id: "ratings_page", label: "User Ratings Page", sub: "Overall: 4.9 ⭐\nStar distribution chart\nBadges · Most Recent / Highest / Lowest tabs", type: "screen" },
      { id: "avg_update", label: "Average Rating Updated", sub: "Recalculated after every new rating", type: "system" },
      { id: "badge_check", label: "Badge Eligibility Check", sub: "Trusted Commuter / Verified Rider", type: "system" },
    ],
    edges: [
      ["prompt", "stars", ""],
      ["stars", "feedback", "Submit Rating"],
      ["feedback", "anonymous", ""],
      ["anonymous", "avg_update", ""],
      ["avg_update", "badge_check", ""],
      ["badge_check", "ratings_page", "Badges updated"],
    ]
  },
  "Admin Panel": {
    color: "#374151", light: "#F3F4F6",
    nodes: [
      { id: "admin_login", label: "Admin Login", sub: "Email + Password + 2FA\nRole: Super Admin / Ops / Verification / Support", type: "screen" },
      { id: "dashboard", label: "Admin Dashboard", sub: "Users · Active Rides · Pending Verifications\nUrgent Alerts · Growth Charts · Live Ops", type: "screen" },
      { id: "user_mgmt", label: "User Management", sub: "Search · View · Edit · Suspend · Ban", type: "screen" },
      { id: "id_verify", label: "ID Verification Dashboard", sub: "Queue · Approve / Reject · SLA timer", type: "screen" },
      { id: "ride_monitor", label: "Ride Monitoring", sub: "Live map · All statuses · SOS rides\nChat log access · Emergency override", type: "screen" },
      { id: "reports", label: "Reports & Complaints", sub: "Open / Investigating / Resolved\nPriority flags · Assign to team member", type: "screen" },
      { id: "block_users", label: "Block / Suspend Users", sub: "Warn / Suspend / Ban\nRestricted users list", type: "screen" },
      { id: "analytics", label: "Analytics Dashboard", sub: "Growth · Revenue · Verification funnel\nSOS log · Top routes · Export CSV", type: "screen" },
      { id: "cms", label: "CMS for Legal Pages", sub: "T&C · Privacy · Disclaimer · Guidelines\nPreview → Publish · Version history", type: "screen" },
    ],
    edges: [
      ["admin_login", "dashboard", ""],
      ["dashboard", "user_mgmt", ""],
      ["dashboard", "id_verify", ""],
      ["dashboard", "ride_monitor", ""],
      ["dashboard", "reports", ""],
      ["dashboard", "block_users", ""],
      ["dashboard", "analytics", ""],
      ["dashboard", "cms", ""],
    ]
  }
};

export const integrations = [
  ["🔥 Firebase", "Phone OTP + UID"],
  ["💳 Razorpay", "Wallet payments"],
  ["🪪 Cashfree", "Doc verification"],
  ["🗺 Google Maps", "Location + routes"],
  ["📱 FCM", "Push notifications"],
] as const;
