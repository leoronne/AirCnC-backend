const User = require('../models/User')
const bcrypt = require('bcryptjs');

module.exports = {
  async store(req, res) {
    const { action, name, email, password } = req.body;

    function validateEmailAddress(email) {
      var expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      return expression.test(String(email).toLowerCase());
    }

    if (!validateEmailAddress(email)) {
      return res.status(400).send({
        error: 'Invalid e-mail!'
      })
    }

    let user =
      await User.findOne({
        email
      }).select('+password');


    if (action === 'register') {
      if (!user) {
        user =
          await User.create({ name, email, password });
        return res.json('Done, user registered! Now, you can login!');
      } else {
        return res.status(400).send({
          error: 'User already registered!'
        })
      }
    } else if (action === 'login') {
      if (!user) {
        return res.status(400).send({
          error: 'User doest not exist!'
        });
      }
      if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({
          error: 'Wrong password!'
        });
    }

    user.password = undefined;
    return res.json(user);
  }
}