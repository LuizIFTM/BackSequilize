const db = require("../models");

module.exports = {
    async index(req, res) {
        const { user_id } = req.params;
        const usuario = await db.Usuario.findByPk(user_id, {
            include: { 
                association : 'techs', attributes: [ 'name' ],
                through: {
                    attributes: []
                }
            }
        });
        return res.json(usuario.techs);
    },

    async store(req, res) {
        const { user_id } = req.params;
        const { name } = req.body;

        const usuario = await db.Usuario.findByPk(user_id);

        if(!usuario) {
            return res.status(400).json({ error: 'Usuario não encontrado!' })
        }

        const [ tech ] = await db.Tech.findOrCreate({
            where: { name }
        });

        await usuario.addTech(tech);

        return res.json(tech);
    },

    async delete(req, res) {
        const { user_id } = req.params;
        const { name } = req.body;

        const usuario = await db.Usuario.findByPk(user_id);

        if(!usuario) {
            return res.status(400).json({ error: 'Usuario não encontrado!' })
        }

        const tech = await db.Tech.findOne({
            where: { name }
        });

        await usuario.removeTech(tech);

        return res.json();
    }
};