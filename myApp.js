// Cargar las variables de entorno desde el archivo 'sample.env'
require('dotenv').config({ path: 'sample.env' });
const mongoose = require('mongoose');

// Conectar a la base de datos de MongoDB usando la URI de conexión de las variables de entorno
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema para el modelo 'Person'
const personSchema = new mongoose.Schema({
  name: {
    type: String
  },
  age: {
    type: Number
  },
  favoriteFoods: [String]
});

// Crear el modelo 'Person' basado en el esquema definido
let Person = mongoose.model('Person', personSchema);

// Función para crear y guardar una nueva persona en la base de datos
const createAndSavePerson = (done) => {
  const newPerson = new Person({
    name: "Chris666",
    age: 27,
    favoriteFoods: ["Pozole", "Pizza", "Burgers"]
  });

  // Guardar la nueva persona en la base de datos
  newPerson.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Array de personas a ser creadas en la base de datos
const arrayOfPeople = [
  { name: "Chris666", age: 27, favoriteFoods: ["Pozole", "Burgers"] },
  { name: "Chris", age: 26, favoriteFoods: ["Pozole", "Pizza"] },
  { name: "Christopher", age: 27, favoriteFoods: ["Pizza", "Burgers"] }
];

// Función para crear múltiples personas en la base de datos
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// Función para encontrar personas por su nombre
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (error, peopleFound) => {
    if (error) return console.log(error);
    done(null, peopleFound);
  });
};

// Función para encontrar una persona por una comida favorita
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (error, foodPerson) => {
    if (error) return console.log(error);
    done(null, foodPerson);
  });
};

// Función para encontrar una persona por su ID
const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (error, id) => {
    if (error) return console.log(error);
    done(null, id);
  });
};

// Función para encontrar una persona por su ID, modificar su lista de comidas favoritas y guardarla
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // Encuentra la persona por su ID
  Person.findById(personId, (err, person) => {
    if (err) return done(err);

    // Agrega "hamburger" a la lista de comidas favoritas
    person.favoriteFoods.push(foodToAdd);

    // Guarda la persona actualizada
    person.save((err, updatedPerson) => {
      if (err) return done(err);
      return done(null, updatedPerson);
    });
  });
};

// Función para encontrar una persona por su nombre y actualizar su edad
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName }, // Criterio de búsqueda: nombre
    { age: ageToSet },    // Actualización: establecer la edad a 20
    { new: true, useFindAndModify: false }, // Opciones: new:true devuelve el documento actualizado
    (error, updatedPerson) => {
      if (error) return console.log(error);
      done(null, updatedPerson);
    }
  );
};

// Función para encontrar una persona por su ID y eliminarla
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (error, removePerson) => {
    if (error) return console.log(error);
    done(null, removePerson);
  });
};

// Función para eliminar múltiples personas por su nombre
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  // Encuentra y elimina todas las personas con el nombre "Mary"
  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);
    done(null, result);
  });
};

// Función para construir una cadena de consultas
const queryChain = (done) => {
  const foodToSearch = "burrito";

  // Encuentra todas las personas que tienen "burrito" en su lista de comidas favoritas
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })       // Ordena los resultados por nombre (ascendente)
    .limit(2)                // Limita los resultados a 2 documentos
    .select({ age: 0 })      // Excluye el campo 'age' de los resultados
    .exec((err, data) => {   // Ejecuta la consulta
      if (err) return done(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **NO EDITAR ABAJO DE ESTA LÍNEA** ----------------------------------

// Exportar los modelos y las funciones para ser utilizados en otros archivos
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
