const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const organizedMatchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
        enum: ['tournament', 'scrim'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer',
        required: true
    },
    paymentToken: {
        type: String,
        required: true
    }
});

const organizationSchema = new mongoose.Schema({
    avatar: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    organizer_id: {
        type: _id,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /\d{10}/.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    valid_id: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    organized_matches: [organizedMatchSchema] // Changed from organized_match to organized_matches
}, { timestamps: true });

organizationSchema.pre('save', async function(next) { // Changed userSchema to organizerSchema
    const organizer = this; // Changed user to organizer
    if (!organizer.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(organizer.password, salt); // Changed user.password to organizer.password
        organizer.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

organizationSchema.methods.comparePassword = async function(candidatePassword) { // Changed userSchema to organizerSchema
    return await bcrypt.compare(candidatePassword, this.password); // Changed user.password to this.password
};

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = {
    Organization
};
