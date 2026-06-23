"""Reserved for an alternate APIRouter-based mounting of ticket endpoints.

NOTE: This module is intentionally NOT included by main.py. During this
experiment we found that adorable's FastAPI router-identity resolution
collapses multiple APIRouter instances onto a single prefix, so the canonical
complete-stitch path is app-level decorators (see main.py). Kept as
documentation of the degraded rung.
"""
