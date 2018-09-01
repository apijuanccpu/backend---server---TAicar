var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var reservaSchema = new Schema({
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'El id vehicle esun campo obligatorio ']
    },
    pressupost: {
        type: Schema.Types.ObjectId,
        ref: 'Pressupost',
        required: [true, 'El id presusupost esun campo obligatorio ']
    },
    data_inicial: { type: String, required: [true, 'El nombre es necesario'] },
    data_final: { type: String, required: [true, 'El nombre es necesario'] },

}, { collection: 'reserves' });



module.exports = mongoose.model('Reserva', reservaSchema);