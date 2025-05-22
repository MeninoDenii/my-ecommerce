import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

type Address = {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

type Product = {
  title: string;
  price: number;
  images: string[];
  variants: {
    sizes: string[];
    colors: string[];
  };
  timestamp?: number;
};

type ProductContextData = {
  mainImage: string;
  product: Product;
  setMainImage: (image: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  cep: string;
  setCep: (cep: string) => void;
  address: Address | null;
  setAddress: (address: Address | null) => void;
  error: string;
  setError: (error: string) => void;
  fetchAddress: () => Promise<void>;
};

interface ProductProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "product_context_data";
const EXPIRATION_MINUTES = 15;

type ProductContextStorage = {
  mainImage: string;
  selectedSize: string;
  selectedColor: string;
  cep: string;
  address: Address | null;
};

function saveToLocalStorage(data: ProductContextStorage) {
  const timestamp = new Date().getTime();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp }));
}

function loadFromLocalStorage(): ProductContextStorage | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const { data, timestamp } = JSON.parse(stored);
    const now = new Date().getTime();
    const diff = (now - timestamp) / 1000 / 60;

    if (diff > EXPIRATION_MINUTES) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

const ProductContext = createContext<ProductContextData>(
  {} as ProductContextData
);

const product: Product = {
  title: "Tênis Social Masculino Dipollini",
  price: 249.99,
  images: [
    "https://img.irroba.com.br/fit-in/600x600/filters:fill(fff):quality(80)/lojasapa/catalog/produtos/decoflex/vicenza/163/163-preto/sapato-social-superleve-sapatoterapia-preto-vicenza-9143.jpg",
    "https://dipollini.vtexassets.com/arquivos/ids/166495-800-800?v=636213724296100000&width=800&height=800&aspect=true",
    "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/lojamzq/media/uploads/produtos/foto/ebivtjef/sapato-social-feminino-salto-baixo-3071.jpg",
  ],
  variants: {
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Preto", "Branco", "Azul"],
  },
};

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const stored = loadFromLocalStorage();

  const [mainImage, setMainImage] = useState<string>(
    stored?.mainImage || product.images[0]
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    stored?.selectedSize || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    stored?.selectedColor || ""
  );
  const [cep, setCep] = useState<string>(stored?.cep || "");
  const [address, setAddress] = useState<Address | null>(
    stored?.address || null
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const dataToStore = {
      mainImage,
      selectedSize,
      selectedColor,
      cep,
      address,
    };
    saveToLocalStorage(dataToStore);
  }, [mainImage, selectedSize, selectedColor, cep, address]);

  const fetchAddress = async () => {
    if (cep.length !== 8) {
      setError("CEP inválido");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setError("CEP não encontrado");
        return;
      }
      setAddress(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar o CEP");
    }
  };

  const contextValue = {
    mainImage,
    product,
    setMainImage,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    cep,
    setCep,
    address,
    setAddress,
    error,
    setError,
    fetchAddress,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextData => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
