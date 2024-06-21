const mongoose = require('mongoose');



// Define match schema
const matchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxPlayers: {
        type: Number,
        required: true
    },
    currentPlayers: {
        type: Number,
        default: 0
    }
});
matchSchema.index({name: 'text'});
const Match = mongoose.model('Match', matchSchema);

// Export the model
module.exports =  {
    Match
};