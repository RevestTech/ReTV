# Analytics & Usage Tracking

Adajoon uses **Mixpanel** for comprehensive user analytics and engagement tracking.

## Overview

The analytics system tracks three main categories:
1. **Session Tracking**: Overall site usage and engagement
2. **Playback Tracking**: Content consumption patterns
3. **User Actions**: Interactions with features

---

## Session Tracking

### Events Tracked

#### Session Started
Fired when user loads the app.
```javascript
{
  timestamp: "2026-04-12T10:30:00.000Z",
  user_agent: "Mozilla/5.0...",
  screen_width: 1920,
  screen_height: 1080
}
```

#### Session Heartbeat
Fired every 60 seconds while user is on site.
```javascript
{
  total_duration_seconds: 180,      // Total time on site
  active_time_seconds: 120,         // Time actively engaged
  idle_time_seconds: 60,            // Time idle/inactive
  pages_visited: 3,                 // Pages/sections visited
  is_active: true                   // Currently active?
}
```

#### Session Ended
Fired when user leaves site or closes tab.
```javascript
{
  total_duration_seconds: 300,
  active_time_seconds: 240,
  idle_time_seconds: 60,
  pages_visited: 5,
  engagement_rate: "80.00"          // Active/Total percentage
}
```

#### User Became Active / Idle
Fired when user switches between active and idle states.
- **Active**: Mouse/keyboard/touch activity detected
- **Idle**: No activity for 60 seconds

#### Tab Hidden / Visible
Fired when user switches tabs or minimizes browser.

---

## Playback Tracking

### Events Tracked

#### Playback Started
Fired when user starts watching a channel or listening to a radio station.
```javascript
{
  item_type: "tv",                  // 'tv' or 'radio'
  item_id: "BBC-News",
  item_name: "BBC News",
  item_country: "GB",
  item_category: ["News"]
}
```

#### Playback Heartbeat
Fired every 30 seconds while content is playing.
```javascript
{
  item_type: "tv",
  item_id: "BBC-News",
  item_name: "BBC News",
  session_duration_seconds: 90,     // Duration of current session
  heartbeat_interval_seconds: 30    // Time since last heartbeat
}
```

#### Playback Ended
Fired when user pauses or stops playback.
```javascript
{
  item_type: "tv",
  item_id: "BBC-News",
  item_name: "BBC News",
  duration_seconds: 300             // Total watch/listen time
}
```

#### Playback Session
Fired when user navigates away or closes player (minimum 5 seconds watched).
```javascript
{
  item_type: "tv",
  item_id: "BBC-News",
  item_name: "BBC News",
  total_duration_seconds: 300
}
```

---

## User Action Tracking

### Content Interactions

#### Content Played
Fired when user clicks to play content.
```javascript
analytics.trackPlay('tv', channel);
```

#### Search Performed
Fired when user searches for content.
```javascript
analytics.trackSearch(query, resultCount, 'tv');
```

#### Favorite Action
Fired when user adds/removes favorites.
```javascript
analytics.trackFavorite('add', 'tv', channel);
```

#### Vote Cast
Fired when user upvotes/downvotes content.
```javascript
analytics.trackVote('upvote', 'tv', channel);
```

#### Content Shared
Fired when user shares content.
```javascript
analytics.trackShare('native', 'tv', channel);
```

#### Filter Applied
Fired when user applies filters (category, country, quality).
```javascript
analytics.trackFilter('category', 'News', 'tv');
```

### Authentication

#### User Signed Up
Fired on new user registration.
```javascript
{
  method: "google",                 // 'google', 'apple', or 'passkey'
  user_id: 12345
}
```

#### User Logged In
Fired on existing user login.
```javascript
{
  method: "google",
  user_id: 12345
}
```

---

## Accessing Analytics Data

### Mixpanel Dashboard

1. **Log in to Mixpanel**: https://mixpanel.com
2. **Select Adajoon project**
3. **Navigate to Reports**:
   - **Insights**: Custom queries, funnels, retention
   - **Users**: User profiles and activity
   - **Flows**: User journey paths
   - **Retention**: Cohort analysis

### Key Reports to Create

#### Session Duration Report
```
Event: Session Ended
Group by: Date
Show: Average of total_duration_seconds
```

#### Engagement Rate
```
Event: Session Ended
Group by: Date
Show: Average of engagement_rate
```

#### Top Content
```
Event: Playback Session
Group by: item_name
Show: Count, Sum of total_duration_seconds
```

#### Watch Time by Category
```
Event: Playback Session
Filter: item_type = 'tv'
Group by: item_category
Show: Sum of total_duration_seconds
```

