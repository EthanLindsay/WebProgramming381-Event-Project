const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Conference', 'Workshop', 'Festival', 'Private', 'Corporate'],
    required: true
  },
  date:     { type: Date,   required: true },
  time:     { type: String, required: true },
  location: { type: String, required: true },
  price:    { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  
  // bookedCount is incremented on each confirmed booking and decremented on cancellation
  bookedCount: { type: Number, default: 0, min: 0 },
  image:    { type: String, default: '/images/placeholder.jpg' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// How many tickets are still available
eventSchema.virtual('availableTickets').get(function () {
  return this.capacity - this.bookedCount;
});

// Convenience flag for views
eventSchema.virtual('isSoldOut').get(function () {
  return this.bookedCount >= this.capacity;
});

module.exports = mongoose.model('Event', eventSchema);
