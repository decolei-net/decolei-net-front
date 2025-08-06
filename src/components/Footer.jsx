import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ShieldQuestion,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Heart,
} from 'lucide-react';
import logoDecolei from '../assets/decolei.png';

const Footer = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-gray-300  relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1: Logo e Informações da Empresa */}
          <div className="lg:col-span-1">
            <img src={logoDecolei} alt="Logo Decolei.net" className="h-12 w-auto mb-6" />
            <p className="text-gray-400 mb-6 leading-relaxed">
              Sua jornada começa aqui. Conectamos você aos destinos mais incríveis do Brasil e do
              mundo.
            </p>

            {/* Redes Sociais */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/destinos"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Destinos
                </Link>
              </li>
              <li>
                <Link
                  to="/promocoes"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  Promoções
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <a
                    href="mailto:decoleinet@gmail.com"
                    className="text-white hover:text-blue-400 transition-colors duration-300"
                  >
                    decoleinet@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Telefone</p>
                  <a
                    href="tel:+5511999999999"
                    className="text-white hover:text-blue-400 transition-colors duration-300"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldQuestion size={18} className="mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Suporte</p>
                  <Link
                    to="/suporte"
                    className="text-white hover:text-blue-400 transition-colors duration-300"
                  >
                    Central de Ajuda
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Desenvolvedores */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Desenvolvido por</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium">Leonardo Amyntas</p>
                <p className="text-gray-400 text-xs">Fullstack Developer</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium">Eduardo da Silva</p>
                <p className="text-gray-400 text-xs">Fullstack Developer</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium">Arthur Henrique</p>
                <p className="text-gray-400 text-xs">Fullstack Developer</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium">Kamylla Reis</p>
                <p className="text-gray-400 text-xs">Fullstack Developer</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white font-medium">Leônidas Dantas</p>
                <p className="text-gray-400 text-xs">Fullstack Developer</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              Grupo 1 - Trilha Prof. Célio de Souza
              <br />
              Decola 6 - Turma 2025
            </p>
          </div>
        </div>

        {/* Linha divisória e Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-2">
              © {anoAtual} Decolei.net. Todos os direitos reservados.
              <Heart size={14} className="text-red-500" />
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacidade"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Privacidade
              </Link>
              <Link
                to="/termos"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Termos de Uso
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
