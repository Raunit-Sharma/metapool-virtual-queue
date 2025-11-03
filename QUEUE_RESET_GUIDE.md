# Queue Reset Guide

## ✅ Reset Queue Button Added!

A "Reset Queue" button has been added to the Admin Dashboard that resets the current token to 0.

---

## Using the Reset Button (Easiest Method)

### Location:
Top-right of Admin Dashboard, next to the "Logout" button

### Steps:
1. Login to Admin Dashboard
2. Click the red **"Reset Queue"** button (top-right)
3. Confirm the action in the popup dialog
4. Current token resets to 0
5. Queue starts fresh from the beginning

### What It Does:
- Sets `current_token` back to 0
- Does NOT delete participants
- Does NOT change participant statuses
- Queue can be restarted with "Start Queue" button

---

## Manual Reset Methods (For Future Reference)

### Method 1: Via Supabase Dashboard (No Code)

**Steps:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gfpmvzkhzakmgouqwvnk
2. Click **"Table Editor"** in the left sidebar
3. Click on the **`queue_settings`** table
4. You'll see one row (id: 1)
5. Click on the `current_token` cell
6. Change the value to **0**
7. Press Enter or click outside to save
8. Done! ✅

**Visual Guide:**
```
queue_settings table:
┌────┬───────────────┬─────────────────────┬────────────┐
│ id │ current_token │ updated_at          │ updated_by │
├────┼───────────────┼─────────────────────┼────────────┤
│ 1  │ 50            │ 2025-11-03 20:00:00 │ uuid...    │
└────┴───────────────┴─────────────────────┴────────────┘

Double-click current_token cell → Type 0 → Press Enter

Result:
┌────┬───────────────┬─────────────────────┬────────────┐
│ id │ current_token │ updated_at          │ updated_by │
├────┼───────────────┼─────────────────────┼────────────┤
│ 1  │ 0             │ 2025-11-03 20:05:00 │ uuid...    │
└────┴───────────────┴─────────────────────┴────────────┘
```

---

### Method 2: Via SQL Editor (Quick)

**Steps:**
1. Go to Supabase Dashboard
2. Click **"SQL Editor"** → **"New Query"**
3. Paste this SQL:
```sql
UPDATE queue_settings 
SET current_token = 0, 
    updated_at = NOW() 
WHERE id = 1;
```
4. Click **"Run"** (or Ctrl+Enter)
5. Done! ✅

---

### Method 3: Via API/Code (For Automation)

**If you want to automate or add to your own scripts:**

```typescript
// Using Supabase client
await supabase
  .from('queue_settings')
  .update({ current_token: 0, updated_at: new Date().toISOString() })
  .eq('id', 1);
```

**Using curl (REST API):**
```bash
curl -X PATCH 'https://gfpmvzkhzakmgouqwvnk.supabase.co/rest/v1/queue_settings?id=eq.1' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"current_token": 0}'
```

---

## Complete Queue Reset (Including Participants)

If you want to **completely clear everything** and start over:

### Option A: Via Supabase Table Editor

**Steps:**
1. Go to Table Editor → `participants` table
2. Select all rows (checkbox at top)
3. Click "Delete" button
4. Confirm deletion
5. Go to `queue_settings` table
6. Set `current_token` to 0
7. Done! Fresh start ✅

### Option B: Via SQL (Faster for many rows)

```sql
-- Delete all participants
DELETE FROM participants;

-- Reset the token sequence
ALTER SEQUENCE token_number_seq RESTART WITH 1;

-- Reset current token to 0
UPDATE queue_settings 
SET current_token = 0, 
    updated_at = NOW() 
WHERE id = 1;
```

---

## Partial Resets

### Reset Only Statuses (Keep Participants)

**Scenario:** You want to keep all registered participants but reset their statuses

