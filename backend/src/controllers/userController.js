exports.profile = async (req, res) => {
  const { password, ...safeUser } = req.user.toObject();
  res.json(safeUser);
};

exports.updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  if (name) req.user.name = name;
  if (typeof avatar === 'string') req.user.avatar = avatar;
  await req.user.save();
  const { password, ...safeUser } = req.user.toObject();
  res.json(safeUser);
};
