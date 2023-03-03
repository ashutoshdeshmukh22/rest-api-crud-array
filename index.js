const express = require('express');
const { func } = require('joi');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
  {
    id: 1,
    name: 'Node JS',
  },
  {
    id: 2,
    name: 'React JS',
  },
  {
    id: 3,
    name: 'Express JS',
  },
];

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body); // result.error

  if (error)
    // 400 Bad Request
    // The REST Ful Convention is to return response with status code
    return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

// update course
app.put('/api/courses/:id', (req, res) => {
  // 1st Look for Course if not found then return 404

  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send('The Course with given id was not found');

  // 2nd Then Validate if invalid return 400 - Bad Request
  //   const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // result.error

  if (error) return res.status(400).send(result.error.details[0].message);
  //stop execution of this block

  // 3rd Then Update course and Return the updated course

  course.name = req.body.name;
  res.send(course);
});

// get single course
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send('The Course with given id was not found');

  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  // look for course if not exist, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send('The Course with given id was not found');

  // Otherwise Delete it
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
// app.post();
// app.put();
// app.delete();
