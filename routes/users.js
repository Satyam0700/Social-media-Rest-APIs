const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')
//update user

router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(String(req.body.password), salt);
            } catch (error) {
                console.log(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json('Account has been updated')
        } catch (error) {
            console.log(error)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
});

//delete user

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been Deleted')
        } catch (error) {
            console.log(error)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
});

//get a user

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    } catch (error) {
        console.log(error);
    }
})

//follow a user

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.body.userId } });
          res.status(200).json("user has been follwed");
        } else {
            res.status(403).json("You allready follow this user");
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.body.userId } });
          res.status(200).json("user has been unfollwed");
        } else {
            res.status(403).json("You don't follow this user");
        }
    } else {
        res.status(403).json("you can't unfollow yourself");
    }
});

module.exports = router