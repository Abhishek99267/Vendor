// const mongoose = require("mongoose");

// const performanceSchema = new mongoose.Schema(
//   {
//     vendor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//     },

//     deliveryRating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },

//     qualityRating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },

//     communicationRating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },

//     costRating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },

//     overallRating: {
//       type: Number,
//       default: 0,
//     },

//     review: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     evaluatedBy: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     evaluationDate: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Automatically calculate overall rating
// performanceSchema.pre("save", function (next) {
//   const average =
//     (
//       this.deliveryRating +
//       this.qualityRating +
//       this.communicationRating +
//       this.costRating
//     ) / 4;

//   this.overallRating = Number(average.toFixed(2));

//   next();
// });

// module.exports = mongoose.model("Performance", performanceSchema);



const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(

{

    vendor:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Vendor",

        required:true

    },

    quality:{

        type:Number,

        required:true,

        min:1,

        max:10

    },

    delivery:{

        type:Number,

        required:true,

        min:1,

        max:10

    },

    cost:{

        type:Number,

        required:true,

        min:1,

        max:10

    },

    communication:{

        type:Number,

        required:true,

        min:1,

        max:10

    },

    overall:{

        type:Number,

        default:0

    },

    comments:{

        type:String,

        default:"",

        trim:true

    }

},

{

    timestamps:true

}

);

// ==========================================
// Calculate Overall Rating
// ==========================================

performanceSchema.pre(

"save",

function(next){

    this.overall = Number(

        (

            (

                this.quality +

                this.delivery +

                this.cost +

                this.communication

            ) / 4

        ).toFixed(2)

    );

    next();

}

);

module.exports = mongoose.model(

"Performance",

performanceSchema

);