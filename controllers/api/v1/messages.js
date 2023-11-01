// require the Message model
const Message = require("../../../models/Message");

const index = async (req, res) => {
    try {
        let messages = await Message.find({}).populate("user");

        res.json({
            status: "success",
            message: "GET all messages",
            data: [
                {
                    messages: messages.map((message) => ({
                        _id: message._id,
                        message: message.message,
                        user: message.user,
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
    let message = req.body.message;
    let user = req.body.user;

    try {
        const m = new Message({
            message: message,
            user: user,
        });

        const savedMessage = await m.save();

        res.json({
            status: "success",
            message: "POST a new message",
            data: [
                {
                    message: savedMessage,
                },
            ],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.index = index;
module.exports.create = create;