```sql
-- Reset all participants to 'waiting'
UPDATE participants 
SET status = 'waiting';

-- Reset current token to 0
UPDATE queue_settings 
SET current_token = 0, 
    updated_at = NOW() 
WHERE id = 1;
```

### Reset Only 'Done' Participants

**Scenario:** Keep waiting/skipped participants, remove only completed ones

```sql
-- Delete only 'done' participants
DELETE FROM participants 
WHERE status = 'done';

-- Reset current token to 0
UPDATE queue_settings 
SET current_token = 0, 
    updated_at = NOW() 
WHERE id = 1;
```

---

## Understanding What Reset Does

### Current Token = 0 Means:

✅ Queue is at the starting position
✅ No participant is currently being served
✅ "Start Queue" button will appear for admin
✅ All participants remain in the database
✅ All statuses remain unchanged

### After Reset:

1. **Admin sees:** Purple "Start Queue" card with first waiting participant
2. **Public sees:** Queue showing all participants, but no "Current" badge
3. **Token numbers:** Still sequential from registration order
4. **To restart:** Admin clicks "Start Queue" button

---

## Quick Reference Table

| What You Want | Method | SQL Command |
|---------------|--------|-------------|
| Just reset token to 0 | Table Editor | Edit `current_token` cell to 0 |
| Reset token (SQL) | SQL Editor | `UPDATE queue_settings SET current_token = 0 WHERE id = 1;` |
| Delete all participants | Table Editor | Select all → Delete |
| Delete all participants (SQL) | SQL Editor | `DELETE FROM participants;` |
| Reset everything | SQL Editor | Delete participants + reset token + reset sequence |
| Reset statuses only | SQL Editor | `UPDATE participants SET status = 'waiting';` |

---

## Common Scenarios

### Scenario 1: New Event, Same Participants
**Goal:** Start queue over but keep registered participants

**Solution:**
```sql
UPDATE queue_settings SET current_token = 0 WHERE id = 1;
UPDATE participants SET status = 'waiting';
```

### Scenario 2: Completely New Event
**Goal:** Fresh start, no old data

**Solution:**
```sql
DELETE FROM participants;
ALTER SEQUENCE token_number_seq RESTART WITH 1;
UPDATE queue_settings SET current_token = 0 WHERE id = 1;
```

### Scenario 3: Restart from Specific Token
**Goal:** Resume queue from token #20

**Solution:**
```sql
UPDATE queue_settings SET current_token = 20 WHERE id = 1;
```

---

## Troubleshooting

### Issue: Reset button doesn't appear
**Solution:** Make sure you're logged in as admin and refresh the page

### Issue: After reset, queue doesn't show "Start Queue"
**Solution:** Make sure you have at least one participant with status 'waiting'

### Issue: Token sequence starts from wrong number
**Solution:** Reset the sequence:
```sql
ALTER SEQUENCE token_number_seq RESTART WITH 1;
```

### Issue: Participants show wrong statuses after reset
**Solution:** Update all statuses to 'waiting':
```sql
UPDATE participants SET status = 'waiting';
```

---

## Safety Notes

⚠️ **Important:**
- Reset button has a confirmation dialog to prevent accidents
- Resetting current token does NOT delete participants
- To fully clear the queue, you need to delete participants manually
- Always backup important data before major resets

💡 **Pro Tip:**
- For events, consider resetting statuses instead of deleting participants
- This preserves registration history
- Use SQL queries for bulk operations on many participants

---

## Button Location

The "Reset Queue" button is located:
- **Where:** Top-right of Admin Dashboard
- **Color:** Red (to indicate it's a reset action)
- **Icon:** Circular arrow (RefreshCw)
- **Next to:** Logout button
- **Confirmation:** Yes (popup dialog)

---

## Files Modified

- `src/components/AdminDashboard.tsx` - Added `resetQueue()` function and button

---

That's everything you need to reset the queue! The easiest method is the red button in the admin dashboard. For bulk operations or automation, use the SQL methods. 🚀
