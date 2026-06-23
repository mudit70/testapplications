"""Reserved for an alternate APIRouter-based mounting of the F1-F9 endpoints.

NOT included by main.py. The active experiment endpoints are declared
app-level in main.py so the static caller URL literals (/api/f1 .. /api/f9)
match the composed route patterns exactly. See routers/tickets.py for the
router-identity limitation that motivated moving them onto the app.
"""
