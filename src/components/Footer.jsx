import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldQuestion } from 'lucide-react';

import logoDecolei from '../assets/decolei.png';

const Footer = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 font-sans">
      <div className="container mx-auto px-6 py-12">
        
        {/* Grid principal ajustado para 3 colunas para dar mais espaço */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Coluna 1: Logo e Slogan */}
          <div className="mb-6 md:mb-0">
            <img src={logoDecolei} alt="Logo Decolei.net" className="h-10 w-auto mb-4" />
            <p className="text-gray-400">Sua jornada começa aqui.</p>
          </div>

          {/* Coluna 2 e 3: Créditos aos Desenvolvedores */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Desenvolvido por</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-400">
              <p>Leonardo Amyntas Machado de Freitas Filho</p>
              <p>Eduardo da Silva Bezerra</p>
              <p>Arthur Henrique Martins Santos</p>
              <p>Kamylla Reis de Araújo Silva</p>
              <p>Leônidas Dantas de Castro Netto</p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Grupo 1 - Trilha Prof. Célio de Souza | Decola 6 - Turma 2025
            </p>
          </div>

          {/* Coluna 4* */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contato & Suporte</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:decoleinet@gmail.com" className="hover:text-blue-400">decoleinet@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <ShieldQuestion size={16} className="mt-1 flex-shrink-0" />
                <Link to="/suporte" className="hover:text-blue-400">Página de Suporte</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória e Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {anoAtual} Decolei.net. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;