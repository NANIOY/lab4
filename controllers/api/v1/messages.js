const Message = require("../../../models/Message");
const User = require("../../../models/User");

const index = async (req, res) => {
    try {
        const { username } = req.query;
        const messages = await Message.find({}).populate("user", "username");

        const filteredMessages = username ? messages.filter((message) => message.user.username === username) : messages;

        res.json({
            status: "success",
            message: "GET messages for user",
            data: [{ messages: filteredMessages }],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const create = async (req, res) => {
    const { message: messageText, user: username } = req.body;

    let user = await User.findOne({ username }) || new User({ username });

    const newMessage = await Message.create({ message: messageText, user });

    res.json({
        status: "success",
        message: "POST a new message",
        data: [{ message: newMessage }],
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
            data: { message },
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
            data: { message },
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