"""Resolve LIBREAGENTS_HOME for standalone skill scripts.

Skill scripts may run outside the LibreAgents process (e.g. system Python,
nix env, CI) where ``libreagents_constants`` is not importable.  This module
provides the same ``get_libreagents_home()`` and ``display_libreagents_home()``
contracts as ``libreagents_constants`` without requiring it on ``sys.path``.

When ``libreagents_constants`` IS available it is used directly so that any
future enhancements (profile resolution, Docker detection, etc.) are
picked up automatically.  The fallback path replicates the core logic
from ``libreagents_constants.py`` using only the stdlib.

All scripts under ``google-workspace/scripts/`` should import from here
instead of duplicating the ``LIBREAGENTS_HOME = Path(os.getenv(...))`` pattern.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from libreagents_constants import display_libreagents_home as display_libreagents_home
    from libreagents_constants import get_libreagents_home as get_libreagents_home
except (ModuleNotFoundError, ImportError):

    def get_libreagents_home() -> Path:
        """Return the LibreAgents home directory (default: ~/.libreagents).

        Mirrors ``libreagents_constants.get_libreagents_home()``."""
        val = os.environ.get("LIBREAGENTS_HOME", "").strip()
        return Path(val) if val else Path.home() / ".libreagents"

    def display_libreagents_home() -> str:
        """Return a user-friendly ``~/``-shortened display string.

        Mirrors ``libreagents_constants.display_libreagents_home()``."""
        home = get_libreagents_home()
        try:
            return "~/" + str(home.relative_to(Path.home()))
        except ValueError:
            return str(home)
