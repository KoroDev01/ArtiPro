const ONLINE_WINDOW_MS = 15 * 60 * 1000;

exports.ONLINE_WINDOW_MS = ONLINE_WINDOW_MS;

exports.isProOnline = (user) => {
  if (!user?.lastActiveAt) return false;
  return Date.now() - new Date(user.lastActiveAt).getTime() < ONLINE_WINDOW_MS;
};

exports.isEffectivelyAvailable = (user) =>
  user?.role === "pro" &&
  user.availability !== false &&
  exports.isProOnline(user);

exports.withProPresence = (user) => {
  const data = user.toObject ? user.toObject() : { ...user };
  if (data.role === "pro") {
    data.isOnline = exports.isProOnline(data);
    data.effectiveAvailability = exports.isEffectivelyAvailable(data);
  }
  return data;
};

exports.markProOffline = () => ({
  availability: false,
  lastActiveAt: null,
});

exports.markProOnline = () => ({
  lastActiveAt: new Date(),
});
