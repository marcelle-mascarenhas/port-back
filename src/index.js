const express = require('express')
const cors = require('cors')

const { Pool } = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{console.log('olá mundo')})

//PROJETOS
app.post('/projetos', async (req, res) => {
    const { title } = req.body
    try {
        const newProjetos = await pool.query('INSERT INTO projetos(title) VALUES ($1) RETURNING *', [title])
        return res.status(200).send(newProjetos.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.get('/projetos', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM projetos')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }

})

app.patch('/projetos/:projetos_id', async (req, res) => {
    const { projetos_id } = req.params
    const data = req.body

    try {
        const updatedProjetos = await pool.query('UPDATE projetos SET title = ($1), link = ($2) WHERE projetos_id = ($3) RETURNING *', [data.title, data.link, projetos_id])
        return res.status(200).send(updatedProjetos.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.delete('/projetos/:projetos_id', async (req, res) => {
    const { projetos_id } = req.params
    try {
        const deletedProjetos = await pool.query('DELETE FROM projetos WHERE projetos_id = ($1) RETURNING *', [projetos_id])
        return res.status(200).send({
            message: 'Projects successfully deleted',
            deletedProjetos: deletedProjetos.rows
        })

    } catch (err) { res.status(400).send(err) }
})

//TECNOLOGIAS
app.get('/tecnologias', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tecnologias')
        return res.status(200).send(rows)
    } catch (err) {
        return res.status(400).send(err)
    }

})

app.post('/tecnologias', async (req, res) => {
    const { name } = req.body
    try {
        const newTecnologias = await pool.query('INSERT INTO tecnologias(name) VALUES ($1) RETURNING *', [name])
        return res.status(200).send(newTecnologias.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.patch('/tecnologias/:tecnologias_id', async (req, res) => {
    const { tecnologias_id } = req.params
    const data = req.body

    try {
        const updatedTecnologias = await pool.query('UPDATE tecnologias SET name = ($1) WHERE tecnologias_id = ($2) RETURNING *', [data.name, tecnologias_id])
        return res.status(200).send(updatedTecnologias.rows)
    } catch (err) {
        return res.status(400).send(err)
    }
})

app.delete('/tecnologias/:tecnologias_id', async (req, res) => {
    const { tecnologias_id } = req.params
    try {
        const deletedTecnologias = await pool.query('DELETE FROM tecnologias WHERE tecnologias_id = ($1) RETURNING *', [tecnologias_id])
        return res.status(200).send({
            message: 'Technology successfully deleted',
            deletedTecnologias: deletedTecnologias.rows
        })

    } catch (err) { res.status(400).send(err) }
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

