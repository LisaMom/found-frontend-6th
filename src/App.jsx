import "./App.css";
// import ProductComponent from './components/products/ProductComponent'
import { Suspense, lazy } from "react";
import LoadingComponent from "./components/LoadingComponent";
import { Link } from "react-router";
import { useGetAllProductsQuery } from "./services/ecommerceApi";

function App() {
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //  const loader = async() => {
  //   const response = await fetch(
  //     `${import.meta.env.VITE_BASE_ISHOP_URL}/products`,
  //   );
  //   const result = await response.json();
  //   setProducts(result?.content);

  //  }
  //  loader()
    
  // }, []);

  // calling get all products hook
  const {data:products, isLoading, error} = useGetAllProductsQuery();

  const ProductComponent = lazy(
    () => import("./components/products/ProductComponent"),
  );

  return (
    //  jsx rule will be presented here
    <div>

      <section className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
        {/* renders product cards here */}

        {/* add loading */}
        <Suspense fallback={<LoadingComponent />}>
          {isLoading && <LoadingComponent />}
          {error && <p>Failed to load products.</p>}
          {(products ?? []).map(({ uuid, name, priceOut, thumbnail, category }) => (
            <Link  key={uuid} to={`/product/${uuid}`}>
              <ProductComponent
                title={name}
                price={priceOut}
                image={thumbnail}
                category={category?.name}
              />
            </Link>
          ))}
        </Suspense>
      </section>
    </div>
  );
}

export default App;
