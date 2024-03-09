const express = require('express');
const app = express();
const cors = require('cors');

const { Pool } = require('pg');

var pool;
pool = new Pool({
  user: 'postgres',
  host: 'db',
  password: 'root',
});

const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* Create the tables if they don't exist. I used 3 tables so that I could keep 
it in 2nd and 3rd Normal Form. */
async function initializeDatabase() {
  // await pool.query('DROP TABLE IF EXISTS ingredients');
  // await pool.query('DROP TABLE IF EXISTS ingredient_names');
  // await pool.query('DROP TABLE IF EXISTS recipes');

  await pool.query(`
  CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    directions TEXT,
    timeLastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS ingredient_names (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
  )
`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER,
    recipe_id INTEGER,
    amount VARCHAR(50),
    PRIMARY KEY (id, recipe_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (id) REFERENCES ingredient_names(id) ON DELETE CASCADE
  )
`);
}

// Call the async function to initialize the DB
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1); // Exit the app if DB initialization fails
});


app.get('/ingredients', async (req, res) => {
  const response = await pool.query('SELECT * FROM ingredient_names ORDER BY name ASC');
  res.json(response.rows);
})

app.get('/recipes', async (req, res) => {
  const recipesResponse = await pool.query('SELECT id, title, directions FROM recipes');
  let recipes = recipesResponse.rows;

  // Add ingredients array to each recipe
  for (let recipe of recipes) {
    const ingredientResponse = await pool.query(`
    SELECT i.id AS id, ing.name AS name, i.amount AS amount 
    FROM ingredients AS i
    INNER JOIN ingredient_names AS ing ON i.id = ing.id 
    WHERE i.recipe_id = $1`, [recipe.id]);
    recipe.ingredients = ingredientResponse.rows;
  }

  res.json(recipes);
})

app.post('/recipes', async (req, res) => {
  const { title, ingredients, directions } = req.body;
  console.log(req.body);

  // Insert recipe
  const response = await pool.query('INSERT INTO recipes (title, directions) VALUES ($1, $2) RETURNING *', [title, directions]);
  const insertedRecipeId = response.rows[0].id;

  // Insert ingredients
  if (Array.isArray(ingredients)) { // Check if ingredients is an array
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].id) {
        await pool.query('INSERT INTO ingredients (id, recipe_id, amount) VALUES ($1, $2, $3)', [ingredients[i].id, insertedRecipeId, ingredients[i].amount]);
      } else {
        const ingredientInsertResponse = await pool.query('INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *', [ingredients[i].name]);
        const insertedIngredientId = ingredientInsertResponse.rows[0].id;
        await pool.query('INSERT INTO ingredients (id, recipe_id, amount) VALUES ($1, $2, $3)', [insertedIngredientId, insertedRecipeId, ingredients[i].amount]);
      }
    }
  }

  res.json(response.rows);
})

app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const response = await pool.query('DELETE FROM recipes WHERE id = $1', [id]);

  // Delete any ingredients that are no longer used
  await pool.query('DELETE FROM ingredient_names WHERE id NOT IN (SELECT id FROM ingredients)');

  res.json(response.rows);
})


app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, directions } = req.body;

  // Update recipe
  await pool.query('UPDATE recipes SET title = $1, directions = $2, timeLastModified = CURRENT_TIMESTAMP WHERE id = $3', [title, directions, id]);

  // Delete existing ingredients
  await pool.query('DELETE FROM ingredients WHERE recipe_id = $1', [id]);

  // Insert new ingredients
  if (Array.isArray(ingredients)) { // Check if ingredients is an array
    for (let i = 0; i < ingredients.length; i++) {
      if (ingredients[i].id) {
        await pool.query('INSERT INTO ingredients (id, recipe_id, amount) VALUES ($1, $2, $3)', [ingredients[i].id, id, ingredients[i].amount]);
      } else {
        const ingredientInsertResponse = await pool.query('INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *', [ingredients[i].name]);
        const insertedIngredientId = ingredientInsertResponse.rows[0].id;
        await pool.query('INSERT INTO ingredients (id, recipe_id, amount) VALUES ($1, $2, $3)', [insertedIngredientId, id, ingredients[i].amount]);
      }
    }
  }

  // Delete any ingredients that are no longer used
  await pool.query('DELETE FROM ingredient_names WHERE id NOT IN (SELECT id FROM ingredients)');


  const response = await pool.query('SELECT * FROM recipes');

  res.json(response.rows);
})

app.listen(port, '0.0.0.0')

console.log(`Running on http://0.0.0.0:${port}`);
