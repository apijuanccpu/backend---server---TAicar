var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Reserva = require('../models/reserva');

// ==========================================
// Obtener todos los vehiculos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Reserva.find({})
        .skip(desde)
        .limit(5)
        .populate('vehicle')
        .populate('pressupost')
        .exec(
            (err, reserves) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reserves',
                        errors: err
                    });
                }

                Reserva.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        reserves: reserves,
                        total: conteo
                    });

                });

            });
});

// ==========================================
// Obtener reserva
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Reserva.findById(id)
        // .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, reserva) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserva',
                    errors: err
                });
            }

            if (!reserva) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El reserva con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehicle con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                reserva: reserva
            });

        });


});

// ==========================================
// Actualizar Medico
// ==========================================
// app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

//     var id = req.params.id;
//     var body = req.body;

//     Vehicle.findById(id, (err, vehicle) => {


//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar vehicle',
//                 errors: err
//             });
//         }

//         if (!vehicle) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El vehicle con el id ' + id + ' no existe',
//                 errors: { message: 'No existe un medico con ese ID' }
//             });
//         }


//         vehicle.marca = body.marca;
//         vehicle.model = body.model;
//         vehicle.data_adquisicio = body.data_adquisicio;
//         vehicle.matricula = body.matricula;
//         vehicle.places = body.places;
//         vehicle.classificacio = body.classificacio;
//         vehicle.observacions = body.observacions;
//         vehicle.temporada_extra = body.temporada_extra;
//         vehicle.temporada_alta = body.temporada_alta;
//         vehicle.temporada_mitja = body.temporada_mitja;
//         vehicle.temporada_baixa = body.temporada_baixa;

//         vehicle.save((err, vehicleGuardat) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Error al actualizar veh',
//                     errors: err
//                 });
//             }

//             res.status(200).json({
//                 ok: true,
//                 vehicle: vehicleGuardat
//             });

//         });

//     });

// });



// ==========================================
// Crear una nova reserva
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var reserva = new Reserva({
        vehicle: body.vehicle,
        pressupost: body.id_pressupost,
        data_inicial: body.data_inicial,
        data_final: body.data_final

    });

    reserva.save((err, reservaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear reserva',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            reserva: reservaGuardada
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Reserva.findByIdAndRemove(id, (err, reservaEsborrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar reserva',
                errors: err
            });
        }

        if (!reservaEsborrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un veh con ese id',
                errors: { message: 'No existe un veh con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            reserva: reservaEsborrada
        });

    });

});

// ===================
// Obtener reservas por num_pressupost
// =========================
app.get('/perpressupost/:num', (req, res) => {

    var num = req.params.num;

    Reserva.find({
            'pressupost': num
        })
        .populate('pressupost')
        .exec((err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserva',
                    errors: err
                });
            }
            if (!reserves) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El pressupost con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                reserves: reserves
            });
        });
});

// ===================
// Busqueda per num_vehicle
// =========================
app.get('/reservespervehicle/:idvehicle', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    // var data = req.params.data;
    // var datafi = req.params.datafi;





    //var regex = new RegExp(busqueda, 'i');

    Reserva.find(

            { 'vehicle': idvehicle }
        )
        .populate('vehicle')

    .exec((err, reserves) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar reserves',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            reserves: reserves,
            total: reserves.length
        });
    });


});

// ===================
// Obtener informe por fecha
// =========================
// ===================
// Busqueda per filtre
// =========================
app.get('/consultasireservaperdata/:idvehicle/:data', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var data = req.params.data;
    // var datafi = req.params.datafi;




    var tabla = req.params.quinadata;
    //var regex = new RegExp(busqueda, 'i');

    Reserva.find({
        $and: [{ data_inicial: { $lte: data } }, { data_final: { $gte: data } }, { 'vehicle': idvehicle }]

    })


    .populate('pressupost')
        .exec((err, reserves) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserves',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                reserves: reserves,
                total: reserves.length
            });
        });


});

app.get('/consultaperdatafi/:idvehicle/:datafi', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var datafi = req.params.datafi;
    // var datafi = req.params.datafi;




    var tabla = req.params.quinadata;
    //var regex = new RegExp(busqueda, 'i');

    Reserva.find({
        $and: [{ data_inicial: { $lte: datafi } }, { data_final: { $gte: datafi } }, { 'vehicle': idvehicle }]

    })



    .exec((err, reserves1) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar reserves',
                errors: err
            });
        }

        reserves1.find({
            $and: [{ data_inicial: { $lte: datafi } }, { data_final: { $gte: datafi } }, { 'vehicle': idvehicle }]

        });


        res.status(200).json({
            ok: true,
            reserves: reserves,
            total: reserves.length
        });
    });


});

app.get('/consultasireservaavehicle/:idvehicle/:datainici/:datafi', mdAutenticacion.verificaToken, (req, res) => {

    var idvehicle = req.params.idvehicle;
    var datainici = req.params.datainici;
    var datafi = req.params.datafi;
    var tabla = req.params.quinadata;
    //var regex = new RegExp(busqueda, 'i');

    Reserva.find({
        $and: [{ data_inicial: { $lte: datainici } }, { data_final: { $gte: datainici } }, { 'vehicle': idvehicle }]

    })



    .exec((err, reserves1) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar reserves',
                errors: err
            });
        }
        if (!reserves1) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No reserves data inici',
                errors: err
            });
        }

        reserves1.find({
            $and: [{ data_inicial: { $lte: datafi } }, { data_final: { $gte: datafi } }, { 'vehicle': idvehicle }]

        })

        .exec((err, reserves2) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reserves',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                reserves: reserves2,
                total: reserves.length
            });


        });

    });
});


module.exports = app;