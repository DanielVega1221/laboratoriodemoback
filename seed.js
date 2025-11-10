require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Patient = require('./models/Patient');
const ProtocolTemplate = require('./models/ProtocolTemplate');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Conectado a MongoDB');

    // Limpiar colecciones
    await User.deleteMany({});
    await Patient.deleteMany({});
    await ProtocolTemplate.deleteMany({});
    await Order.deleteMany({});
    console.log('✓ Colecciones limpiadas');

    // Crear usuario demo
    const passwordHash = await bcrypt.hash('demo123', 10);
    const user = await User.create({
      username: 'demo@lab',
      passwordHash,
      role: 'admin'
    });
    console.log('✓ Usuario demo creado');

    // Crear 3 protocolos base
    const hemograma = await ProtocolTemplate.create({
      name: 'Hemograma',
      code: 'HEMO',
      fields: [
        { key: 'hematocrito', label: 'Hematocrito', unit: '%', type: 'number', reference: { low: 36, high: 48 } },
        { key: 'hemoglobina', label: 'Hemoglobina', unit: 'g/dL', type: 'number', reference: { low: 12, high: 16 } },
        { key: 'plaquetas', label: 'Plaquetas', unit: '10^3/µL', type: 'number', reference: { low: 150, high: 400 } },
        { key: 'eritrocitos', label: 'Eritrocitos', unit: 'millones/µL', type: 'number', reference: { low: 4.5, high: 5.5 } },
        { key: 'observaciones', label: 'Observaciones', unit: '', type: 'text' }
      ]
    });

    const glucemia = await ProtocolTemplate.create({
      name: 'Glucemia',
      code: 'GLUC',
      fields: [
        { key: 'glucosa', label: 'Glucosa', unit: 'mg/dL', type: 'number', reference: { low: 70, high: 100 } },
        { key: 'tipoMuestra', label: 'Tipo de muestra', unit: '', type: 'select', options: ['Ayunas', 'No ayunas'] },
        { key: 'observaciones', label: 'Observaciones', unit: '', type: 'text' }
      ]
    });

    const hepatograma = await ProtocolTemplate.create({
      name: 'Hepatograma',
      code: 'HEP',
      fields: [
        { key: 'ast', label: 'AST / GOT', unit: 'U/L', type: 'number', reference: { low: 0, high: 40 } },
        { key: 'alt', label: 'ALT / GPT', unit: 'U/L', type: 'number', reference: { low: 0, high: 41 } },
        { key: 'bilirrubina', label: 'Bilirrubina total', unit: 'mg/dL', type: 'number', reference: { low: 0.3, high: 1.2 } },
        { key: 'fosfatasa', label: 'Fosfatasa alcalina', unit: 'U/L', type: 'number', reference: { low: 30, high: 120 } },
        { key: 'observaciones', label: 'Observaciones', unit: '', type: 'text' }
      ]
    });
    console.log('✓ 3 Protocolos base creados');

    // Crear 5 pacientes
    const patients = await Patient.create([
      { firstName: 'Juan', lastName: 'Pérez', dni: '12345678', dob: new Date('1980-05-15'), phone: '1145678901', obraSocial: 'OSDE' },
      { firstName: 'María', lastName: 'González', dni: '23456789', dob: new Date('1992-08-22'), phone: '1156789012', obraSocial: 'Swiss Medical' },
      { firstName: 'Carlos', lastName: 'Rodríguez', dni: '34567890', dob: new Date('1975-11-30'), phone: '1167890123', obraSocial: 'Galeno' },
      { firstName: 'Ana', lastName: 'Martínez', dni: '45678901', dob: new Date('1988-03-10'), phone: '1178901234', obraSocial: 'Medifé' },
      { firstName: 'Luis', lastName: 'Fernández', dni: '56789012', dob: new Date('1995-12-05'), phone: '1189012345', obraSocial: 'OSDE' }
    ]);
    console.log('✓ 5 Pacientes creados');

    // Crear 10 órdenes de ejemplo
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const patient = patients[i % 5];
      const protocols = [hemograma, glucemia, hepatograma];
      const randomProtocol = protocols[i % 3];
      
      orders.push({
        patientId: patient._id,
        createdBy: user._id,
        studies: [{
          protocolCode: randomProtocol.code,
          protocolId: randomProtocol._id,
          displayName: randomProtocol.name
        }],
        obraSocial: patient.obraSocial,
        authNumber: `AUTH${1000 + i}`,
        authorized: i % 2 === 0,
        status: i < 3 ? 'pending' : i < 7 ? 'in-process' : 'completed',
        sampleTaken: i >= 3,
        scheduledAt: new Date()
      });
    }
    await Order.create(orders);
    console.log('✓ 10 Órdenes creadas');

    console.log('\n=== SEED COMPLETADO ===');
    console.log('Usuario: demo@lab');
    console.log('Contraseña: demo123');
    console.log('=======================\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error en seed:', error);
    process.exit(1);
  }
};

seedData();
