import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         minLength: 4,
         maxLength: 50,
         required: true,
         trim: true,
      },
      lastName: {
         type: String,
         minLength: 3,
         maxLength: 60,
         required: true,
         trim: true,
      },
      fullName: {
         type: String,
      },
      email: {
         type: String,
         required: true,
         match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
         ],
         lowercase: true,
      },
      role: {
         type: String,
         enum: ['admin', 'writer', 'guest'],
      },
      age: {
         type: Number,
         min: 1,
         max: 99,
      },
      numberOfArticles: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

userSchema.pre('validate', function (next) {
   if (this.age < 0) {
      this.age = 1;
   }
   next();
});

userSchema.pre('save', function (next) {
   this.fullName = `${this.firstName} ${this.lastName}`;
   next();
});

const User = mongoose.model('User', userSchema);

export default User;
