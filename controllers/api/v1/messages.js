const Message = require("../../../models/Message");
const User = require("../../../models/User");

const index = async (req, res) => {
    let messages = await Message.find({}).populate({
        path: "user",
        select: "username",
    });
    res.json({
        status: "success",
        message: "GET all messages",
        data: [
            {
                messages: messages,
            },
        ],
    });
};

const create = async (req, res) => {
    const messageText = req.body.message;
    const username = req.body.user;

    let user = await User.findOne({ username });

    if (!user) {
        user = new User({ username });
        await user.save();
    }

    const newMessage = new Message({
        message: messageText,
        user: user,
    });

    await newMessage.save();

    res.json({
        status: "success",
        message: "POST a new message",
        data: [
            {
                message: {
                    message: newMessage.message,
                    user: user.username,
                    _id: newMessage._id,
                    __v: newMessage.__v,
                },
            },
        ],
    });
};

module.exports.index = index;
module.exports.create = create;