"""
SentinelOps Anomaly Detection Service — Unit Tests
Tests for metric anomaly detection, threshold logic, and alert scoring.
"""
import pytest


# ── Anomaly detection logic ──────────────────────────────────────────────────
def detect_anomaly(value: float, baseline: float, threshold_pct: float = 20.0) -> bool:
    """Returns True if value deviates from baseline by more than threshold %."""
    if baseline == 0:
        return value != 0
    deviation = abs(value - baseline) / baseline * 100
    return deviation > threshold_pct


def test_no_anomaly_within_threshold():
    assert not detect_anomaly(105.0, 100.0, threshold_pct=10.0)

def test_anomaly_above_threshold():
    assert detect_anomaly(150.0, 100.0, threshold_pct=20.0)

def test_anomaly_drop_below():
    assert detect_anomaly(50.0, 100.0, threshold_pct=20.0)

def test_zero_baseline():
    assert detect_anomaly(1.0, 0.0)
    assert not detect_anomaly(0.0, 0.0)

def test_exact_threshold_boundary():
    # Exactly at threshold — should NOT be anomaly
    assert not detect_anomaly(120.0, 100.0, threshold_pct=20.0)
    # Just over — should be anomaly
    assert detect_anomaly(120.1, 100.0, threshold_pct=20.0)


# ── Severity scoring ─────────────────────────────────────────────────────────
def score_severity(deviation_pct: float) -> str:
    if deviation_pct >= 80:   return "critical"
    if deviation_pct >= 40:   return "high"
    if deviation_pct >= 20:   return "medium"
    return "low"

@pytest.mark.parametrize("deviation,expected", [
    (5.0,  "low"),
    (25.0, "medium"),
    (50.0, "high"),
    (90.0, "critical"),
])
def test_severity_scoring(deviation, expected):
    assert score_severity(deviation) == expected


# ── Metric aggregation ───────────────────────────────────────────────────────
def compute_rolling_avg(values: list, window: int = 5) -> float:
    if not values:
        return 0.0
    recent = values[-window:]
    return sum(recent) / len(recent)

def test_rolling_average_basic():
    vals = [10, 20, 30, 40, 50]
    assert compute_rolling_avg(vals, window=5) == 30.0

def test_rolling_average_window_larger_than_data():
    vals = [10, 20]
    assert compute_rolling_avg(vals, window=10) == 15.0

def test_rolling_average_empty():
    assert compute_rolling_avg([], window=5) == 0.0

def test_rolling_average_only_recent():
    vals = [100, 100, 100, 10, 10]
    avg = compute_rolling_avg(vals, window=2)
    assert avg == 10.0  # Only last 2 values


# ── Alert deduplication ──────────────────────────────────────────────────────
def dedupe_alerts(alerts: list) -> list:
    seen = set()
    result = []
    for a in alerts:
        key = (a["service"], a["metric"])
        if key not in seen:
            seen.add(key)
            result.append(a)
    return result

def test_alert_deduplication():
    alerts = [
        {"service": "api", "metric": "cpu", "value": 90},
        {"service": "api", "metric": "cpu", "value": 95},  # duplicate
        {"service": "api", "metric": "memory", "value": 85},
    ]
    deduped = dedupe_alerts(alerts)
    assert len(deduped) == 2
    assert deduped[0]["value"] == 90  # keeps first
