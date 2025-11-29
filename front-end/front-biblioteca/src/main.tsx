import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//pages
import './index.css'
import Login from './pages/login'
import HomePage from './pages/home'
import AdminLogin from './pages/admin/login'
import AdminHome from './pages/admin/home'
import ConsultaLivrosAdmin from './pages/admin/consulta'
import EditarLivroAdmin from './pages/admin/atualizar'
import RegistrarEmprestimoAdmi from './pages/admin/emprestimo'
import CadastrarLivroAdmin from './pages/admin/cadastrar'
import RegistrarDevolucaoAdmin from './pages/admin/devolucao'
import MasterHome from './pages/master/home'
import AlteracaoSenhaMaster from './pages/master/alterar-senha'
import ConsultaLivrosMaster from './pages/master/consulta'
import EditarLivroMaster from './pages/master/atualizar'
import RegistrarEmprestimoMaster from './pages/master/emprestimo'
import CadastrarLivroMaster from './pages/master/cadastrar'
import RegistrarDevolucaoMaster from './pages/master/devolucao'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/admin' element={<AdminLogin />}/>
        <Route path='/home/admin' element={<AdminHome />}/>
        <Route path='/consulta/admin' element={<ConsultaLivrosAdmin />}/>
        <Route path='/editarLivro/admin/:id' element={<EditarLivroAdmin />} />
        <Route path='/emprestimo/admin' element={<RegistrarEmprestimoAdmi />}/>
        <Route path='/cadastrarLivro/admin' element={<CadastrarLivroAdmin />}/>
        <Route path='/devolucaoLivro/admin' element={<RegistrarDevolucaoAdmin />}/>
        <Route path='/home/master' element={<MasterHome />}/>
        <Route path='/alteracaosenha/master' element={<AlteracaoSenhaMaster />}/>
        <Route path='/consulta/master' element={<ConsultaLivrosMaster />}/>
        <Route path='/editarLivro/master/:id' element={<EditarLivroMaster />} />
        <Route path='/emprestimo/master' element={<RegistrarEmprestimoMaster />}/>
        <Route path='/cadastrarLivro/master' element={<CadastrarLivroMaster />}/>
        <Route path='/devolucaoLivro/master' element={<RegistrarDevolucaoMaster />}/>
      </Routes>
    </Router>
  </StrictMode>,
)