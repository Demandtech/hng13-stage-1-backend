function getStatusColor(status) {
  if (status >= 500) return "\x1b[31m";
  if (status >= 400) return "\x1b[33m";
  if (status >= 300) return "\x1b[36m";
  if (status >= 200) return "\x1b[32m";
  return "\x1b[0m";
}

export default function logRequest(req, statusCode, startTime) {
  const duration = Date.now() - startTime;
  const method = req.method.padEnd(6); // align column width
  const statusColor = getStatusColor(statusCode);

  console.log(
    `${method} ${
      req.url
    } - ${new Date().toISOString()} → ${statusColor}${statusCode}\x1b[0m (${duration}ms)`
  );
}
