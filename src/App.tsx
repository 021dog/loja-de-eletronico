import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Zap, 
  Monitor, 
  ArrowRight,
  Plus,
  Minus,
  X,
  Search,
  User,
  Heart,
  ChevronDown,
  Star,
  Shield,
  CreditCard,
  Truck,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { products, type Product } from './products';
import { explainTechSpec } from './services/gemini';

type View = 'HOME' | 'DETAIL' | 'CHECKOUT' | 'ACCOUNT' | 'INNOVATION' | 'SUPPORT' | 'COLLECTIONS' | 'LAUNCH_CALENDAR' | 'LOCATOR' | 'X_SPACE' | 'NEURAL_LINK' | 'DISCORD' | 'PRIVACY' | 'TERMS';

export default function App() {
  const [view, setView] = useState<View>('HOME');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Countdown logic for promos
  const [timeLeft, setTimeLeft] = useState(3600 * 24 + 3600 * 5); // 29 hours approx
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const runAnalysis = async (product: Product) => {
    setIsAnalyzing(true);
    setAnalysisText(null);
    const text = await explainTechSpec(product.name, product.specs);
    setAnalysisText(text);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-nova-black text-nova-white font-sans selection:bg-nova-electric selection:text-white">
      {/* Dynamic Header */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-nova-black/60 backdrop-blur-xl px-6 md:px-12 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {setView('HOME'); setSelectedCategory(null);}}
          >
            <div className="w-10 h-10 bg-nova-electric rounded-xl flex items-center justify-center glow-electric transition-transform group-hover:scale-110 duration-500">
              <Zap size={22} className="text-white fill-current" />
            </div>
            <span className="font-display text-2xl font-black tracking-tighter italic">NOVATECH</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 font-sans text-xs tracking-[0.2em] uppercase font-medium">
            <button 
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className="hover:text-nova-electric transition-colors flex items-center gap-1"
            >
              LOJA <ChevronDown size={14} />
            </button>
            <button onClick={() => setView('COLLECTIONS')} className={`transition-colors ${view === 'COLLECTIONS' ? 'text-nova-electric' : 'hover:text-nova-electric'}`}>COLEÇÕES</button>
            <button onClick={() => setView('INNOVATION')} className={`transition-colors ${view === 'INNOVATION' ? 'text-nova-purple' : 'hover:text-nova-purple'}`}>INOVAÇÃO</button>
            <button onClick={() => setView('SUPPORT')} className={`transition-colors ${view === 'SUPPORT' ? 'text-nova-electric' : 'hover:text-nova-electric'}`}>SUPORTE</button>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full group focus-within:border-nova-electric transition-all">
              <Search size={16} className="text-white/40 group-focus-within:text-nova-electric" />
              <input 
                type="text" 
                placeholder="PROCURAR DISPOSITIVO..." 
                className="bg-transparent border-none outline-none text-[10px] tracking-widest w-40 placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); if(view !== 'HOME') setView('HOME');}}
              />
            </div>
            <button className="hover:text-nova-electric transition-colors"><Heart size={20} /></button>
            <button 
              className="relative p-2"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} className="hover:text-nova-electric transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-nova-electric text-white text-[9px] font-bold rounded-full flex items-center justify-center glow-electric">
                   {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('ACCOUNT')}
              className={`md:flex items-center gap-2 hidden px-4 py-2 border border-white/10 rounded-full transition-all ${view === 'ACCOUNT' ? 'bg-nova-electric border-nova-electric' : 'hover:bg-white/5'}`}
            >
               <User size={18} />
               <span className="text-[10px] tracking-widest font-bold uppercase">CONTA</span>
            </button>
          </div>
        </div>

        {/* Mega Menu Overlay */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseEnter={() => setIsMegaMenuOpen(false)}
                className="fixed inset-0 top-[80px] bg-black/40 backdrop-blur-sm z-[90]"
              />
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute left-0 top-[80px] w-full bg-nova-obsidian border-b border-white/10 p-12 z-[100]"
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-nova-electric font-mono text-xs tracking-[0.3em] font-bold">HARDWARE</h3>
                    <div className="space-y-4 text-sm font-light text-white/60">
                      {["Smartphones", "Notebooks", "Monitores"].map(i => (
                        <p key={i} className="hover:text-white cursor-pointer transition-colors" onClick={() => {setSelectedCategory(i); setIsMegaMenuOpen(false); setView('HOME');}}>{i.toUpperCase()}</p>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-nova-purple font-mono text-xs tracking-[0.3em] font-bold">ECOSSISTEMA</h3>
                    <div className="space-y-4 text-sm font-light text-white/60">
                      {["Audio", "Wearables", "Games"].map(i => (
                        <p key={i} className="hover:text-white cursor-pointer transition-colors" onClick={() => {setSelectedCategory(i); setIsMegaMenuOpen(false); setView('HOME');}}>{i.toUpperCase()}</p>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-nova-electric/10 group-hover:bg-nova-electric/20 transition-all rounded-2xl" />
                     <img 
                      src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2081&auto=format&fit=crop" 
                      className="w-full h-80 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                      alt="Featured"
                     />
                     <div className="absolute bottom-8 left-8">
                       <p className="font-mono text-[10px] tracking-widest text-nova-white mb-2">NOVO LANÇAMENTO</p>
                       <h4 className="text-4xl font-display font-black italic tracking-tighter uppercase">SMARTPHONE PRO MAX</h4>
                       <button 
                        onClick={() => {setSelectedProduct(products[0]); setView('DETAIL'); runAnalysis(products[0]);}}
                        className="mt-4 flex items-center gap-2 text-xs font-bold tracking-widest hover:text-nova-electric transition-colors"
                       >
                         EXPLORAR AGORA <ArrowRight size={14} />
                       </button>
                     </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-[100px]">
        <AnimatePresence mode="wait">
          {view === 'HOME' && (
            <HomeView 
              key="home"
              products={filteredProducts} 
              addToCart={addToCart} 
              setSelectedProduct={(p) => {setSelectedProduct(p); setView('DETAIL'); runAnalysis(p);}} 
              timeLeft={formatTime(timeLeft)}
              setSelectedCategory={setSelectedCategory}
            />
          )}
          {view === 'DETAIL' && selectedProduct && (
            <ProductDetailView 
              key="detail"
              product={selectedProduct} 
              addToCart={addToCart} 
              setView={setView} 
              analysisText={analysisText}
              isAnalyzing={isAnalyzing}
            />
          )}
          {view === 'INNOVATION' && <InnovationView key="innovation" setView={setView} />}
          {view === 'SUPPORT' && <SupportView key="support" setView={setView} />}
          {view === 'COLLECTIONS' && <CollectionsView key="collections" setSelectedCategory={setSelectedCategory} setView={setView} />}
          {view === 'ACCOUNT' && <AccountView key="account" setView={setView} />}
          {view === 'LAUNCH_CALENDAR' && <LaunchCalendarView key="launch" />}
          {view === 'LOCATOR' && <LocatorView key="locator" />}
          {view === 'X_SPACE' && <GenericView key="x" title="X SPACE" subtitle="COMUNICAÇÃO_ORBITAL" content="Nossa base de comunicações rápidas. Conecte-se com o feed global da NovaTech em tempo real." color="text-nova-electric" />}
          {view === 'NEURAL_LINK' && <NeuralLinkView key="neural" />}
          {view === 'DISCORD' && <GenericView key="discord" title="DISCORD COLLECTIVE" subtitle="NÚCLEO_SOCIAL" content="Junte-se à elite. O centro de discussão para desenvolvedores e entusiastas da série Nexus." color="text-nova-purple" />}
          {view === 'PRIVACY' && <GenericView key="privacy" title="PRIVACIDADE GUARD" subtitle="ENCRIPTAÇÃO_TOTAL" content="Seus dados são protegidos por arquitetura soberana. Ninguém acessa o que é seu por direito." color="text-nova-electric" />}
          {view === 'TERMS' && <GenericView key="terms" title="TERMOS CORE" subtitle="PROTOCOLO_LEGAL" content="Os fundamentos da nossa parceria tecnológica. Transparência bruta e compromisso com a evolução." color="text-white" />}
          {view === 'CHECKOUT' && <CheckoutView key="checkout" cart={cart} total={total} setView={setView} setCart={setCart} />}
        </AnimatePresence>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-nova-obsidian border-l border-white/10 z-[210] p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-display text-4xl font-black italic tracking-tighter">MEU CARRINHO</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-10 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-6 opacity-20">
                    <ShoppingBag size={80} strokeWidth={1} />
                    <p className="font-mono text-sm tracking-[0.4em]">CARRINHO VAZIO</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="flex gap-8 group">
                      <div className="w-32 h-32 bg-white/5 rounded-2xl overflow-hidden relative">
                        <img 
                          src={item.product.image} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-display text-xl font-bold italic tracking-tight">{item.product.name}</h3>
                           <button onClick={() => removeFromCart(item.product.id)} className="text-white/20 hover:text-red-500 transition-colors">
                             <X size={18} />
                           </button>
                        </div>
                        <p className="text-xs text-white/40 mb-6 font-mono">SPEC: {item.product.specs[0]}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 bg-white/5 p-1 px-3 rounded-full border border-white/10">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="hover:text-nova-electric"><Minus size={14} /></button>
                            <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="hover:text-nova-electric"><Plus size={14} /></button>
                          </div>
                          <span className="text-xl font-display font-medium italic tracking-tighter">${(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-10 border-t border-white/10 mt-10">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs tracking-widest text-white/40">
                    <span>FRETE ESTIMADO</span>
                    <span className="text-white">GRÁTIS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-display text-lg tracking-widest">TOTAL</span>
                    <span className="font-display text-3xl font-black italic tracking-tighter">${total.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {setView('CHECKOUT'); setIsCartOpen(false);}}
                  className="w-full py-5 bg-nova-white text-nova-black font-bold tracking-[0.2em] rounded-2xl hover:bg-nova-electric hover:text-white transition-all glow-electric disabled:opacity-50"
                  disabled={cart.length === 0}
                >
                  FINALIZAR PEDIDO
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-nova-obsidian border-t border-white/10 pt-24 pb-12 px-6 md:px-12 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-nova-electric to-transparent opacity-20" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
             <div className="col-span-1 lg:col-span-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    <Zap size={24} className="text-nova-electric fill-current" />
                  </div>
                  <span className="font-display text-3xl font-black tracking-tighter italic">NOVATECH</span>
                </div>
                <p className="text-xl text-white/40 leading-relaxed font-light mb-10 max-w-lg">
                  Empurrando as fronteiras do que é possível. Somos NovaTech, a interseção entre design brutalista e tecnologia invisível.
                </p>
                <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-nova-electric hover:text-nova-electric transition-all cursor-pointer">
                <Shield size={20} />
              </div>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-nova-electric hover:text-nova-electric transition-all cursor-pointer">
                 <Monitor size={20} />
              </div>
                </div>
             </div>

          <div className="max-w-xs">
            <h4 className="font-mono text-xs tracking-[0.4em] text-nova-electric font-bold mb-8 uppercase">Navegação</h4>
            <div className="space-y-4 text-white/40 text-sm font-light uppercase tracking-widest">
              {[
                { name: "Loja Hub", view: 'COLLECTIONS' },
                { name: "Calendário Lançamento", view: 'LAUNCH_CALENDAR' },
                { name: "Laboratório Inovação", view: 'INNOVATION' },
                { name: "Portal Suporte", view: 'SUPPORT' },
                { name: "Localizador Lojas", view: 'LOCATOR' }
              ].map(i => (
                <p key={i.name} onClick={() => setView(i.view as View)} className="hover:text-white cursor-pointer transition-colors">{i.name}</p>
              ))}
            </div>
          </div>

          <div className="max-w-xs">
            <h4 className="font-mono text-xs tracking-[0.4em] text-nova-purple font-bold mb-8 uppercase">Rede</h4>
            <div className="space-y-4 text-white/40 text-sm font-light uppercase tracking-widest">
              {[
                { name: "X Space", view: 'X_SPACE' },
                { name: "Neural Link", view: 'NEURAL_LINK' },
                { name: "Discord Collective", view: 'DISCORD' },
                { name: "Privacidade Guard", view: 'PRIVACY' },
                { name: "Termos Core", view: 'TERMS' }
              ].map(i => (
                <p key={i.name} onClick={() => setView(i.view as View)} className="hover:text-white cursor-pointer transition-colors">{i.name}</p>
              ))}
            </div>
          </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 space-y-6 md:space-y-0">
            <p className="text-[10px] tracking-[0.4em] text-white/20">SISTEMAS NOVATECH // TODOS OS DIREITOS RESERVADOS // 2029</p>
            <div className="flex items-center gap-12 text-[10px] tracking-[0.4em] text-white/20 font-bold">
               <span className="hover:text-white cursor-pointer transition-colors">SEGURANÇA ENCRIPTADA</span>
               <span className="hover:text-white cursor-pointer transition-colors">LOGÍSTICA GLOBAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomeView({ products, addToCart, setSelectedProduct, timeLeft }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Banner Impact */}
      <section className="relative h-[85vh] md:h-screen flex items-center px-6 md:px-12 overflow-hidden bg-nova-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] bg-nova-electric/5 blur-[180px] animate-pulse" />
           <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] bg-nova-purple/5 blur-[150px]" />
           {/* Futuristic lines background */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-nova-electric/10 border border-nova-electric/20 rounded-full mb-8">
                 <span className="w-2 h-2 bg-nova-electric rounded-full animate-ping" />
                 <span className="text-[10px] tracking-[0.3em] font-bold text-nova-electric">NOVA GERAÇÃO CHEGOU</span>
              </div>
              <h1 className="font-display text-7xl md:text-[10rem] font-black leading-[0.8] italic uppercase tracking-tighter mb-10 overflow-visible">
                NEXUS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-white via-nova-white to-nova-electric/20 translate-x-4 inline-block">SÉRIE 3.</span>
              </h1>
              <p className="text-xl md:text-2xl text-nova-white/40 leading-relaxed font-light mb-12 max-w-xl">
                 Arquitetura experimental para o usuário de elite. Unidades limitadas, performance sem limites.
              </p>
              <div className="flex flex-wrap gap-6">
                <button 
                  className="px-12 py-5 bg-white text-nova-black font-bold tracking-[0.3em] hover:bg-nova-electric hover:text-nova-white transition-all duration-500 flex items-center gap-3 glow-electric overflow-hidden relative group"
                >
                   <span className="relative z-10">PRÉ-VENDA AGORA</span>
                   <ArrowUpRight size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   <div className="absolute inset-0 bg-nova-electric translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
                <button className="px-12 py-5 border border-white/10 font-bold tracking-[0.3em] hover:border-nova-electric transition-all">
                  SAIBA MAIS
                </button>
              </div>
            </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
             <div className="relative group">
                <div className="absolute inset-0 bg-nova-electric/20 blur-[120px] rounded-full scale-150 animate-pulse" />
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="z-10 relative glass-card p-4 rounded-[4rem] border-white/20 shadow-2xl overflow-hidden"
                >
                   <img 
                    src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2081&auto=format&fit=crop" 
                    className="w-[450px] aspect-[4/5] object-cover rounded-[3.5rem] grayscale group-hover:grayscale-0 transition-all duration-[1.5s]" 
                    alt="Smartphone"
                   />
                   <div className="absolute top-10 right-10 flex flex-col gap-4">
                      <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center backdrop-blur-3xl text-white">
                        < Zap size={20} />
                      </div>
                   </div>
                </motion.div>
             </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-20">
           <span className="font-mono text-[9px] tracking-[0.5em]">DESCUBRA A ESCALA</span>
           <ChevronDown size={20} />
        </div>
      </section>

      {/* Countdown Urgent Section */}
      <section className="py-24 px-6 md:px-12 border-y border-white/5 bg-nova-obsidian overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-lg">
               <div className="inline-flex items-center gap-4 text-nova-purple mb-6 uppercase italic font-black text-2xl tracking-tighter">
                  <Clock className="animate-spin-slow" />
                  TEMPO LIMITADO
               </div>
               <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-6 leading-none">NOVA WEEK: <br/> ATÉ 40% OFF EM TODO ECOSSISTEMA.</h2>
               <p className="text-white/40 text-lg font-light tracking-wide">
                 As janelas de oferta são curtas. Otimize seu setup antes que a conexão caia.
               </p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
               <div className="text-[8rem] md:text-[12rem] font-display font-black tracking-tighter italic text-nova-electric leading-none slashed-zero">
                  {timeLeft}
               </div>
               <div className="font-mono text-[10px] tracking-[0.8em] text-white/20 uppercase">SYSTEM_SYNCHRONIZING</div>
            </div>
         </div>
      </section>

      {/* Main Grid */}
      <section className="py-32 px-6 md:px-12 bg-nova-black">
        <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="font-mono text-nova-electric text-[10px] tracking-[0.5em] mb-4 uppercase font-bold">Catálogo // 2029</div>
            <h2 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">EQUIPAMENTO <br/> DE ELITE</h2>
          
          <div className="flex gap-4">
            {["TODOS", "Smartphones", "Notebooks", "Monitores", "Audio", "Wearables", "Games"].map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat === "TODOS" ? null : cat)}
                className="px-6 py-2 border border-white/5 rounded-full text-[10px] tracking-[0.2em] font-bold hover:border-nova-electric hover:text-nova-electric transition-all"
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.map((p: Product, i: number) => (
            <ProductCard key={p.id} product={p} index={i} onClick={() => setSelectedProduct(p)} onAdd={() => addToCart(p)} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col items-center text-center gap-6 group">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:border-nova-electric transition-all duration-500">
               <Shield size={32} className="text-nova-electric" />
             </div>
             <h3 className="font-display text-xl font-bold uppercase italic">SEGURANÇA ELITE</h3>
             <p className="text-white/40 text-sm font-light">Todas as transações são encriptadas via NovaChain Quantum Security.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 group">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:border-nova-purple transition-all duration-500">
               <Truck size={32} className="text-nova-purple" />
             </div>
             <h3 className="font-display text-xl font-bold uppercase italic">ENTREGA GLOBAL</h3>
             <p className="text-white/40 text-sm font-light">Logística global operada por drones em tempo recorde para mais de 120 núcleos.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-6 group">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:border-nova-electric transition-all duration-500">
               <CreditCard size={32} className="text-nova-electric" />
             </div>
             <h3 className="font-display text-xl font-bold uppercase italic">PAGAMENTO DIGITAL</h3>
             <p className="text-white/40 text-sm font-light">Suporte total para CBDCs e as principais criptomoedas do mercado.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function ProductCard({ product, index, onClick, onAdd }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative"
    >
       <div className="aspect-[3/4] bg-nova-obsidian rounded-3xl overflow-hidden border border-white/5 relative mb-6">
          <div 
            className="absolute -top-1/2 -right-1/2 w-full h-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 rounded-full"
            style={{ backgroundColor: product.color }}
          />
          <img 
            src={product.image} 
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1s] group-hover:scale-110" 
            alt={product.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nova-black via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-6 left-6 font-mono text-[9px] tracking-widest text-white/40 uppercase">
             ID_{product.id}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none group-hover:pointer-events-auto">
             <button 
                onClick={onClick}
                className="w-12 h-12 glass-card rounded-full flex items-center justify-center hover:bg-nova-electric hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500"
             >
                <ArrowUpRight size={18} />
             </button>
             <button 
                onClick={onAdd}
                className="px-6 py-3 bg-nova-white text-nova-black rounded-full font-bold text-[10px] tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-700"
             >
                ADICIONAR
             </button>
          </div>
       </div>

       <div onClick={onClick} className="cursor-pointer">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display text-xl font-bold tracking-tight italic uppercase">{product.name}</h3>
            <span className="text-nova-electric font-bold italic tracking-tighter">${product.price}</span>
          </div>
          <p className="text-[10px] tracking-widest text-white/30 uppercase font-bold">{product.category}</p>
       </div>
    </motion.div>
  );
}

function ProductDetailView({ product, addToCart, setView, analysisText, isAnalyzing }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24"
    >
      <button 
        onClick={() => setView('HOME')}
        className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] text-white/20 hover:text-nova-electric transition-colors mb-12 uppercase"
      >
        <ArrowRight size={14} className="rotate-180" /> VOLTAR AO HUB
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-8">
           <div className="aspect-square bg-nova-obsidian rounded-[4rem] border border-white/10 overflow-hidden group shadow-3xl">
              <img 
                src={product.image} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-[1s]" 
                alt={product.name}
              />
           </div>
           <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-nova-obsidian rounded-2xl border border-white/5 opacity-40 hover:opacity-100 transition-all cursor-pointer" />
              ))}
           </div>
        </div>

        <div className="flex flex-col h-full py-6">
           <div className="inline-flex items-center gap-4 text-nova-electric font-mono text-xs tracking-[0.4em] mb-6 font-bold uppercase">
              <Zap size={16} /> NOVA_TEC // {product.id}
           </div>
           <h1 className="font-display text-7xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-[0.8]">
             {product.name}
           </h1>
           <div className="flex items-center gap-6 mb-12">
              <span className="text-4xl font-display font-medium tracking-tighter italic">${product.price}</span>
              <div className="flex items-center gap-1 text-nova-purple">
                 {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                 <span className="text-[10px] font-bold ml-2 text-white/40">(128 AVALIAÇÕES)</span>
              </div>
           </div>

           <p className="text-xl text-white/60 leading-relaxed font-light mb-12 border-l-2 border-nova-electric pl-8 py-4 bg-white/[0.02]">
             {product.description}
           </p>

           <div className="space-y-6 mb-16">
              <h4 className="font-mono text-xs tracking-[0.4em] text-nova-white/40 uppercase">ESPECIFICAÇÕES TÉCNICAS</h4>
              <div className="grid grid-cols-2 gap-4">
                {product.specs.map((s: string) => (
                  <div key={s} className="flex items-center gap-3 text-sm font-light text-white/80 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
                     <Plus size={14} className="text-nova-electric" />
                     {s}
                  </div>
                ))}
              </div>
           </div>

           <div className="mt-auto space-y-6">
             <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 py-6 bg-nova-white text-nova-black font-black tracking-[0.3em] rounded-3xl hover:bg-nova-electric hover:text-nova-white transition-all duration-500 glow-electric uppercase italic flex items-center justify-center gap-4 group"
                >
                  ADICIONAR AO CARRINHO
                  <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                </button>
                <div className="w-20 h-20 rounded-3xl border border-white/10 flex items-center justify-center hover:border-nova-purple text-white/40 hover:text-nova-purple transition-all cursor-pointer">
                   <Heart size={24} />
                </div>
             </div>
             
             {/* Neural Analysis Section powered by Gemini */}
             <div className="glass-card rounded-[2.5rem] p-8 border-nova-electric/20 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-nova-electric/10 blur-[80px] rounded-full group-hover:bg-nova-electric/20 transition-all" />
                <div className="flex items-center gap-2 text-nova-electric font-mono text-[10px] tracking-[0.5em] mb-4 font-bold uppercase">
                   <Monitor size={14} /> ANÁLISE NEURAL_AI
                </div>
                {isAnalyzing ? (
                  <div className="space-y-3">
                     <div className="h-4 bg-white/5 animate-pulse w-full rounded" />
                     <div className="h-4 bg-white/5 animate-pulse w-3/4 rounded" />
                  </div>
                ) : (
                  <p className="text-sm italic font-light leading-relaxed text-white/60">
                    {analysisText || "Link neural estável. Aguardando fluxo de dados."}
                  </p>
                )}
             </div>
           </div>
        </div>
      </div>

      {/* Cross-sell */}
      <section className="mt-32 pt-24 border-t border-white/10">
         <h3 className="font-display text-4xl font-black italic tracking-tighter mb-16 uppercase">COMPLEMENTE SEU SETUP</h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {products.slice(0, 4).map((p: Product, i: number) => (
              <ProductCard key={p.id} product={p} index={i} onClick={() => {}} onAdd={() => addToCart(p)} />
            ))}
         </div>
      </section>
    </motion.div>
  );
}

function InnovationView({ setView }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-24"
    >
      <div className="text-center mb-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-nova-purple/10 border border-nova-purple/20 rounded-full mb-8">
           <span className="w-2 h-2 bg-nova-purple rounded-full animate-pulse" />
           <span className="text-[10px] tracking-[0.3em] font-bold text-nova-purple uppercase">Laboratório de Futuros</span>
        </div>
        <h1 className="text-6xl md:text-9xl font-display font-black italic tracking-tighter uppercase mb-8">LABORATÓRIO DE<br/><span className="text-nova-purple">INOVAÇÃO.</span></h1>
        <p className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
          Onde a ciência dos materiais encontra a inteligência neural. Explore nossos projetos experimentais em desenvolvimento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          { title: "Neuro-Link S1", desc: "Interface direta cérebro-dispositivo para latência zero.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" },
          { title: "Quantum Battery", desc: "Energia sólida com recarregamento via infravermelho de longo alcance.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" },
          { title: "Optic Mesh", desc: "Telas transparentes com densidade de 16K para visão aumentada.", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop" },
          { title: "Titan Core", desc: "Estruturas de chassi biocinético que se adaptam à mão do usuário.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" }
        ].map((item, i) => (
          <div key={i} className="group relative aspect-video bg-nova-obsidian rounded-[3rem] overflow-hidden border border-white/5">
             <img src={item.img} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000" />
             <div className="absolute inset-0 bg-gradient-to-t from-nova-black via-transparent to-transparent" />
             <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-display font-black italic tracking-tighter mb-4">{item.title}</h3>
                <p className="text-white/40 text-sm max-w-xs">{item.desc}</p>
                <button className="mt-8 px-6 py-2 border border-nova-purple text-nova-purple text-[10px] font-bold tracking-widest rounded-full hover:bg-nova-purple hover:text-white transition-all">CIÊNCIA DO PROJETO</button>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SupportView({ setView }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-24"
    >
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="lg:w-1/3">
           <h1 className="text-6xl font-display font-black italic tracking-tighter uppercase mb-12">CENTRAL DE<br/> SUPORTE.</h1>
           <div className="space-y-8">
              {[
                { label: "STATUS DO SISTEMA", value: "OPERACIONAL" },
                { label: "REDE GLOBAL", value: "STABLE" },
                { label: "TEMPO DE RESPOSTA", value: "< 2 MIN" }
              ].map(i => (
                <div key={i.label} className="flex justify-between border-b border-white/5 pb-4">
                   <span className="text-white/20 text-[10px] font-mono tracking-widest">{i.label}</span>
                   <span className="text-nova-electric text-[10px] font-mono font-bold">{i.value}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { title: "Chat AI", desc: "Fale com nossa IA proprietária para diagnóstico imediato.", icon: <Zap size={24} /> },
             { title: "Manuais", desc: "Diagramas técnicos e esquemas de hardware para reparo.", icon: <Monitor size={24} /> },
             { title: "Garantia", desc: "Verifique o status da sua cobertura NovaShield.", icon: <Shield size={24} /> },
             { title: "Atualizações", desc: "Download de firmwares e drivers críticos.", icon: <ArrowUpRight size={24} /> }
           ].map(item => (
             <div key={item.title} className="p-10 bg-nova-obsidian border border-white/5 rounded-[2.5rem] hover:border-nova-electric transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-nova-electric group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-display font-bold italic tracking-tight mb-4 uppercase">{item.title}</h3>
                <p className="text-white/40 text-sm font-light">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}

function CollectionsView({ setSelectedCategory, setView }: any) {
  const cats = [
    { name: "Smartphones", img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179" },
    { name: "Notebooks", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
    { name: "Audio", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b" },
    { name: "Wearables", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a" },
    { name: "Monitores", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" },
    { name: "Games", img: "https://images.unsplash.com/photo-1486401899868-0e435ed85128" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-24"
    >
      <h1 className="text-6xl font-display font-black italic tracking-tighter uppercase mb-24">EXPLORAR<br/> COLEÇÕES.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map((cat, i) => (
          <div 
            key={cat.name} 
            className="group relative aspect-[4/5] bg-nova-obsidian rounded-[3rem] overflow-hidden cursor-pointer border border-white/5"
            onClick={() => {setSelectedCategory(cat.name); setView('HOME');}}
          >
            <img src={`${cat.img}?q=80&w=1000&auto=format&fit=crop`} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-nova-black via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10">
               <h3 className="text-3xl font-display font-black italic tracking-tighter uppercase mb-4">{cat.name}</h3>
               <div className="flex items-center gap-2 text-[10px] tracking-widest font-bold text-nova-electric opacity-0 group-hover:opacity-100 transition-opacity">
                  VER DISPOSITIVOS <ArrowRight size={12} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AccountView({ setView }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-24"
    >
      <div className="flex flex-col lg:flex-row gap-24 items-start">
         <div className="lg:w-1/4 sticky top-32">
            <div className="w-32 h-32 bg-nova-electric rounded-[2rem] flex items-center justify-center text-nova-black mb-8 glow-electric">
               <User size={64} strokeWidth={1} />
            </div>
            <h1 className="text-4xl font-display font-black italic tracking-tighter mb-2">AGENTE NOVA</h1>
            <p className="text-nova-electric font-mono text-[10px] tracking-[0.4em] mb-12">ID 098-X45-N77</p>
            
            <div className="space-y-4">
               {["Pedidos", "Configurações", "Segurança", "NovaPoints (450)"].map(i => (
                 <div key={i} className="px-6 py-4 border border-white/5 rounded-2xl hover:border-nova-electric cursor-pointer transition-all text-sm font-light text-white/40 hover:text-white uppercase tracking-widest">{i}</div>
               ))}
            </div>
         </div>

         <div className="lg:w-3/4 space-y-16">
            <section>
              <h3 className="font-mono text-xs tracking-[0.4em] text-white/20 uppercase mb-8">PEDIDOS_RECENTES</h3>
              <div className="space-y-6">
                {[
                  { id: "#NT-9081", item: "Smartphone Pro Max", status: "Em Transporte", total: "1,199" },
                  { id: "#NT-8542", item: "Sonic Sphere X", status: "Entregue", total: "349" }
                ].map((order, i) => (
                  <div key={i} className="p-8 bg-nova-obsidian border border-white/5 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center"><ShoppingBag size={24} className="text-nova-electric" /></div>
                       <div>
                          <p className="text-[10px] font-mono text-white/20 mb-1">{order.id}</p>
                          <h4 className="text-xl font-display font-bold italic">{order.item}</h4>
                       </div>
                    </div>
                    <div className="flex items-center gap-12">
                       <div className="text-center">
                          <p className="text-[10px] font-mono text-white/20 mb-1 uppercase">Status</p>
                          <p className="text-xs font-bold text-nova-purple">{order.status}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-mono text-white/20 mb-1 uppercase">Total</p>
                          <p className="text-xl font-display font-black italic">${order.total}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-12 border border-white/5 rounded-[3rem] bg-gradient-to-br from-nova-electric/10 to-transparent">
               <h3 className="text-3xl font-display font-black italic tracking-tighter mb-6">NOVA SHIELD ATIVA</h3>
               <p className="text-white/40 text-lg font-light mb-8 max-w-lg">Sua conta está protegida por encriptação biométrica de camada dupla. Zero violações reportadas nos últimos 200 dias.</p>
               <button className="px-10 py-4 bg-nova-white text-nova-black font-bold tracking-widest rounded-2xl hover:bg-nova-electric hover:text-white transition-all text-xs">GERENCIAR SEGURANÇA</button>
            </section>
         </div>
      </div>
    </motion.div>
  );
}

function LaunchCalendarView() {
  const launches = [
    { date: "12 JUN", item: "NEXUS SÉRIE 4 - PREVIEW", type: "LIVE STREAM" },
    { date: "24 JUL", item: "PHANTOM ULTRA - GOLD EDITION", type: "DROPS" },
    { date: "15 AGO", item: "NOVA AUDIO SPHERE V2", type: "HARDWARE" },
    { date: "03 SET", item: "CORTEX NOTEBOOK - M5 CHIP", type: "KEYNOTE" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24">
      <div className="font-mono text-nova-electric text-[10px] tracking-[0.5em] mb-4 font-bold uppercase">Ciclo_2029</div>
      <h1 className="text-6xl font-display font-black italic tracking-tighter uppercase mb-16">PRÓXIMOS<br/> LANÇAMENTOS.</h1>
      <div className="space-y-4">
        {launches.map((l, i) => (
          <div key={i} className="group p-8 bg-nova-obsidian border border-white/5 rounded-3xl flex justify-between items-center hover:border-nova-electric transition-all cursor-crosshair">
            <div className="flex gap-12 items-center">
               <div className="text-2xl font-display font-black italic text-nova-electric w-20 leading-none">{l.date}</div>
               <div>
                  <h3 className="text-xl font-display font-bold italic uppercase tracking-tight">{l.item}</h3>
                  <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase mt-1">{l.type}</p>
               </div>
            </div>
            <ArrowUpRight className="text-white/10 group-hover:text-nova-electric group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LocatorView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-display font-black italic tracking-tighter uppercase mb-12">LOCALIZADOR<br/> DE NÚCLEOS.</h1>
      <div className="aspect-[21/9] bg-nova-obsidian rounded-[4rem] border border-white/5 relative overflow-hidden mb-12">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop')] bg-cover grayscale opacity-20" />
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
               <div className="w-4 h-4 bg-nova-electric rounded-full animate-ping absolute -inset-1" />
               <div className="w-2 h-2 bg-nova-electric rounded-full relative" />
               <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-nova-electric text-nova-black px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest">VOCÊ ESTÁ NO NÚCLEO_ALPHA</div>
            </div>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
         {["SÃO PAULO CORE", "TOKYO HUB", "NEOM SECTOR"].map(city => (
           <div key={city} className="p-8 border border-white/5 rounded-3xl bg-nova-obsidian">
              <h3 className="font-display font-bold text-xl mb-2">{city}</h3>
              <p className="text-white/20 text-xs font-mono tracking-widest">NÍVEL DE ESTOQUE: ALTO</p>
           </div>
         ))}
      </div>
    </motion.div>
  );
}

function NeuralLinkView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24">
      <div className="p-12 bg-nova-obsidian border border-nova-purple/30 rounded-[4rem] shadow-[0_0_50px_-12px_rgba(191,90,242,0.3)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <Zap className="text-nova-purple animate-pulse" />
        </div>
        <h1 className="text-5xl font-display font-black italic tracking-tighter uppercase mb-8">NEURAL LINK<br/> STATUS.</h1>
        <div className="space-y-8">
           <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5">
              <span className="text-xs font-mono tracking-widest text-white/40">SINCRONIA_ESTÁVEL</span>
              <span className="text-nova-purple font-bold">98.4%</span>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-mono tracking-widest text-white/20 uppercase">Latência Cerebral</p>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: "12%" }} className="h-full bg-nova-purple" />
              </div>
           </div>
           <p className="text-sm text-white/40 leading-relaxed font-light italic">"A transição de pensamento para ação agora é sub-milissegundo. O futuro não é o que você toca, é o que você projeta."</p>
        </div>
      </div>
    </motion.div>
  );
}

function GenericView({ title, subtitle, content, color }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 text-center">
      <p className={`font-mono text-[10px] tracking-[0.5em] mb-4 font-bold uppercase ${color}`}>{subtitle}</p>
      <h1 className="text-7xl font-display font-black italic tracking-tighter uppercase mb-12">{title}</h1>
      <p className="text-2xl text-white/40 font-light leading-relaxed mb-16">{content}</p>
      <div className="flex justify-center">
         <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center opacity-20">
            <Monitor size={32} />
         </div>
      </div>
    </motion.div>
  );
}

function CheckoutView({ cart, total, setView, setCart }: any) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2500);
  };

  if (step === 3) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-xl mx-auto py-24 px-6 text-center"
      >
         <div className="w-24 h-24 bg-nova-electric/20 rounded-full flex items-center justify-center mx-auto mb-10 text-nova-electric glow-electric">
            <Shield size={48} strokeWidth={1} />
         </div>
         <h1 className="text-4xl font-display font-black italic tracking-tighter uppercase mb-6 text-nova-electric">TRANSAÇÃO VALIDADA.</h1>
         <p className="text-white/40 text-lg font-light mb-12">Seu pedido foi processado pela NovaChain. Você receberá uma notificação neural em instantes.</p>
         <button 
          onClick={() => {setCart([]); setView('HOME');}}
          className="px-10 py-4 bg-nova-white text-nova-black font-bold tracking-widest rounded-2xl hover:bg-nova-electric hover:text-white transition-all text-xs"
         >
           VOLTAR AO HUB
         </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="lg:w-2/3">
           <div className="flex items-center gap-8 mb-16">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black italic transition-all ${step >= i ? 'bg-nova-electric text-nova-black' : 'bg-white/5 text-white/20'}`}>{i}</div>
                   <span className={`text-[10px] font-mono tracking-widest uppercase ${step >= i ? 'text-white' : 'text-white/20'}`}>{i === 1 ? 'LOGÍSTICA' : 'PAGAMENTO'}</span>
                </div>
              ))}
           </div>

           {step === 1 ? (
             <div className="space-y-12">
                <h2 className="text-5xl font-display font-black italic tracking-tighter uppercase">DETALHES DE ENVIO</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {["NOME COMPLETO", "ENDEREÇO NEURAL", "CIDADE CORE", "CÓDIGO POSTAL"].map(label => (
                    <div key={label} className="space-y-2">
                       <label className="text-[9px] font-mono tracking-widest text-white/20 uppercase">{label}</label>
                       <input type="text" className="w-full bg-nova-obsidian border border-white/10 rounded-2xl p-5 text-sm focus:border-nova-electric outline-none transition-all" />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="px-12 py-5 bg-white text-nova-black font-black tracking-[0.3em] rounded-2xl hover:bg-nova-electric hover:text-white transition-all text-sm uppercase italic"
                >
                  PROSSEGUIR PARA PAGAMENTO
                </button>
             </div>
           ) : (
             <div className="space-y-12">
                <h2 className="text-5xl font-display font-black italic tracking-tighter uppercase">PAGAMENTO SEGURO</h2>
                <div className="p-10 border border-nova-electric/30 rounded-[3rem] bg-gradient-to-br from-nova-electric/5 to-transparent">
                   <div className="flex justify-between items-start mb-12">
                      <CreditCard size={40} className="text-nova-electric" />
                      <div className="text-right">
                         <p className="text-[10px] font-mono text-white/20 uppercase">NovaID Status</p>
                         <p className="text-xs text-nova-electric font-bold">VERIFICADO_BIOMETRIC</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-mono tracking-widest text-white/20 uppercase">NÚMERO DO CARTÃO CRIPTOGRAFADO</label>
                         <input type="text" placeholder="**** **** **** 0087" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-xl tracking-[0.2em] font-display focus:border-nova-electric outline-none transition-all placeholder:text-white/10" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono tracking-widest text-white/20 uppercase">DATA EXP</label>
                           <input type="text" placeholder="MM/YY" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-nova-electric outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-mono tracking-widest text-white/20 uppercase">CCV PRO</label>
                           <input type="text" placeholder="***" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-nova-electric outline-none transition-all" />
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)} 
                    className="px-10 py-5 border border-white/10 text-white/20 hover:text-white transition-all font-bold tracking-widest uppercase text-[10px]"
                  >
                    VOLTAR
                  </button>
                  <button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 py-5 bg-nova-white text-nova-black font-black tracking-[0.3em] rounded-2xl hover:bg-nova-electric hover:text-white transition-all text-sm uppercase italic flex items-center justify-center gap-4 glow-electric"
                  >
                    {isProcessing ? 'PROCESSANDO_QUANTUM...' : 'VALIDAR TRANSAÇÃO'}
                    {!isProcessing && <Shield size={18} />}
                  </button>
                </div>
             </div>
           )}
        </div>

        <div className="lg:w-1/3">
           <div className="p-10 bg-nova-obsidian border border-white/5 rounded-[3rem] sticky top-32">
              <h3 className="text-2xl font-display font-black italic tracking-tighter uppercase mb-10">RESUMO</h3>
              <div className="space-y-6 mb-10">
                 {cart.map((item: any) => (
                   <div key={item.product.id} className="flex justify-between items-center text-sm">
                      <span className="text-white/40 font-light truncate max-w-[120px]">{item.product.name} (x{item.quantity})</span>
                      <span className="font-mono text-xs">${(item.product.price * item.quantity).toLocaleString()}</span>
                   </div>
                 ))}
              </div>
              <div className="border-t border-white/5 pt-8 space-y-4">
                 <div className="flex justify-between text-xs tracking-widest text-white/20 uppercase">
                    <span>FRETE LOGÍSTICO</span>
                    <span className="text-nova-electric">OFFER_FREE</span>
                 </div>
                 <div className="flex justify-between text-xs tracking-widest text-white/20 uppercase">
                    <span>IMPTO_QUANTUM</span>
                    <span>$0.00</span>
                 </div>
                 <div className="flex justify-between items-center pt-4">
                    <span className="font-display text-xl tracking-widest uppercase">TOTAL</span>
                    <span className="text-3xl font-display font-black italic tracking-tighter text-nova-electric">${total.toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

