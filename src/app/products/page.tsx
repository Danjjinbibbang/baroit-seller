// Start of Selection
"use client";

import React, { useState, useEffect } from "react";
import ProductForm from "@/components/manageP/ProductForm";
import ProductList from "@/components/manageP/ProductList";
import { useStoreIdStore } from "@/zustand/store";
import { postOptionProduct, postSingleProduct } from "@/utils/product";

// 옵션 타입 정의
interface ProductOption {
  optionName: string;
  optionValues: string[];
  prices: number[];
  salePrices: number[];
  stocks: number[];
}

//상품 타입 정의
interface Product {
  id: string;
  name: string;
  status: string;
  stock: string;
  stockManagement: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  unit: string;
  deliveryType: string;
  updatedAt: string;
  createdAt: string;
  category: string;
  storeCategory: string;
  saleStartDate: string;
  saleEndDate: string;
  optionType: "단일" | "옵션";
  options: ProductOption[];
  image: string;
  description: string;
  minorPurchase: boolean;
}

const initialProducts = [
  {
    id: "10025723",
    name: "대추 방울 토마토 5kg",
    status: "판매중",
    stock: "재고있음",
    stockManagement: "재고 관리",
    price: 11900,
    salePrice: 11900,
    stockQuantity: 50,
    unit: "단위",
    deliveryType: "배달",
    updatedAt: "2023.12.31",
    createdAt: "2023.12.30",
    category: "과일/채소",
    storeCategory: "제철식품",
    saleStartDate: "2023.12.30",
    saleEndDate: "2024.12.30",
    optionType: "단일" as const,
    options: [],
    image: "",
    description: "신선한 대추 방울 토마토입니다.",
    minorPurchase: true,
  },
  {
    id: "10025724",
    name: "제주 천혜향 1박스 3kg",
    status: "판매중",
    stock: "재고있음",
    stockManagement: "재고 관리",
    price: 12900,
    salePrice: 12900,
    stockQuantity: 30,
    unit: "1",
    deliveryType: "픽업",
    updatedAt: "2023.12.31",
    createdAt: "2023.12.30",
    category: "과일/채소",
    storeCategory: "지역특산물",
    saleStartDate: "2023.12.30",
    saleEndDate: "2024.12.30",
    optionType: "옵션" as const,
    options: [
      {
        optionName: "포장",
        optionValues: ["선물용", "일반"],
        prices: [13900, 12900],
        salePrices: [13900, 12900],
        stocks: [20, 10],
      },
    ],
    image: "",
    description: "제주도에서 직송한 천혜향입니다.",
    minorPurchase: true,
  },
];

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStoreCategory, setSelectedStoreCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product[] | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // 검색 및 필터링 적용
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let result = [...products];

      if (selectedStatus !== "전체") {
        result = result.filter((product) => product.status === selectedStatus);
      }

      if (searchTerm) {
        result = result.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory) {
        result = result.filter(
          (product) => product.category === selectedCategory
        );
      }

      if (selectedStoreCategory) {
        result = result.filter(
          (product) => product.storeCategory === selectedStoreCategory
        );
      }

      setFilteredProducts(result);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    products,
    selectedStatus,
    searchTerm,
    selectedCategory,
    selectedStoreCategory,
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleEditProduct = () => {
    if (selectedProducts.length === 1) {
      const productToEdit = products.find((p) => p.id === selectedProducts[0]);
      if (productToEdit) {
        setCurrentProduct({ ...productToEdit });
        setIsNewProduct(false);
        setIsEditMode(true);
      }
    }
  };

  const handleAddProduct = () => {
    const newProductId = (
      parseInt(products[products.length - 1]?.id || "10000000") + 1
    ).toString();
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, ".");

    setCurrentProduct({
      id: newProductId,
      name: "",
      status: "판매중",
      stock: "재고있음",
      stockManagement: "재고 관리",
      price: 0,
      salePrice: 0,
      stockQuantity: 0,
      unit: "",
      deliveryType: "DELIVERY_ONLY",
      updatedAt: dateStr,
      createdAt: dateStr,
      category: "",
      storeCategory: "",
      saleStartDate: dateStr,
      saleEndDate: dateStr.replace(
        dateStr.substring(0, 4),
        (parseInt(dateStr.substring(0, 4)) + 1).toString()
      ),
      optionType: "단일",
      options: [],
      image: "",
      description: "",
      minorPurchase: true,
    });
    setIsNewProduct(true);
    setIsEditMode(true);
  };

  const handleDeleteProducts = () => {
    if (selectedProducts.length > 0) {
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, ".");

    try {
      if (isNewProduct) {
        setProducts((prev) => [
          ...prev,
          { ...product, createdAt: dateStr, updatedAt: dateStr },
        ]);
      } else {
        // 수정 로직
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...product, updatedAt: dateStr } : p
          )
        );
      }
    } catch (error) {
      console.error("상품 저장 실패:", error);
    }

    setIsEditMode(false);
    setCurrentProduct(null);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        {isEditMode ? (
          <ProductForm
            currentProduct={currentProduct}
            isNewProduct={isNewProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelEdit}
          />
        ) : (
          <ProductList
            products={products}
            filteredProducts={filteredProducts}
            selectedProducts={selectedProducts}
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            selectedCategory={selectedCategory}
            selectedStoreCategory={selectedStoreCategory}
            onSearchTermChange={setSearchTerm}
            onSelectStatus={setSelectedStatus}
            onSelectCategory={setSelectedCategory}
            onSelectStoreCategory={setSelectedStoreCategory}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProducts={handleDeleteProducts}
            onResetSearch={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSelectedStoreCategory("");
              setSelectedStatus("전체");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
