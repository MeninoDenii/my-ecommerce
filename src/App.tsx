import { Button } from "./components/button";
import { Input } from "./components/input";
import { useProduct } from "./contexts/product";

function App() {
  const {
    mainImage,
    setMainImage,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    cep,
    setCep,
    address,
    error,
    product,
    fetchAddress,
  } = useProduct();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#dedede] rounded-lg">
        <div>
          <img
            src={mainImage}
            alt="Produto"
            className="w-full h-[400px] border border-[#dedede] object-cover rounded-2xl"
          />
          <div className="flex mt-4 space-x-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Miniatura"
                className={`w-20 h-20 max-w-20 max-h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  mainImage === img
                    ? "border-blue-500"
                    : "border border-[#dedede]"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-xl text-green-600 font-semibold mb-4">
            R$ {Intl.NumberFormat("pt-BR").format(product.price)}
          </p>

          <div className="mb-4">
            <p className="font-medium">Tamanho:</p>
            <div className="flex space-x-2 mt-2">
              {product.variants.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "primary" : "secondary"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium">Cor:</p>
            <div className="flex space-x-2 mt-2">
              {product.variants.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "primary" : "secondary"}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="font-medium mb-1">Consultar CEP para entrega:</p>
            <div
              className={`flex items-center space-x-2 ${
                error ? "items-center" : "items-end"
              }`}
            >
              <Input
                placeholder="Digite o CEP"
                label="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                error={error}
              />
              <Button className="p-2" variant="primary" onClick={fetchAddress}>
                Consultar
              </Button>
            </div>
            {address && !error.length && (
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  {address.logradouro}, {address.bairro}
                </p>
                <p>
                  {address.localidade} - {address.uf}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
