import { Router } from "express";
import { exec } from "child_process";


const router = Router();

// Executes a shell command (like Sequelize CLI commands)
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);
      resolve(stdout);
    });
  });
};


// ------------------ ROUTES ------------------

// Run all migrations
router.post('rae/migrate', async (req, res) => {
  try {
    const output = await runCommand('npx sequelize-cli db:migrate');
    res.json({ status: 'Migrations completed', output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Undo last migration
router.post('rae/migrate/undo', async (req, res) => {
  try {
    const output = await runCommand('npx sequelize-cli db:migrate:undo');
    res.json({ status: 'Last migration undone', output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Undo all migrations
router.post('rae/migrate/undo-all', async (req, res) => {
  try {
    const output = await runCommand('npx sequelize-cli db:migrate:undo:all');
    res.json({ status: 'All migrations undone', output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Run all seeders
router.post('rae/seed', async (req, res) => {
  try {
    const output = await runCommand('npx sequelize-cli db:seed:all');
    res.json({ status: 'Seeders executed', output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router