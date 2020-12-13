async function signupEmail(req, res) {
  const userDetails = req.body;

  return res.json({ status: true });
}

module.exports = {
  signupEmail,
};
