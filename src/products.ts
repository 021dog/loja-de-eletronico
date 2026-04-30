export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  specs: string[];
  image: string;
  color: string;
}

export const products: Product[] = [
  {
    id: "nt-01",
    name: "SMARTPHONE PRO MAX",
    category: "Smartphones",
    price: 1199,
    description: "A nova fronteira da mobilidade. Construção em titânio e sistema de câmera quântica.",
    specs: ["Chip A18 Bionic Max", "Câmera de 48MP", "Tela Super Retina"],
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2081&auto=format&fit=crop",
    color: "#007AFF"
  },
  {
    id: "nt-02",
    name: "NOTEBOOK ULTRA SLIM",
    category: "Notebooks",
    price: 2499,
    description: "Elegância arquitetural encontra o poder computacional bruto.",
    specs: ["Processador M4 Pro", "32GB RAM Unificada", "Tela 120Hz XDR"],
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    color: "#FFFFFF"
  },
  {
    id: "nt-03",
    name: "FONE DE OUVIDO SEM FIO",
    category: "Audio",
    price: 349,
    description: "Imersão acústica espacial de 360 graus com cancelamento de ruído ativo.",
    specs: ["Cancelamento de Ruído", "Bateria de 40h", "Áudio Hi-Fi"],
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
    color: "#BF5AF2"
  },
  {
    id: "nt-04",
    name: "SMARTWATCH SERIES X",
    category: "Wearables",
    price: 599,
    description: "Telemetria de saúde vinda do futuro diretamente no seu pulso.",
    specs: ["ECG 2.0", "SOS via Satélite", "Pulseira Esportiva"],
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop",
    color: "#007AFF"
  },
  {
    id: "nt-05",
    name: "MONITOR GAMER 4K",
    category: "Monitores",
    price: 899,
    description: "Taxa de atualização ultra-rápida e cores cinematográficas para performance absoluta.",
    specs: ["Painel OLED 240Hz", "0.03ms Resposta", "HDR 1000"],
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop",
    color: "#BF5AF2"
  },
  {
    id: "nt-06",
    name: "CONSOLE DE ÚLTIMA GERAÇÃO",
    category: "Games",
    price: 499,
    description: "O ápice do entretenimento digital doméstico com Ray Tracing em tempo real.",
    specs: ["SSD Ultra Veloz", "Suporte 8K", "Controle Háptico"],
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=2070&auto=format&fit=crop",
    color: "#007AFF"
  }
];
