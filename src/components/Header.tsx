import React, { useState } from "react";
import { Stethoscope, Shield, Lock, Menu, X, ArrowLeft } from "lucide-react";

interface HeaderProps {
  isAdminMode: boolean;
  onToggleAdminMode: (active: boolean) => void;
  onScrollTo: (elementId: string) => void;
  adminEmail: string;
  currentRoute: string;
}

export default function Header({
  isAdminMode,
  onToggleAdminMode,
  onScrollTo,
  adminEmail,
  currentRoute,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "2026" || pin === "admin") {
      onToggleAdminMode(true);
      setShowLoginModal(false);
      setPin("");
      setErrorMsg("");
      setIsOpen(false);
      window.location.hash = "#/admin";
    } else {
      setErrorMsg("Credencial clínica incorrecta. Intente de nuevo.");
    }
  };

  const navItems = [
    { label: "El Programa", id: "features", type: "scroll" },
    { label: "Packs y Planes", id: "planes", type: "route", hash: "#/planes" },
    { label: "Reservar Turno", id: "booking", type: "route", hash: "#/reservar" },
    { label: "Preguntas Frecuentes", id: "faq", type: "route", hash: "#/preguntas" },
  ];

  const isNavItemActive = (item: typeof navItems[number]) => {
    if (item.type === "scroll") {
      return currentRoute === "inicio";
    }
    if (item.id === "planes") {
      return currentRoute === "planes";
    }
    if (item.id === "booking") {
      return currentRoute === "reservar";
    }
    if (item.id === "faq") {
      return currentRoute === "preguntas";
    }
    return false;
  };

  const handleNavClick = (item: typeof navItems[number]) => {
    if (item.type === "scroll") {
      onScrollTo(item.id);
    } else if (item.hash) {
      window.location.hash = item.hash;
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-morphism border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none" 
            onClick={() => {
              onToggleAdminMode(false);
              window.location.hash = "#/inicio";
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 hover:scale-105 transition-transform">
              <Stethoscope className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-lg text-slate-900 tracking-tight">Piñeiro</span>
                <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Metabolic</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono tracking-wide">CLÍNICA &amp; TRANSFORMACIÓN</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isAdminMode ? (
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => {
                const active = isNavItemActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`text-sm font-semibold transition-all cursor-pointer relative py-2 ${
                      active
                        ? "text-teal-700 font-bold"
                        : "text-gray-600 hover:text-teal-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-3 text-sm bg-teal-50 px-4 py-1.5 rounded-lg border border-teal-100">
              <Shield className="w-4 h-4 text-teal-600 animate-pulse" />
              <span className="text-teal-900 font-medium">Panel de Andrea &amp; Socio</span>
              <span className="text-slate-400">|</span>
              <span className="text-teal-700 font-mono text-xs">{adminEmail}</span>
            </div>
          )}

          {/* Action Gateway Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdminMode ? (
              <button
                onClick={() => {
                  onToggleAdminMode(false);
                  window.location.hash = "#/inicio";
                }}
                className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Sitio</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-teal-600 border border-gray-200 hover:border-teal-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer bg-white"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acceso Clínica</span>
              </button>
            )}
            <button
              onClick={() => {
                if (isAdminMode) {
                  onToggleAdminMode(false);
                  window.location.hash = "#/inicio";
                } else {
                  window.location.hash = "#/reservar";
                }
              }}
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/10 cursor-pointer"
            >
              {isAdminMode ? "Ver Resultados" : "Solicitar Turno"}
            </button>
          </div>

          {/* Mobile hamburger icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-teal-600 focus:outline-none p-1.5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-morphism border-b border-gray-200 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          {!isAdminMode ? (
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const active = isNavItemActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                      active
                        ? "bg-teal-50 text-teal-800 font-bold"
                        : "text-gray-700 hover:text-teal-600 hover:bg-gray-50/50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-teal-50 p-3 rounded-lg border border-teal-100 mb-2">
              <div className="flex items-center space-x-2 text-sm text-teal-900 font-medium">
                <Shield className="w-4 h-4 text-teal-600 animate-pulse" />
                <span>Panel de Andrea &amp; Socio</span>
              </div>
              <p className="text-[11px] text-teal-700 font-mono mt-1">{adminEmail}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200/50 flex flex-col space-y-3">
            {isAdminMode ? (
              <button
                onClick={() => {
                  onToggleAdminMode(false);
                  window.location.hash = "#/inicio";
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Sitio</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:border-teal-200 bg-white cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Acceso Clínica</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                if (isAdminMode) {
                  onToggleAdminMode(false);
                  window.location.hash = "#/inicio";
                } else {
                  window.location.hash = "#/reservar";
                }
              }}
              className="bg-teal-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 cursor-pointer shadow-md transition-all"
            >
              {isAdminMode ? "Ver Landing" : "Solicitar Turno Ahora"}
            </button>
          </div>
        </div>
      )}

      {/* Secret PIN clinical login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => {
                setShowLoginModal(false);
                setPin("");
                setErrorMsg("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-teal-50 ml-auto mr-auto rounded-full flex items-center justify-center text-teal-600 mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Acceso Clínico Autorizado</h3>
              <p className="text-xs text-gray-500 mt-1">
                Para Andrea Piñeiro, socios y administradores del programa.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-1">
                  Código PIN de Acceso
                </label>
                <input
                  type="password"
                  placeholder="Ingrese el PIN (ej: 2026)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg text-center">
                  {errorMsg}
                </p>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPin("");
                    setErrorMsg("");
                  }}
                  className="w-1/2 text-sm text-gray-600 bg-gray-50 border border-gray-200 py-2.5 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-sm text-white bg-teal-600 hover:bg-teal-700 py-2.5 rounded-xl font-semibold shadow-md shadow-teal-600/10"
                >
                  Ingresar
                </button>
              </div>
            </form>
            <p className="text-[10px] text-center text-gray-400 mt-4 font-mono">
              Demo PIN: <strong className="text-teal-600">2026</strong> o <strong className="text-teal-600">admin</strong>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
