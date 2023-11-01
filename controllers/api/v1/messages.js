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
                },
            },
        ],
    });
};

const getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id).populate("user", "username");

        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        res.json({
            status: "success",
            message: "GET a message by ID",
            data: {
                message: {
                    message: message.message,
                    user: message.user.username,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message: updatedMessage } = req.body;

        const message = await Message.findByIdAndUpdate(id, { message: updatedMessage }, { new: true })
            .populate("user", "username");

        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        res.json({
            status: "success",
            message: "Message updated successfully",
            data: {
                message: {
                    message: message.message,
                    user: message.user.username,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        res.json({
            status: "success",
            message: "The message was removed",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    create,
    getMessageById,
    updateMessage,
    deleteMessage,
};