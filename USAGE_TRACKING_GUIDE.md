# Usage & Duration Tracking - Quick Guide

## ✅ What's Already Tracking

Your site now tracks **comprehensive usage metrics** via Mixpanel:

### 1. Session Tracking (NEW!)
- **Total time on site**: From page load to exit
- **Active time**: Time user is engaged (mouse/keyboard/scroll activity)
- **Idle time**: Time user is inactive (>60s no activity)
- **Engagement rate**: Active time / Total time percentage
- **Pages visited**: Number of sections browsed

### 2. Playback Tracking (Existing)
- **Watch time per channel**: Exact duration watching each TV channel
- **Listen time per station**: Exact duration listening to each radio station
- **30-second heartbeats**: Continuous tracking while playing

### 3. User Actions (Existing)
- Searches, favorites, votes, shares
- Filter applications
- Login/signup events

---

## 📊 How to View Usage Data

### Option 1: Mixpanel Dashboard (Most Detailed)

1. **Go to**: https://mixpanel.com
2. **Log in** with your Mixpanel account
3. **Select**: Adajoon project

#### Key Reports to View:

**Average Session Duration**:
- Go to **Insights** → New Report
- Event: `Session Ended`
- Show: `Average of total_duration_seconds`
- Group by: `Date`

**Daily Active Users**:
- Go to **Insights** → New Report
- Event: `Session Started`
- Show: `Unique Users`
- Group by: `Date`

**Engagement Rate**:
- Go to **Insights** → New Report
- Event: `Session Ended`
- Show: `Average of engagement_rate`
- Group by: `Date`

**Top Channels by Watch Time**:
- Go to **Insights** → New Report
- Event: `Playback Session`
- Filter: `item_type = 'tv'`
- Show: `Sum of total_duration_seconds`
- Group by: `item_name`
- Sort by: Value (descending)

**Watch Time by Hour** (Peak usage times):
- Go to **Insights** → New Report
- Event: `Session Heartbeat`
- Show: `Count`
- Group by: `Hour of Day`

### Option 2: Adajoon Admin Dashboard (Quick Overview)

1. **Go to**: https://www.adajoon.com
2. **Log in** as admin (`khash@khash.com`)
3. **Click your avatar** → **Admin Dashboard**

**Shows**:
- Active users (24h, 7d, 30d)
- Recently watched content
- User growth over time
- System health

**Note**: Admin dashboard shows database-level stats. For detailed session/duration analytics, use Mixpanel.

---

## 🎯 Key Metrics to Monitor

### Daily/Weekly
- **Daily Active Users (DAU)**: How many users visit per day
- **Average Session Duration**: How long users stay on site
- **Average Watch Time**: How long users watch content
- **Engagement Rate**: Percentage of time users are active

### Monthly
- **Monthly Active Users (MAU)**: Unique users per month
- **DAU/MAU Ratio**: Stickiness metric (ideal: >20%)
- **Retention**: 7-day and 30-day user return rates
- **Top Content**: Most watched channels/stations

### Growth
- **New Signups**: User growth over time
- **Conversion Rate**: Guest → Registered user
- **Provider Mix**: Google vs Apple vs Passkey logins

---

## 📈 Sample Queries

### 1. Total Watch Time This Month
```
Event: Playback Session
Date Range: Last 30 days
Show: Sum of total_duration_seconds
Convert to: Hours
```

### 2. Average Time Spent Per User
```
Event: Session Ended
Date Range: Last 7 days
Show: Average of total_duration_seconds
Convert to: Minutes
```

### 3. Most Popular Content
```
Event: Playback Started
Date Range: Last 30 days
Group by: item_name
Show: Count
Sort by: Value (descending)
Limit: 10
```

### 4. User Engagement Over Time
```
Event: Session Ended
Date Range: Last 30 days
Show: Average of engagement_rate
Group by: Date
```

### 5. Peak Usage Hours
```
Event: Session Heartbeat
Date Range: Last 7 days
Group by: Hour of Day
Show: Count
```

---

## 🔔 Recommended Alerts

Set up Mixpanel alerts for:

1. **DAU drops >20%**: Potential site issues
2. **Avg session duration <2 minutes**: Engagement problem
3. **New signups <5/day**: Growth slowdown
4. **Error rate >5%**: Technical issues

---

## 🎬 Events Being Tracked

### Session Events (every user visit)
- `Session Started` - When user loads site
- `Session Heartbeat` - Every 60 seconds
- `Session Ended` - When user leaves
- `User Became Active/Idle` - Activity state changes
- `Tab Hidden/Visible` - Tab switching

### Playback Events (when watching/listening)
- `Playback Started` - Start watching/listening
- `Playback Heartbeat` - Every 30 seconds
- `Playback Ended` - Stop watching/listening
- `Playback Session` - Full session summary

### User Actions
- `Content Played` - Click to play
- `Search Performed` - Search query
- `Favorite Action` - Add/remove favorite
- `Vote Cast` - Upvote/downvote
- `Content Shared` - Share channel/station
- `Filter Applied` - Apply category/country filter
- `User Signed Up` - New registration
- `User Logged In` - Login event

---

## 🔧 Configuration

### Mixpanel Token
Set in Railway environment variables (frontend service):
```bash
VITE_MIXPANEL_TOKEN=your_mixpanel_project_token
```

### Enable/Disable
Analytics are:
- ✅ **Enabled**: In production with token set
- ❌ **Disabled**: In development (logs to console only)

---

## 📚 Full Documentation

For complete event schemas, privacy considerations, and advanced queries:
- **Read**: `docs/ANALYTICS_TRACKING.md`
- **Admin Monitoring**: `docs/RAILWAY_MONITORING.md`

---

## 🚀 Next Steps

1. **Log in to Mixpanel** and explore your data
2. **Create key dashboards** (DAU, session duration, top content)
3. **Set up alerts** for critical metrics
4. **Review weekly** to understand user behavior
5. **Optimize** based on insights (improve retention, fix drop-offs)

---

**Tracking since**: April 12, 2026  
**Events tracked per session**: ~5-10 (varies by user activity)  
**Data retention**: 90 days (Mixpanel free plan)  
**Status**: ✅ Live in production
