const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define enMatchSchema match schema
const participatedMatchSchema= new mongoose.Schema({
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
        ref: 'User',
        required: true
    },
    paymentToken: {
        type: String
    }
});

const otpSchema = new mongoose.Schema({
    phone: {
        type : String,
        required : true
    },
    UserOTP: {
        type: String
    }
});


const userSchema = new mongoose.Schema({
    avatar: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    userName: {
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
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
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
    IsOrganiser: {
        type: Boolean,
        default : false
    },
    participated: [participatedMatchSchema]
}, { timestamps: true });


// Define match schema
const matchSchema = new mongoose.Schema({
    avatar: {
        type: String
    },
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

// Define user schema


// Encrypt password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) { // Changed userSchema to organizerSchema
    return await bcrypt.compare(candidatePassword, this.password); // Changed user.password to this.password
};

// Define user model
const User = mongoose.model('User', userSchema);
// const Match = mongoose.model('Match', matchSchema);
const otp = mongoose.model('otp', otpSchema)

module.exports = {
    User,
    otp
    // Match
};
