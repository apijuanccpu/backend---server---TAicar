var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Factura = require('../models/factura');
// var PressupostDetall = require('../models/pressupostdetall');
// var Reserva = require('../models/reserva');


//Rutas

// ===================
//Obtener totes les Factures
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Factura.find({})

    .populate('client')
        .skip(desde)
        // .limit()
        .exec(

            (err, factures) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando factura',
                        errors: err
                    });
                }

                Factura.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        factures: factures,
                        total: conteo
                    });
                });
            });
});

// ===================
// Obtener factura porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Factura.findById(id)
        .populate('client')
        .exec((err, factura) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar pressupost',
                    errors: err
                });
            }
            if (!factura) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El factura con el id ' + id + ' no existe',
                    errors: { message: 'No existe un pressupost con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                factura: factura
            });
        });
});

// ===================
// Actualizar
// =========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Factura.findById(id, (err, factura) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El factura no existe',
                errors: err
            });
        }
        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id' + id + ' no existe',
                errors: { message: 'No existe factura con ese dni' }
            });
        }

        factura.num = body.num;
        factura.data = body.data;
        factura.data_pagament = body.data_vigencia;
        factura.client = body.client;
        factura.preu_brut = body.preu_brut;
        factura.preu_net = body.preu_net;
        factura.observacions = body.observacions;
        factura.estat = body.estat;


        factura.save((err, facturaActualitzada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar factura',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                factura: facturaActualitzada
            });
        });


    });



});

// ===================
//Crear nuevo usuario
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var factura = new Factura({
        num: body.num,
        data: body.data,
        data_pagament: body.data,
        // viatgers: body.viatgers
        // vehicle: body.vehicle,
        client: body.client,
        preu_brut: body.preu_brut,
        preu_net: body.preu_net,
        observacions: body.observacions,
        estat: 'emesa'
    });
    factura.save((err, facturaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear factura',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            factura: facturaGuardada
        });

    });




});

module.exports = app;