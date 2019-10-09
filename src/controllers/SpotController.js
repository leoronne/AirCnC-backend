const User = require('../models/User');
const Spot = require('../models/Spot');

module.exports = {
  async index(req, res) {
    const { tech } = req.query;

    const spots = await Spot.find({ techs: tech })

    return res.json(spots);
  },

  async store(req, res) {
    const { originalname: name,
      size,
      key,
      location: url=''
    } = req.file;
    const { company, techs, price } = req.body;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({ error: "User does not exist." });
    }

    const spot = await Spot.create({
      name,
      key,
      url,
      size,
      user: user_id,
      company,
      techs: techs.split(',').map(tech => tech.trim()),
      price
    })

    return res.json(spot);
  },

  async delete (req, res) {
    const spot = await Spot.findById(req.params.id);

    await spot.remove();

    return res.send();
  }

}