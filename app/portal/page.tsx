"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Search,
  TrendingUp,
  Award,
  Clock,
  User,
  Building2,
  BarChart3,
  Download,
  Moon,
  Sun,
  Shield,
  History,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
} from "lucide-react"

type Fornecedor = {
  id: string
  nome: string
  email: string
  cnpj: string
  telefone?: string
  categoria?: string
  mediaIQF: number
  mediaHomologacao: number
  totalAvaliacoes: number
  status: string
  ultimaAvaliacao: string
  proximaReavaliacao: string
  feedback: string
}

type DocRequisito = {
  id: string
  titulo: string
  descricao?: string
  obrigatorio: boolean
}

type HistoricoEnvio = {
  id: string
  data: string
  documentos: string[]
  status: string
  observacoes?: string
}

function clsx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ")
}

const ACCEPTED_EXT = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "xlsx", "csv"]

function extOK(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase()
  return !!ext && ACCEPTED_EXT.includes(ext)
}

function fmt(n: number) {
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n)
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

async function buscarFornecedorPorNome(nome: string): Promise<Fornecedor | null> {
  try {
    // Requisição para buscar o fornecedor pelo nome
    const response = await fetch(`${API_BASE}/api/fornecedores?nome=${encodeURIComponent(nome)}`);
    
    if (!response.ok) {
      console.error(`Erro ao buscar fornecedor: ${response.statusText}`);
      throw new Error("Erro na busca pelo fornecedor.");
    }

    const fornecedores = await response.json();
    if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
      console.warn(`Fornecedor não encontrado para o nome: ${nome}`);
      return null; 
    }

    const fornecedor = fornecedores[0];

    // Requisição para buscar dados de homologação
    const homologacaoResponse = await fetch(`${API_BASE}/api/dados-homologacao?fornecedor_id=${fornecedor.id}`);
    let dadosHomologacao: { iqf: number; homologacao: string } = { iqf: 0, homologacao: '0' };

    if (homologacaoResponse.ok) {
      dadosHomologacao = await homologacaoResponse.json();
    } else {
      console.warn(`Erro ao buscar dados de homologação para o fornecedor com ID: ${fornecedor.id}`);
    }

    return {
      id: fornecedor.id.toString(),
      nome: fornecedor.nome,
      email: fornecedor.email || "Não informado",  
      cnpj: fornecedor.cnpj || "Não informado",   
      telefone: fornecedor.telefone || "Não informado",  
      categoria: fornecedor.categoria || "",  
      mediaIQF: dadosHomologacao.iqf || 0,  
      mediaHomologacao: dadosHomologacao.homologacao || '0',  
      totalAvaliacoes: 1,  
      status: "EM_ANALISE",
      ultimaAvaliacao: new Date().toISOString(),  
      proximaReavaliacao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),  
      feedback: "Aguardando análise dos documentos enviados.",
    };
  } catch (error) {
    console.error(`Erro ao buscar fornecedor com nome ${nome}:`, error);
    throw new Error(`Erro ao buscar fornecedor: ${error.message}`);
  }
}


