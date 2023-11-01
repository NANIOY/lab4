const Message = require("../../../models/Message");
const User = require("../../../models/User");

const index = async (req, res) => {
    try {
        const { username } = req.query;
        const messages = await Message.find({}).populate('user');

        const filteredMessages = messages.filter((message) => message.user && message.user.username === username);

        res.json({
            status: 'success',
            message: 'GET messages for user',
            data: [
                {
                    messages: filteredMessages.map(({ _id, message, user, __v }) => ({
                        _id,
                        message,
                        user: user.username,
                        __v,
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
    const { message: messageText, user: username } = req.body;

    let user = await User.findOne({ username });

    if (!user) {
        user = new User({ username });
        await user.save();
    }

    const newMessage = await Message.create({ message: messageText, user });

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