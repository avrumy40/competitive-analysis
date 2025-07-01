import { useState } from "react";
import { motion } from "framer-motion";
import { ChartLine, Download, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddCompetitorDialog from "./add-competitor-dialog";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onExport: (format: 'json' | 'csv' | 'pdf', team?: 'sales' | 'product' | 'gtm') => void;
}

export default function Navigation({ activeSection, onSectionChange, onExport }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "battlecards", label: "Battle Cards" },
    { id: "positioning", label: "Positioning" },
    { id: "capabilities", label: "Capabilities" },
    { id: "resources", label: "Resources" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onSectionChange(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
              <ChartLine className="text-onebeat-teal w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Onebeat</h1>
              <p className="text-sm text-gray-600">Competitive Intelligence</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 ${
                  activeSection === item.id ? 'text-gray-900 font-semibold' : ''
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AddCompetitorDialog />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Export Database
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem onSelect={() => onExport('json')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Complete Database (JSON)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('csv')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Complete Database (CSV)
                  </DropdownMenuItem>
                  <div className="border-t border-gray-200 my-1"></div>
                  <DropdownMenuItem onSelect={() => onExport('csv', 'sales')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Sales Team Package (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('pdf', 'sales')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Sales Battle Cards (PDF)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('csv', 'product')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Product Team Package (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('pdf', 'product')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Product Analysis (PDF)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('csv', 'gtm')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    GTM Team Package (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onExport('pdf', 'gtm')} className="text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    GTM Market Analysis (PDF)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-gray-600 hover:text-gray-900 transition-colors py-2 ${
                    activeSection === item.id ? 'text-gray-900 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button 
                onClick={() => onExport('json')}
                className="bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Database (JSON)
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
