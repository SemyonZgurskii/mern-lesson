const {Router} = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const router = Router();

router.post("/register",
    [
        check("email", "Некорректный email").isEmail(),
        check("password", "Минимальная длина пароля 6 символов")
            .isLength({min: 6}),
    ],
    async (req, res) => {
    try {
        const {email, password} = req.body;

        const candidate = await User.findOne({email});

        if(candidate) {
            return res.status(400).json({message: "Такой пользователь уже существует"})
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: "Пользователь создан"});
    } catch(e) {
        res.status(500).json({mesage: "Что-то пошло не так, попробуйте снова"});
    }

})

router.post("/login", async (req, res) => {

})
module.exports = router;
