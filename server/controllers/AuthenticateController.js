class AuthenticateController {
  async verifyTokenUser(req, res) {
    await res.json(req.user);
  }
}

module.exports = new AuthenticateController();
