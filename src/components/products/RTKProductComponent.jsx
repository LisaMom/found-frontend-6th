import { useParams } from "react-router";
import {
  useAddNewProductMutation,
  useDeleteProductByUUIDMutation,
  useUpdateProductByUUIDMutation,
} from "../../services/productApi";

export default function RTKProductComponent() {
  // create product
  const [createProductRequest, { data }] = useAddNewProductMutation();

  // update product by uuid
  const [updateProductRequest, { data: updateProductResponse }] =
    useUpdateProductByUUIDMutation();

  //   delete product by uuid
  const [deleteProductRequest, { data: deleteProductResponse }] =
    useDeleteProductByUUIDMutation();
    
  //   mock product
  // mock update product
  const newProduct = {
    name: "Lisa-ASUS ROG Zephyrus G14",
    description:
      "Compact 14-inch gaming laptop with AMD Ryzen 9 processor, ideal for gaming and content creation on the go.",
    computerSpec: {
      processor: "AMD Ryzen 9 7940HS, 8-core, up to 5.2GHz",
      ram: "16GB DDR5 5600MHz",
      storage: "1TB PCIe 4.0 NVMe SSD",
      gpu: "NVIDIA GeForce RTX 4060 8GB",
      os: "Windows 11 Home",
      screenSize: "14-inch QHD+ 165Hz",
      battery: "76Wh, up to 10 hours",
    },
    stockQuantity: 25,
    priceIn: 1150,
    priceOut: 1450,
    discount: 10,
    color: [
      {
        color: "Eclipse Gray",
        images: [
          "https://example.com/images/rog-g14-gray-1.jpg",
          "https://example.com/images/rog-g14-gray-2.jpg",
        ],
      },
      {
        color: "Moonlight White",
        images: ["https://example.com/images/rog-g14-white-1.jpg"],
      },
    ],
    thumbnail:
      "https://dlcdnwebimgs.asus.com/gain/08000E15-8711-44FD-9B43-067CAC3F3A78",
    warranty: "2 years international warranty",
    availability: true,
    images: [
      "https://example.com/images/rog-g14-front.jpg",
      "https://example.com/images/rog-g14-side.jpg",
      "https://example.com/images/rog-g14-back.jpg",
    ],
    categoryUuid: "462d9f60-8346-45ab-b8b3-a597d240965b",
    supplierUuid: "a34496d2-370e-4332-8c6d-b4a6bc069bf1",
    brandUuid: "8f2e3bcb-bb0b-45a1-b9bc-1d43f08f0ddb",
  };

  const updateProduct = {
    name: "Lisa-ASUS ROG Zephyrus G14 (Updated)",
    description:
      "Compact 14-inch gaming laptop with AMD Ryzen 9 processor, now with upgraded RAM and storage for 2026.",
    stockQuantity: 12,
    priceIn: 1250,
    priceOut: 1650,
    discount: 15,
    color: [
      {
        color: "Eclipse Gray",
        images: [
          "https://example.com/images/rog-g14-gray-1.jpg",
          "https://example.com/images/rog-g14-gray-2.jpg",
        ],
      },
      {
        color: "Moonlight White",
        images: ["https://example.com/images/rog-g14-white-1.jpg"],
      },
    ],
    thumbnail:
      "https://dlcdnwebimgs.asus.com/gain/08000E15-8711-44FD-9B43-067CAC3F3A78",
    warranty: "2 years international warranty",
    availability: true,
    images: [
      "https://example.com/images/rog-g14-front.jpg",
      "https://example.com/images/rog-g14-side.jpg",
      "https://example.com/images/rog-g14-back.jpg",
    ],
    categoryUuid: "462d9f60-8346-45ab-b8b3-a597d240965b",
    supplierUuid: "a34496d2-370e-4332-8c6d-b4a6bc069bf1",
    brandUuid: "8f2e3bcb-bb0b-45a1-b9bc-1d43f08f0ddb",
  };

  const{uuid} = useParams();

  async function createProductFunc() {
    createProductRequest({
      createProduct: newProduct
    })
  }
  async function updateProductFunc() {
    updateProductRequest({
      updateProduct: updateProduct,
      uuid: uuid,
    });
  }
  async function deleteProductFunc() {
    deleteProductRequest({
      uuid: uuid,
    })
  }

  return (
    <div className="flex gap-2">
      {/* button create product */}
      <button
        className="border p-4 rounded bg-green-500 text-white"
        onClick={() => createProductFunc()}
      >
        Create Product
      </button>
      {/* button update product by uuid */}
      <button
        className="border p-4 rounded bg-yellow-500 text-white"
        onClick={() => updateProductFunc()}
      >
        Update Product
      </button>
      {/* button delete product by uuid */}
      <button
        className="border p-4 rounded bg-red-500 text-white"
        onClick={() => deleteProductFunc()}
      >
        Delete Product
      </button>
    </div>
  );
}
