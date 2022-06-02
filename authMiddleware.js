module.exports = {
    authMiddleware: function(req, res, next) {
        if (req.isAuthenticated()) {
            if(req.user.isAdmin == true) {
                return next();
            } else {
                return res.status(500).json({ msg: "Usuário não um Administrador!" });
            }
        } else {
            return res.status(401).json({ msg: "Faça o login para acessar essa rota!" });
        }
    }
}