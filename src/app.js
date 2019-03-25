import express from 'express'
import path from 'path';
import hbs from 'hbs';
import helpers from './helpers';
import bodyParser from 'body-parser';
import funciones from './funciones';
import validaciones from './validaciones'

const app = express()

const dirPublic = path.join(__dirname, '../public')
const directoriopartials = path.join(__dirname,'../partials')

app.use(express.static(dirPublic))
hbs.registerPartials(directoriopartials)
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('index', {
        funcion: 'Página principal'
    })
})

// rutas coordinador
app.get('/crear-cursos', (req, res) => {
    res.render('crearCursos', {
        funcion : "Crear un curso", 
    })
})

app.post('/crear-cursos', (req, res) => { 
    const respuesta = funciones.crearCurso(req.body)
    console.log(respuesta)
    respuesta.error == 1 ? res.render('crearCursos', {
        funcion : "Crear un curso", 
        error: respuesta.mensaje,
        hayerror: respuesta.error == 1,
        curso: respuesta.cur
    }) : res.render('crearCursos', {
        funcion : "Crear un curso", 
        hayerror: respuesta.error == 1,
        error: respuesta.mensaje,
    })
})


app.get('/ver-inscritos', (req, res) => {
    const id = req.query.id
    let respuesta = ''
    id && (respuesta = funciones.cambiarEstado(id))
    const cursos = funciones.mostrarCursosDisponibles()
    res.render('verInscritos', {
        funcion : "Ver inscritos", 
        cursos,
        mensaje: respuesta
    })
})


app.get('/eliminar-personas',(req, res) => {
    const idCurso = req.query.idCurso
    const idAsp = req.query.idAsp
    idCurso && idAsp && funciones.eliminarAspCur(idCurso,idAsp)    
    const cursos = funciones.mostrarCursosDisponibles()
    res.render('eliminarPersonas', {
        funcion : "Eliminar personas", 
        cursos
    })
})

// rutas aspirantes
app.get('/inscribirme',(req, res) => {
    res.render('inscribirme', {
        funcion : "Inscripción a un curso", 
        cursos: funciones.cursosId()
    })
})


app.post('/inscribirme',(req, res) => {
    const respuesta = funciones.inscribirme(req.body)
    respuesta.error == 1 ? res.render('inscribirme', {
        funcion : "Inscripción a un curso", 
        error: respuesta.mensaje,
        hayerror: respuesta.error == 1,
        asp: respuesta.asp,
        cursos: funciones.cursosId()
    }) : res.render('inscribirme', {
        funcion : "Inscripción a un curso", 
        hayerror: respuesta.error == 1,
        error: respuesta.mensaje,
        cursos: funciones.cursosId()
    })
})


//rutas interesados
app.get('/listar-cursos',(req, res) => {
    const cursos = funciones.mostrarCursosDisponibles()
    res.render('listarCursos', {
        funcion : "Lista de cursos", 
        cursos
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        estudiante: 'error',
        funcion: 'Error'
    })
})

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000')
})
