const Message = require("../../../models/Message");
const User = require("../../../models/User");

const index = async (req, res) => {
    try {
        const { username } = req.query;
        let messages;

        if (username) {
            messages = await Message.find({})
                .populate({
                    path: "user",
                    match: { username },
                });
        } else {
            messages = await Message.find({}).populate("user");
        }

        const filteredMessages = messages.filter((message) => message.user !== null);

        res.json({
            status: "success",
            message: "GET messages for user",
            data: [
                {
                    messages: filteredMessages.map((message) => ({
                        _id: message._id,
                        message: message.message,
                        user: message.user.username,
                        __v: message.__v,
                    })),
                },
            ],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
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