async function buscarDocumentosNecessarios(categoria: string): Promise<DocRequisito[]> {
  try {
    const response = await fetch(`${API_BASE}/api/documentos-necessarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoria }),
    })

    if (!response.ok) throw new Error("Erro na busca de documentos")

    const data = await response.json()

    const documentosFixos = ["Código de Ética e Conduta", "Questionário de Fornecedor"]

    const documentosAPI = data.documentos.map((doc: string, index: number) => ({
      id: `doc-${index + 2}`,
      titulo: doc,
      obrigatorio: true,
      descricao: "Conforme planilha CLAF",
    }))

    const documentosFixosFormatados = documentosFixos.map((doc, index) => ({
      id: `doc-fixo-${index}`,
      titulo: doc,
      obrigatorio: true,
      descricao: "Documento obrigatório",
    }))

    return [...documentosFixosFormatados, ...documentosAPI]
  } catch (error) {
    console.error("Erro ao buscar documentos:", error)
    return [
      {
        id: "doc-fixo-0",
        titulo: "Código de Ética e Conduta",
        obrigatorio: true,
        descricao: "Documento obrigatório",
      },
      {
        id: "doc-fixo-1",
        titulo: "Questionário de Fornecedor",
        obrigatorio: true,
        descricao: "Documento obrigatório",
      },
    ]
  }
}

async function enviarDocumentos(
  fornecedorId: string,
  categoria: string,
  arquivos: File[],
): Promise<{ success: boolean; message: string; enviados: string[] }> {
  try {
    const formData = new FormData()
    formData.append("fornecedor_id", fornecedorId)
    formData.append("categoria", categoria)

    arquivos.forEach((arquivo) => {
      formData.append("arquivos", arquivo)
    })

    const response = await fetch(`${API_BASE}/api/envio-documento`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: data.message,
        enviados: data.enviados,
      }
    } else {
      return {
        success: false,
        message: data.message,
        enviados: [],
      }
    }
  } catch (error) {
    console.error("Erro ao enviar documentos:", error)
    return {
      success: false,
      message: "Erro de conexão com o servidor",
      enviados: [],
    }
  }
}

async function buscarHistoricoEnvios(fornecedorId: string): Promise<HistoricoEnvio[]> {
  // Pode ser implementado posteriormente quando o endpoint estiver disponível
  return []
}

export default function PortalFornecedorPage() {
  const [isDark, setIsDark] = useState(true)
  const [categoria, setCategoria] = useState("")
  const [docsRequisitos, setDocsRequisitos] = useState<DocRequisito[]>([])

  const [nomeFornecedor, setNomeFornecedor] = useState("")
  const [resumo, setResumo] = useState<Fornecedor | null>(null)
  const [loadingResumo, setLoadingResumo] = useState(false)

  const [historicoEnvios, setHistoricoEnvios] = useState<HistoricoEnvio[]>([])
  const [loadingHistorico, setLoadingHistorico] = useState(false)
  const [showHistorico, setShowHistorico] = useState(false)

  const [showCoteiModal, setShowCoteiModal] = useState(false)
  const [coteiForm, setCoteiForm] = useState({
    email: "",
    whatsapp: "",
  })

  // Uploads - Adicionando mais 2 slots de upload (7 e 8)
  type UploadSlot = { id: string; file?: File; status?: "idle" | "valid" | "invalid" }
  const [uploads, setUploads] = useState<UploadSlot[]>([
    { id: "upload-1" },
    { id: "upload-2" },
    { id: "upload-3" },
    { id: "upload-4" },
    { id: "upload-5" },
    { id: "upload-6" },
    { id: "upload-7" },
    { id: "upload-8" },
  ])

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "dark"
    setIsDark(currentTheme === "dark")

    if (currentTheme === "dark") {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)

    if (newTheme === "dark") {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
    }

    localStorage.setItem("theme", newTheme)
  }

  useEffect(() => {
    const meta = uploads.map((u) => ({ id: u.id, name: u.file?.name ?? null }))
    localStorage.setItem("portal_uploads_meta", JSON.stringify(meta))
  }, [uploads])

  useEffect(() => {
    if (categoria.trim()) {
      buscarDocumentosNecessarios(categoria).then((docs) => {
        setDocsRequisitos(docs)
      })
    } else {
      setDocsRequisitos([])
    }
  }, [categoria])

  const buscarFornecedor = async () => {
    if (!nomeFornecedor || nomeFornecedor.trim().length < 3) {
      alert("Informe pelo menos 3 caracteres do nome fantasia.")
      return
    }
    setLoadingResumo(true)
    try {
      const data = await buscarFornecedorPorNome(nomeFornecedor)
      if (data) {
        setResumo(data)
        setCategoria(data.categoria || "")
        // Carregar histórico automaticamente
        carregarHistorico(data.id)
      } else {
        setResumo(null)
        setHistoricoEnvios([])
        alert("Fornecedor não encontrado. Verifique o nome e tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error)
      alert("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setLoadingResumo(false)
    }
  }

  const carregarHistorico = async (fornecedorId: string) => {
    setLoadingHistorico(true)
    try {
      const historico = await buscarHistoricoEnvios(fornecedorId)
      setHistoricoEnvios(historico)
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    } finally {
      setLoadingHistorico(false)
    }
  }

  const onPick = (slotId: string) => {
    fileInputs.current[slotId]?.click()
  }

  const onFile = (slotId: string, f?: File) => {
    setUploads((prev) =>
      prev.map((u) => {
        if (u.id !== slotId) return u
        if (!f) return { ...u, file: undefined, status: "idle" }
        if (!extOK(f)) return { ...u, file: undefined, status: "invalid" }
        return { ...u, file: f, status: "valid" }
      }),
    )
  }

  const removeFile = (slotId: string) => onFile(slotId, undefined)

  const [sending, setSending] = useState(false)

  const enviarTudo = async () => {
    if (!resumo) {
      alert("Busque pelo nome da sua empresa antes de enviar documentos.")
      return
    }

    const cat = categoria.trim() || resumo.categoria
    if (!cat) {
      alert("Informe a CATEGORIA para sabermos os requisitos que você necessita ter.")
      return
    }

    const arquivosSelecionados = uploads.filter((u) => !!u.file)
    if (arquivosSelecionados.length === 0) {
      if (!confirm("Você não anexou nenhum documento. Quer continuar mesmo assim?")) return
    }

    setSending(true)

    try {
      const arquivos = arquivosSelecionados.map((u) => u.file!).filter(Boolean)
      const resultado = await enviarDocumentos(resumo.id, cat, arquivos)

      if (resultado.success) {
        alert("Documentos enviados com sucesso: " + resultado.enviados.join(", "))
        setUploads((prev) => prev.map((u) => ({ ...u, file: undefined, status: "idle" })))
        // Recarregar histórico após envio
        carregarHistorico(resumo.id)
      } else {
        alert("Erro ao enviar documentos: " + resultado.message)
      }
    } catch (err) {
      console.error(err)
      alert("Erro de conexão com o servidor")
    } finally {
      setSending(false)
    }
  }

  const getGradientClasses = () => {
    return isDark ? "bg-gradient-to-r from-cyan-400 to-emerald-500" : "bg-gradient-to-r from-orange-400 to-red-500"
  }

  const getAccentColor = () => {
    return isDark ? "text-cyan-400" : "text-orange-500"
  }

  const borderCard = isDark ? "border-slate-700" : "border-slate-200"
  const bgCard = isDark ? "bg-slate-800" : "bg-white"
  const textSoft = isDark ? "text-slate-300" : "text-slate-600"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APROVADO":
        return "text-emerald-400"
      case "EM_ANALISE":
        return "text-amber-400"
      case "PENDENTE":
        return "text-blue-400"
      case "REPROVADO":
      case "REJEITADO":
        return "text-red-400"
      default:
        return textSoft
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APROVADO":
        return <CheckCircle className="w-4 h-4" />
      case "EM_ANALISE":
        return <Clock className="w-4 h-4" />
      case "PENDENTE":
        return <AlertTriangle className="w-4 h-4" />
      case "REPROVADO":
      case "REJEITADO":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleCoteiRegistration = () => {
    if (!coteiForm.email || !coteiForm.whatsapp) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    // Redirect to Cotei with registration data
    const coteiUrl = `https://cotei.app/?email=${encodeURIComponent(coteiForm.email)}&whatsapp=${encodeURIComponent(coteiForm.whatsapp)}`
    window.open(coteiUrl, "_blank")
    setShowCoteiModal(false)
  }

  return (
    <div
      className={clsx(
        "min-h-screen transition-all duration-300 overflow-x-hidden",
        isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900",
      )}
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className={`absolute w-96 h-96 -top-48 -right-48 rounded-full ${
            isDark
              ? "bg-gradient-to-br from-cyan-400 to-emerald-500 opacity-5"
              : "bg-gradient-to-br from-orange-400 to-red-500 opacity-10"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute w-72 h-72 -bottom-36 -left-36 rounded-full ${
            isDark
              ? "bg-gradient-to-br from-cyan-400 to-emerald-500 opacity-5"
              : "bg-gradient-to-br from-orange-400 to-red-500 opacity-10"
          } animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute w-48 h-48 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isDark
              ? "bg-gradient-to-br from-cyan-400 to-emerald-500 opacity-5"
              : "bg-gradient-to-br from-orange-400 to-red-500 opacity-10"
          } animate-pulse delay-2000`}
        ></div>
      </div>

      <header
        className={clsx(
          "fixed top-0 left-0 right-0 backdrop-blur-xl border-b z-50 transition-all duration-300",
          isDark ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-slate-200",
        )}
      >
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao início</span>
            </Link>
            <div className={`w-px h-6 ${isDark ? "bg-slate-700" : "bg-slate-300"}`}></div>
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${getAccentColor()}`} />
              <span className="font-semibold">Portal do Fornecedor</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCoteiModal(true)}
              className={clsx(
                "group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                getGradientClasses(),
                "text-white",
                isDark ? "hover:shadow-cyan-400/25" : "hover:shadow-orange-400/25",
              )}
              title="Cadastre-se para receber alertas de cotações por email e WhatsApp"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Bell className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Cadastre-se no Cotei</span>
              <div className="absolute -right-1 -top-1 w-4 h-4 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150"></div>
            </button>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-16 px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 border px-4 py-2 rounded-full text-sm mb-8 animate-fade-in-up ${
              isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-600"
            }`}
          >
            <Award className={`w-4 h-4 ${getAccentColor()}`} />
            <span>Sistema Integrado de Avaliação</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in-up animation-delay-200">
            Gerencie Sua{" "}
            <span
              className={`bg-clip-text text-transparent ${
                isDark ? "bg-gradient-to-r from-cyan-400 to-emerald-500" : "bg-gradient-to-r from-orange-400 to-red-500"
              }`}
            >
              Homologação
            </span>
          </h1>

          <p
            className={`text-xl mb-12 leading-relaxed animate-fade-in-up animation-delay-400 max-w-2xl mx-auto ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Consulte suas notas IQF e de homologação, envie documentos e acompanhe seu status em tempo real.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-8 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-4 space-y-8">
            <div
              className={clsx(
                "border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl",
                borderCard,
                bgCard,
                isDark ? "hover:shadow-cyan-400/10" : "hover:shadow-orange-400/20",
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getGradientClasses()}`}>
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Buscar Nome Fantasia</h2>
                  <p className={clsx("text-sm", textSoft)}>Digite o nome da sua empresa</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  value={nomeFornecedor}
                  onChange={(e) => setNomeFornecedor(e.target.value)}
                  placeholder="Ex.: TRANSPORTES SILVA LTDA"
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all duration-300",
                    isDark
                      ? "bg-slate-900/60 border-slate-700 focus:ring-cyan-400/40 focus:border-cyan-400"
                      : "bg-white border-slate-300 focus:ring-orange-400/40 focus:border-orange-400",
                  )}
                  onKeyPress={(e) => e.key === "Enter" && buscarFornecedor()}
                />

                <button
                  onClick={buscarFornecedor}
                  disabled={loadingResumo}
                  className={clsx(
                    "w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                    getGradientClasses(),
                    loadingResumo && "opacity-70 cursor-not-allowed",
                    isDark ? "hover:shadow-cyan-400/25" : "hover:shadow-orange-400/25",
                  )}
                >
                  {loadingResumo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Buscar Dados
                    </>
                  )}
                </button>
              </div>
            </div>

            {resumo && (
              <div
                className={clsx(
                  "border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl animate-fade-in-up",
                  borderCard,
                  bgCard,
                  isDark ? "hover:shadow-cyan-400/10" : "hover:shadow-orange-400/20",
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getGradientClasses()}`}>
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Seus Indicadores</h2>
                    <p className={clsx("text-sm", textSoft)}>{resumo.totalAvaliacoes} avaliação(ões) encontrada(s)</p>
                  </div>
                </div>

                <div className={clsx("rounded-xl p-4 mb-6 border", borderCard)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className={`w-4 h-4 ${getAccentColor()}`} />
                    <span className="font-medium">{resumo.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-75 mb-2">
                    <User className="w-3 h-3" />
                    <span>{resumo.cnpj}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-75 mb-1">
                    <Phone className="w-3 h-3" />
                    <span>{resumo.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-75">
                    <Mail className="w-3 h-3" />
                    <span>{resumo.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={clsx("rounded-xl p-4 border text-center", borderCard)}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className={`w-4 h-4 ${getAccentColor()}`} />
                      <span className="text-xs opacity-70">Média IQF</span>
                    </div>
                    <div className="text-2xl font-bold">{fmt(resumo.mediaIQF)}%</div>
                  </div>

                  <div className={clsx("rounded-xl p-4 border text-center", borderCard)}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className={`w-4 h-4 ${getAccentColor()}`} />
                      <span className="text-xs opacity-70">Homologação</span>
                    </div>
                    <div className="text-2xl font-bold">{fmt(resumo.mediaHomologacao)}%</div>
                  </div>
                </div>

                <div className={clsx("rounded-xl p-4 border mb-4", borderCard)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70">Status Atual</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-50" />
                      <span className="text-xs opacity-50">
                        {new Date(resumo.ultimaAvaliacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={getStatusColor(resumo.status)}>{getStatusIcon(resumo.status)}</div>
                    <span className={`font-semibold ${getStatusColor(resumo.status)}`}>
                      {resumo.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <Calendar className="w-3 h-3" />
                    <span>Próxima reavaliação: {new Date(resumo.proximaReavaliacao).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs opacity-70 mb-2">Feedback Detalhado</div>
                  <div className={clsx("text-sm p-3 rounded-lg border", borderCard)}>{resumo.feedback}</div>
                </div>

                <button
                  onClick={() => setShowHistorico(!showHistorico)}
                  className={clsx(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5",
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700",
                  )}
                >
                  <History className="w-4 h-4" />
                  {showHistorico ? "Ocultar Histórico" : "Ver Histórico de Envios"}
                </button>
              </div>
            )}

            {resumo && showHistorico && (
              <div
                className={clsx(
                  "border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl animate-fade-in-up",
                  borderCard,
                  bgCard,
                  isDark ? "hover:shadow-cyan-400/10" : "hover:shadow-orange-400/20",
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getGradientClasses()}`}>
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Histórico de Envios</h2>
                    <p className={clsx("text-sm", textSoft)}>Últimos documentos enviados</p>
                  </div>
                </div>

                {loadingHistorico ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Carregando histórico...</span>
                  </div>
                ) : historicoEnvios.length === 0 ? (
                  <div className={clsx("text-center py-8 text-sm", textSoft)}>
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhum envio encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historicoEnvios.map((envio) => (
                      <div
                        key={envio.id}
                        className={clsx("border rounded-xl p-4 transition-all duration-300", borderCard)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={getStatusColor(envio.status)}>{getStatusIcon(envio.status)}</div>
                            <span className={`text-sm font-medium ${getStatusColor(envio.status)}`}>
                              {envio.status.replace("_", " ")}
                            </span>
                          </div>
                          <span className="text-xs opacity-70">{new Date(envio.data).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="text-sm mb-2">
                          <strong>Documentos:</strong> {envio.documentos.join(", ")}
                        </div>
                        {envio.observacoes && (
                          <div className={clsx("text-xs p-2 rounded border", borderCard)}>{envio.observacoes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="lg:col-span-4 space-y-8">
            <div
              className={clsx(
                "border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl",
                borderCard,
                bgCard,
                isDark ? "hover:shadow-cyan-400/10" : "hover:shadow-orange-400/20",
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getGradientClasses()}`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Sua Categoria</h2>
                  <p className={clsx("text-sm", textSoft)}>Conforme Procedimento Engeman..</p>
                </div>
              </div>

              <input
                value={categoria || ""}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex.: TRANSPORTADORA"
                className={clsx(
                  "w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all duration-300 mb-6",
                  isDark
                    ? "bg-slate-900/60 border-slate-700 focus:ring-cyan-400/40 focus:border-cyan-400"
                    : "bg-white border-slate-300 focus:ring-orange-400/40 focus:border-orange-400",
                )}
              />

              {categoria && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-sm">Downloads Obrigatórios</h3>
                    <div
                      className={`px-2 py-1 rounded text-xs ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                    >
                      CLAF.xlsx
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <a
                      href="/docs/CÓDIGO DE ÉTICA ENGEMAN.pdf"
                      target="_blank"
                      className={clsx(
                        "group relative overflow-hidden flex items-center justify-center gap-3 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                        getGradientClasses(),
                        isDark ? "hover:shadow-cyan-400/30" : "hover:shadow-orange-400/30",
                      )}
                      rel="noreferrer"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Download className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Código de Ética e Conduta</span>
                      <div className="absolute -right-2 -top-2 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150"></div>
                    </a>

                    <a
                      href="/docs/QUESTIONÁRIO.docx"
                      target="_blank"
                      className={clsx(
                        "group relative overflow-hidden flex items-center justify-center gap-3 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                        getGradientClasses(),
                        isDark ? "hover:shadow-cyan-400/30" : "hover:shadow-orange-400/30",
                      )}
                      rel="noreferrer"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Download className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Questionário de Fornecedor</span>
                      <div className="absolute -right-2 -top-2 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150"></div>
                    </a>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-medium">Documentos Exigidos</h3>
                  <div
                    className={`px-2 py-1 rounded text-xs ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                  >
                    CLAF.xlsx
                  </div>
                </div>

                {!categoria ? (
                  <div
                    className={clsx(
                      "text-sm text-center py-8 rounded-xl border-2 border-dashed",
                      isDark ? "border-slate-700 text-slate-400" : "border-slate-300 text-slate-500",
                    )}
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Digite uma categoria para ver os requisitos
                  </div>
                ) : docsRequisitos.length === 0 ? (
                  <div
                    className={clsx(
                      "text-sm text-center py-8 rounded-xl border-2 border-dashed",
                      isDark ? "border-slate-700 text-slate-400" : "border-slate-300 text-slate-500",
                    )}
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Carregando documentos...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {docsRequisitos.map((d) => (
                      <div key={d.id} className={clsx("p-4 rounded-lg border transition-colors", borderCard)}>
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${d.obrigatorio ? "bg-red-400" : "bg-slate-400"}`}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">{d.titulo}</div>
                            {d.descricao && <div className={clsx("text-xs mb-2", textSoft)}>{d.descricao}</div>}

                            <div
                              className={clsx(
                                "text-xs p-2 rounded border-l-2 border-l-blue-400",
                                isDark ? "bg-slate-800/50" : "bg-blue-50",
                              )}
                            >
                              <div className="font-medium text-gray-600 mb-1">Exemplos de documentos aceitos:</div>
                              <div className={clsx("text-xs", textSoft)}>
                                {d.titulo.toLowerCase().includes("contrato") &&
                                  "• Contrato Social atualizado • Alterações contratuais • Ata de assembleia"}
                                {d.titulo.toLowerCase().includes("certidão") &&
                                  "• Certidão de regularidade fiscal • Certidão negativa de débitos • CND do INSS"}
                                {d.titulo.toLowerCase().includes("licença") &&
                                  "• Licença de funcionamento • Alvará sanitário • Licença ambiental"}
                                {d.titulo.toLowerCase().includes("seguro") &&
                                  "• Apólice de seguro vigente • Comprovante de pagamento • Certificado de cobertura"}
                                {d.titulo.toLowerCase().includes("balanço") &&
                                  "• Balanço patrimonial • DRE • Demonstrações contábeis auditadas"}
                                {d.titulo.toLowerCase().includes("qualidade") &&
                                  "• Certificado ISO • Certificado de qualidade • Laudos técnicos"}
                                {!d.titulo.toLowerCase().includes("contrato") &&
                                  !d.titulo.toLowerCase().includes("certidão") &&
                                  !d.titulo.toLowerCase().includes("licença") &&
                                  !d.titulo.toLowerCase().includes("seguro") &&
                                  !d.titulo.toLowerCase().includes("balanço") &&
                                  !d.titulo.toLowerCase().includes("qualidade") &&
                                  "• Documentos oficiais • Comprovantes • Certificados relacionados"}
                              </div>
                            </div>
                          </div>
                          {d.obrigatorio && (
                            <div className="text-xs text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded">
                              Obrigatório
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-4 space-y-8">
            <div
              className={clsx(
                "border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl",
                borderCard,
                bgCard,
                isDark ? "hover:shadow-cyan-400/10" : "hover:shadow-orange-400/20",
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getGradientClasses()}`}>
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Anexar Documentos</h2>
                  <p className={clsx("text-sm", textSoft)}>Até 8 arquivos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {uploads.map((u, index) => (
                  <div
                    key={u.id}
                    className={clsx("border rounded-xl p-4 transition-all duration-300 hover:shadow-md", borderCard)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getGradientClasses()} text-white`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{u.file ? u.file.name : "Selecionar arquivo"}</div>
                        <div className={clsx("text-xs", textSoft)}>PDF, DOC, DOCX, JPG, PNG, XLSX, CSV</div>
                      </div>
                    </div>

                    <input
                      ref={(el) => (fileInputs.current[u.id] = el)}
                      type="file"
                      className="hidden"
                      onChange={(e) => onFile(u.id, e.target.files?.[0])}
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPick(u.id)}
                        className={clsx(
                          "flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
                          isDark
                            ? "bg-slate-900/60 hover:bg-slate-900 text-slate-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700",
                        )}
                      >
                        {u.file ? "Alterar" : "Escolher"}
                      </button>
                      {u.file && (
                        <button
                          onClick={() => removeFile(u.id)}
                          className={clsx(
                            "px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:-translate-y-0.5",
                            isDark
                              ? "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                              : "bg-red-50 text-red-600 hover:bg-red-100",
                          )}
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    {u.status === "invalid" && (
                      <div className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Formato não aceito
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={enviarTudo}
                disabled={sending}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  getGradientClasses(),
                  sending ? "opacity-70 cursor-not-allowed" : "",
                  isDark ? "hover:shadow-cyan-400/25" : "hover:shadow-orange-400/25",
                )}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" /> Enviar Documentos
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer
        className={clsx(
          "py-12 text-center border-t",
          isDark ? "text-slate-400 border-slate-700 bg-slate-800" : "text-slate-600 border-slate-200 bg-slate-50",
        )}
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getGradientClasses()}`}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Portal do Fornecedor Engeman</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Engeman – Sistema Integrado de Homologação</p>
        </div>
      </footer>

      <button
        onClick={toggleTheme}
        className={clsx(
          "fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-50",
          getGradientClasses(),
          isDark ? "hover:shadow-cyan-400/40" : "hover:shadow-orange-400/40",
        )}
        title="Alternar tema"
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {showCoteiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div
            className={clsx(
              "w-full max-w-md rounded-3xl p-8 transition-all duration-300 animate-fade-in-up",
              bgCard,
              borderCard,
              "border shadow-2xl",
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getGradientClasses()}`}>
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Cadastre-se no Cotei</h2>
                <p className={clsx("text-sm", textSoft)}>Receba alertas de cotações</p>
              </div>
            </div>

            <div className={clsx("rounded-xl p-4 mb-6 border", borderCard)}>
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className={`w-4 h-4 mt-0.5 ${getAccentColor()}`} />
                <div className="text-sm">
                  <p className="font-medium mb-1">Como funciona:</p>
                  <ul className={clsx("text-xs space-y-1", textSoft)}>
                    <li>• Receba todas as cotações enviadas para você por email</li>
                    <li>• Alertas instantâneos no WhatsApp com mapa de cotação</li>
                    <li>• Responda rapidamente e não perca oportunidades</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email para receber cotações</label>
                <input
                  type="email"
                  value={coteiForm.email}
                  onChange={(e) => setCoteiForm({ ...coteiForm, email: e.target.value })}
                  placeholder="seu@email.com"
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all duration-300",
                    isDark
                      ? "bg-slate-900/60 border-slate-700 focus:ring-cyan-400/40 focus:border-cyan-400"
                      : "bg-white border-slate-300 focus:ring-orange-400/40 focus:border-orange-400",
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp para alertas</label>
                <input
                  type="tel"
                  value={coteiForm.whatsapp}
                  onChange={(e) => setCoteiForm({ ...coteiForm, whatsapp: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className={clsx(
                    "w-full px-4 py-3 rounded-xl outline-none border focus:ring-2 transition-all duration-300",
                    isDark
                      ? "bg-slate-900/60 border-slate-700 focus:ring-cyan-400/40 focus:border-cyan-400"
                      : "bg-white border-slate-300 focus:ring-orange-400/40 focus:border-orange-400",
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCoteiModal(false)}
                className={clsx(
                  "flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5",
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700",
                )}
              >
                Cancelar
              </button>
              <button
                onClick={handleCoteiRegistration}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  getGradientClasses(),
                  isDark ? "hover:shadow-cyan-400/25" : "hover:shadow-orange-400/25",
                )}
              >
                <Bell className="w-4 h-4" />
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
