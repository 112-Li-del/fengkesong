export function locationQuality(
  accuracy: number,
  timestamp: number,
  now = Date.now(),
) {
  if (
    !Number.isFinite(timestamp) ||
    now - timestamp > 30000 ||
    timestamp > now + 5000
  )
    return "stale";
  if (!Number.isFinite(accuracy) || accuracy <= 0 || accuracy > 50)
    return "approximate";
  return "usable";
}
