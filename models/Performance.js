
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