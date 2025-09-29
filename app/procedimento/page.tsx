"use client"

import { useState, useEffect } from "react"
import { Shield, Award, Clock, AlertTriangle, Star, TrendingUp, FileText, Download, Moon, Sun } from "lucide-react"
import Link from "next/link"

export default function ProcedimentoPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "dark"
    setIsDarkMode(currentTheme === "dark")

    if (currentTheme === "dark") {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark"
    setIsDarkMode(!isDarkMode)

    if (newTheme === "dark") {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
    }

    localStorage.setItem("theme", newTheme)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 overflow-x-hidden ${
        isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      }`}
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className={`absolute w-96 h-96 -top-48 -right-48 rounded-full bg-gradient-to-br from-orange-400 to-red-500 ${
            isDarkMode ? "opacity-5" : "opacity-10"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute w-72 h-72 -bottom-36 -left-36 rounded-full bg-gradient-to-br from-orange-400 to-red-500  ${
            isDarkMode ? "opacity-5" : "opacity-10"
          } animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute w-48 h-48 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br  from-orange-400 to-red-500  ${
            isDarkMode ? "opacity-5" : "opacity-10" 
          } animate-pulse delay-2000`}
        ></div>
      </div>

      <header
        className={`fixed top-0 left-0 right-0 backdrop-blur-xl border-b z-50 transition-all duration-300 ${
          isDarkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={
                isDarkMode
                  ? "/logo.png"
                  : "/logo-branca.png"
              }
              alt="Engeman Logo"
              className="h-12"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#processo"
              className={`font-medium text-sm transition-colors duration-300 relative group ${
                isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Processo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r  from-orange-400 to-red-500 transition-all duration-400 group-hover:w-full"></span>
            </a>
            <a
              href="#criterios"
              className={`font-medium text-sm transition-colors duration-300 relative group ${
                isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Critérios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 group-hover:w-full"></span>
            </a>
            <a
              href="#avaliacao"
              className={`font-medium text-sm transition-colors duration-300 relative group ${
                isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Avaliação
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r  from-orange-400 to-red-500 transition-all duration-500 group-hover:w-full"></span>
            </a>
            <a
              href="/contato"
              className={`font-medium text-sm transition-colors duration-300 relative group ${
                isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Contato
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r  from-orange-400 to-red-500 transition-all duration-500 group-hover:w-full"></span>
            </a>
            <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-600 hover:-translate-2 hover:shadow-lg hover:shadow-orange-300/25">
              <Shield className="w-4 h-4" />
              <Link href = "/" 
              >
              Tela Inicial 
               </Link>
            </button> 
          </nav>
          
        </div>
        
        
      </header>

      <section className="min-h-screen flex items-center justify-center text-center px-8 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 border px-4 py-2 rounded-full text-sm mb-8 ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-slate-100 border-slate-300 text-slate-600"
            }`}
          >
            <Award className="w-4 h-4 text-orange-400" />
            <span>Excelência em Avaliação de Fornecedores</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Padrão{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-400 bg-clip-text text-transparent">Engeman</span>
            <br />
            de Qualidade
          </h1>
          <p
            className={`text-xl mb-12 leading-relaxed max-w-3xl mx-auto ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Sistema rigoroso de avaliação e qualificação de fornecedores, garantindo relacionamentos comerciais
            confiáveis e conformidade com os mais altos padrões de qualidade, segurança e integridade.
          </p>
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">70</div>
              <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>IQF Mínimo</div>
            </div>
            <div className={`w-px h-10 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">70</div>
              <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Nota mínima de Homologação
              </div>
            </div>
            <div className={`w-px h-10 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">100%</div>
              <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Conformidade</div>
            </div>
          </div>
        </div>
      </section>

      <section id="processo" className={`py-24 ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nosso Processo de Avaliação</h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              Metodologia estruturada em três pilares fundamentais para garantir a excelência na cadeia de suprimentos
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between relative">
            <div className="flex flex-col items-center text-center flex-1 relative">
              <div className="w-15 h-15 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg shadow-orange-400/25">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">PG.SM.01 - Aquisição</h4>
              <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Fluxo completo de compra, cotação, análise crítica e aprovação de materiais e serviços
              </p>
            </div>
            <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 mx-4 -mt-8"></div>
            <div className="flex flex-col items-center text-center flex-1 relative">
              <div className="w-15 h-15 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg shadow-orange-400/25">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">PG.SM.02 - Avaliação</h4>
              <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Critérios de desempenho (IQF), RACs e processo de homologação de fornecedores
              </p>
            </div>
            <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 mx-4 -mt-8"></div>
            <div className="flex flex-col items-center text-center flex-1 relative">
              <div className="w-15 h-15 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg shadow-orange-400/25">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">PG.SM.03 - Almoxarifado</h4>
              <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Inspeções rigorosas, controle de qualidade e tratamento de não conformidades
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="criterios" className="py-24 px-8 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Critérios de Avaliação</h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            Sistema IQF (Índice de Qualidade de Fornecedores) com avaliação mensal baseada em critérios rigorosos de
            desempenho
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div
            className={`group relative border-2 border-orange-400 rounded-3xl p-8 transition-all duration-800 hover:-translate-y-3 hover:shadow-2xl cursor-pointer overflow-hidden transform scale-105 ${
              isDarkMode ? "bg-slate-700 hover:shadow-cyan-400/30" : "bg-slate-50 hover:shadow-orange-400/40 shadow-xl"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-15 h-15 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Crítico
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6">Fornecedores</h3>
            <ul className="space-y-4 mb-8">
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>Pontuação mínima: 70 pontos</span>
              </li>
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>EPIs e equipamentos críticos</span>
              </li>
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>Serviços especializados</span>
              </li>
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>Due Diligence obrigatória</span>
              </li>
            </ul>
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/25">
              Saiba Mais <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          <div
            className={`group relative border rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400 cursor-pointer overflow-hidden ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 hover:shadow-cyan-400/20"
                : "bg-white border-slate-200 hover:shadow-orange-400/30 shadow-lg"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 transform scale-x-0 transition-transform duration-800 group-hover:scale-x-100"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-15 h-15 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"
                }`}
              >
                Mensal
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6">Avaliação de Desempenho</h3>
            <ul className="space-y-4 mb-8">
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>IQF de 0 a 100 pontos</span>
              </li>
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>Análise mensal de ocorrências</span>
              </li>
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>Reprovação abaixo de 70</span>
              </li>
              <li className={`flex items-center gap-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Shield className="w-5 h-5 text-orange-400" />
                <span>RAC para melhorias</span>
              </li>
            </ul>
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-xl font-semibold transition-all duration-800 hover:-translate-y-0.7 hover:shadow-lg hover:shadow-orange-400/25">
              Saiba Mais <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section id="avaliacao" className={`py-24 ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Métricas de Avaliação</h2>
              <p className={`text-xl mb-8 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Critérios objetivos para garantir a excelência na cadeia de suprimentos
              </p>
              <div className="space-y-6">
                <div
                  className={`flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isDarkMode ? "bg-slate-700 hover:shadow-orange-400/10" : "bg-white hover:shadow-orange-400/20 shadow-md"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Pontualidade</h4>
                    <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      -0,5 ponto por dia de atraso na entrega ou conclusão de serviços
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isDarkMode ? "bg-slate-700 hover:shadow-cyan-400/10" : "bg-white hover:shadow-orange-400/20 shadow-md"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Divergências</h4>
                    <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      -5 pontos por cada fornecimento com divergência identificada
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isDarkMode ? "bg-slate-700 hover:shadow-cyan-400/10" : "bg-white hover:shadow-orange-400/20 shadow-md"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Qualidade</h4>
                    <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      -1 ponto por reclamação relacionada ao produto ou serviço
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 p-1">
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-4xl font-bold text-orange-400">70</span>
                      <span className={`block text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        IQF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                  <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>≥ 70 - Aprovado</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {"< 70 - Reprovado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-24 text-center ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Torne-se um Fornecedor Engeman</h2>
          <p className={`text-xl mb-8 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            Junte-se à nossa rede de parceiros qualificados e faça parte do padrão de excelência Engeman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.7 hover:shadow-lg hover:shadow-red-500/25">
              <FileText className="w-5 h-5" />
              <Link href = "/cadastro" >
              Iniciar Cadastro
              </Link>
            </button>
            
          </div>
        </div>
      </section>

      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 w-15 h-15 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-400/25 transition-all duration-400 hover:scale-110 hover:shadow-xl hover:shadow-orange-400/40 z-50"
        title="Alternar tema"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  )
}
