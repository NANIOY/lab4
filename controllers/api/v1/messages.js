const Message = require("../../../models/Message");
const User = require("../../../models/User");

const index = async (req, res) => {
    try {
        // get the username from the request query
        const { username } = req.query;

        // fetch all messages and populate the 'user' field with the 'username' attribute
        const messages = await Message.find({}).populate("user", "username");

        // filter messages based on the provided username or return all messages
        const filteredMessages = username ? messages.filter((message) => message.user.username === username) : messages;

        // send a JSON response with the filtered messages
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

// create new messages
const create = async (req, res) => {
    try {
        // extract message text and username from the request body
        const { message: messageText, user: username } = req.body;

        // find an existing user or create a new one based on the provided username
        let user = await User.findOne({ username }) || new User({ username });

        // create a new message using the message text and user
        const newMessage = await Message.create({ message: messageText, user });

        // send a JSON response with the newly created message
        res.json({
            status: "success",
            message: "POST a new message",
            data: [{ message: newMessage }],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

// filter by message id
const getMessageById = async (req, res) => {
    try {
        // get a message by its unique ID and populate the 'user' field with 'username'
        const message = await Message.findById(req.params.id).populate("user", "username");

        // if the message is not found, return a 404 error response
        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        // send a JSON response with the requested message
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

// update message by id
const updateMessage = async (req, res) => {
    try {
        // get the message ID from the request parameters and the updated message text from the request body
        const { id } = req.params;
        const { message: updatedMessage } = req.body;

        // find and update the message by its ID, populating the 'user' field with 'username'
        const message = await Message.findByIdAndUpdate(id, { message: updatedMessage }, { new: true })
            .populate("user", "username");

        // if the message is not found, return a 404 error response
        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        // send a JSON response with the updated message and username
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

// delete message by id
const deleteMessage = async (req, res) => {
    try {
        // get the message ID from the request parameters
        const { id } = req.params;

        // find and delete the message by its ID
        const message = await Message.findByIdAndDelete(id);

        // if the message is not found, return a 404 error response
        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        // send a success response indicating that the message was removed
        res.json({
            status: "success",
            message: "The message was removed",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

// export controller functions as methods
module.exports = {
    index,
    create,
    getMessageById,
    updateMessage,
    deleteMessage,
};