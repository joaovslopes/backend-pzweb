const express      = require('express')
const connectDB    = require('./config/db')
const dotenv       = require('dotenv')
const path         = require('path')
const cors         = require('cors')
const cookieParser = require('cookie-parser')

dotenv.config()
const app = express()

const FRONTEND_URL = 'http://localhost:3000'
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Cookie']
}

// 1) Habilita CORS para todas as rotas e preflight
app.use(cors(corsOptions))
// (opcional) app.options('/*', cors(corsOptions))

// 2) Body parser e cookies
app.use(express.json())
app.use(cookieParser())

// 3) Conecta ao MongoDB e registra as rotas
connectDB()
app.use('/api/users',    require('./routes/userRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/launcher', require('./routes/licenseRoutes'))
app.use('/api/category', require('./routes/categoryRoutes'))
app.use('/api/buy',      require('./routes/buyRoutes'))
app.use('/api/upload',   require('./routes/uploadRoutes'))
app.use('/uploads',      express.static(path.join(__dirname, "uploads")))

// 4) Inicia o servidor
const PORT = process.env.PORT || 5005
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