#### Daily Active Users (DAU)
```
Event: Session Started
Group by: Date
Show: Unique users
```

#### Average Session Duration
```
Event: Session Ended
Group by: Date
Show: Average of total_duration_seconds
Convert to: Minutes
```

---

## Admin Dashboard Integration

The Adajoon Admin Dashboard displays key metrics from Mixpanel:

### Overview Tab
- **Total Sessions Today**: Count of `Session Started` events
- **Average Session Duration**: Avg `total_duration_seconds` from `Session Ended`
- **Top Channels**: Most played content from `Playback Session`

### Activity Tab
- **Active Users Timeline**: `Session Started` events over time
- **Peak Usage Hours**: `Session Heartbeat` grouped by hour
- **Recently Watched**: Latest `Playback Started` events

### Users Tab
- **User Growth**: `User Signed Up` events over time
- **Provider Distribution**: `User Logged In` grouped by method

---

## Configuration

### Environment Variables

**Production**:
```bash
VITE_MIXPANEL_TOKEN=your_mixpanel_token_here
```

**Development** (optional):
```bash
VITE_MIXPANEL_TOKEN=dev_token_here
```

If not set, analytics will log to console in development and be disabled in production.

### Feature Flags

Analytics are automatically enabled in production when `VITE_MIXPANEL_TOKEN` is set.

To disable analytics even with a token:
```javascript
// In analytics.js
const ANALYTICS_ENABLED = false; // Force disable
```

---

## Privacy Considerations

### Data Collected

- **User ID**: Only for authenticated users (hashed email)
- **IP Address**: Collected by Mixpanel (can be disabled)
- **User Agent**: Browser and device information
- **Activity Data**: Actions, durations, content viewed

### GDPR Compliance

1. **Consent**: Add cookie consent banner (recommended)
2. **Opt-out**: Provide opt-out mechanism in user settings
3. **Data Deletion**: Use Mixpanel's GDPR API to delete user data

Example opt-out:
```javascript
// In user settings
if (userOptedOut) {
  mixpanel.opt_out_tracking();
}
```

---

## Performance Impact

- **Session Tracking**: ~60 KB memory, minimal CPU
- **Playback Tracking**: ~30 KB memory per active player
- **Network**: ~1-2 KB per event, batched every 5 seconds
- **Total Overhead**: <0.1% of page load time

---

## Debugging

### Console Logs (Development)

All analytics events are logged to console in development:
```
[Analytics] Session Started { timestamp: "...", ... }
[Analytics] Playback Started { item_type: "tv", ... }
```

### Mixpanel Debugger

1. Open Mixpanel dashboard
2. Go to **Events** → **Live View**
3. See events in real-time as they're sent

### Network Tab

Filter requests to `api.mixpanel.com` to see raw event payloads.

---

## Best Practices

### 1. Track User Journeys
Create funnels to understand:
- Landing → Login → First Play
- Search → Filter → Play
- Favorite → Return Visit → Play

### 2. Monitor Engagement
Track key metrics:
- **DAU/MAU Ratio**: Daily/Monthly active users
- **Session Duration**: Average time on site
- **Watch Time**: Total content consumption
- **Retention**: 7-day and 30-day retention rates

### 3. Identify Drop-offs
Find where users leave:
- Landing page → Login (guest friction?)
- Search → No results (content gaps?)
- Play → <30s watch (stream quality issues?)

### 4. A/B Testing
Use Mixpanel or PostHog to test:
- UI changes (grid vs list view)
- Feature rollouts (floating player)
- Content recommendations

---

## Troubleshooting

### Events Not Appearing

1. **Check token**: Verify `VITE_MIXPANEL_TOKEN` is set
2. **Check environment**: Analytics are disabled in dev without token
3. **Check console**: Look for `[Analytics]` logs
4. **Check network**: Filter for `api.mixpanel.com`

### Duplicate Events

- Ensure components don't mount multiple times
- Check for double `useEffect` calls (React StrictMode)
- Use `useRef` to prevent duplicate tracking

### Missing User Data

- Verify `analytics.identify()` is called on login
- Check that user ID is being passed correctly
- Ensure JWT token includes user ID

---

## Future Enhancements

- [ ] Add cohort analysis for retention
- [ ] Create automated weekly reports
- [ ] Integrate with admin dashboard API endpoints
- [ ] Add custom event funnels
- [ ] Set up Slack/email alerts for key metrics
- [ ] Add heatmaps for UI interactions (Hotjar/FullStory)

---

**Last updated**: April 12, 2026  
**Mixpanel Project**: Adajoon Production  
**Version**: 2.6.0
