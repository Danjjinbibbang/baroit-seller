import React, { useEffect, useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Product } from "@/types/product";
import { CategoryResponse, getCategories } from "@/utils/category";
import { useQuery } from "@tanstack/react-query";
import { getHomeCategories, HomeCategoryResponse } from "@/utils/store";
import { useStoreIdStore } from "@/zustand/store";

interface Category {
  id: number;
  name: string;
  depth: number;
  fullPath: string;
  displayOrder: number;
  active: boolean;
  children: Category[];
}

// 임시 카테고리 데이터
const mockCategoryResponse: CategoryResponse = {
  success: true,
  data: {
    categories: [
      {
        id: 1,
        name: "과일/채소",
        depth: 1,
        fullPath: "과일/채소",
        displayOrder: 1,
        active: true,
        children: [
          {
            id: 11,
            name: "과일",
            depth: 2,
            fullPath: "과일/채소 > 과일",
            displayOrder: 1,
            active: true,
            children: [
              {
                id: 111,
                name: "제철과일",
                depth: 3,
                fullPath: "과일/채소 > 과일 > 제철과일",
                displayOrder: 1,
                active: true,
                children: [],
              },
              {
                id: 112,
                name: "수입과일",
                depth: 3,
                fullPath: "과일/채소 > 과일 > 수입과일",
                displayOrder: 2,
                active: true,
                children: [],
              },
            ],
          },
          {
            id: 12,
            name: "채소",
            depth: 2,
            fullPath: "과일/채소 > 채소",
            displayOrder: 2,
            active: true,
            children: [
              {
                id: 121,
                name: "뿌리채소",
                depth: 3,
                fullPath: "과일/채소 > 채소 > 뿌리채소",
                displayOrder: 1,
                active: true,
                children: [],
              },
              {
                id: 122,
                name: "잎채소",
                depth: 3,
                fullPath: "과일/채소 > 채소 > 잎채소",
                displayOrder: 2,
                active: true,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "정육/계란",
        depth: 1,
        fullPath: "정육/계란",
        displayOrder: 2,
        active: true,
        children: [
          {
            id: 21,
            name: "소고기",
            depth: 2,
            fullPath: "정육/계란 > 소고기",
            displayOrder: 1,
            active: true,
            children: [
              {
                id: 211,
                name: "국내산 소고기",
                depth: 3,
                fullPath: "정육/계란 > 소고기 > 국내산 소고기",
                displayOrder: 1,
                active: true,
                children: [],
              },
              {
                id: 212,
                name: "수입산 소고기",
                depth: 3,
                fullPath: "정육/계란 > 소고기 > 수입산 소고기",
                displayOrder: 2,
                active: true,
                children: [],
              },
            ],
          },
          {
            id: 22,
            name: "돼지고기",
            depth: 2,
            fullPath: "정육/계란 > 돼지고기",
            displayOrder: 2,
            active: true,
            children: [],
          },
          {
            id: 23,
            name: "계란",
            depth: 2,
            fullPath: "정육/계란 > 계란",
            displayOrder: 3,
            active: true,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: "수산/해산물",
        depth: 1,
        fullPath: "수산/해산물",
        displayOrder: 3,
        active: true,
        children: [
          {
            id: 31,
            name: "생선",
            depth: 2,
            fullPath: "수산/해산물 > 생선",
            displayOrder: 1,
            active: true,
            children: [],
          },
          {
            id: 32,
            name: "조개/갑각류",
            depth: 2,
            fullPath: "수산/해산물 > 조개/갑각류",
            displayOrder: 2,
            active: true,
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: "간편식/반찬",
        depth: 1,
        fullPath: "간편식/반찬",
        displayOrder: 4,
        active: true,
        children: [
          {
            id: 41,
            name: "간편식",
            depth: 2,
            fullPath: "간편식/반찬 > 간편식",
            displayOrder: 1,
            active: true,
            children: [],
          },
          {
            id: 42,
            name: "반찬",
            depth: 2,
            fullPath: "간편식/반찬 > 반찬",
            displayOrder: 2,
            active: true,
            children: [],
          },
        ],
      },
      {
        id: 5,
        name: "음료/커피/차",
        depth: 1,
        fullPath: "음료/커피/차",
        displayOrder: 5,
        active: true,
        children: [
          {
            id: 51,
            name: "생수/음료",
            depth: 2,
            fullPath: "음료/커피/차 > 생수/음료",
            displayOrder: 1,
            active: true,
            children: [],
          },
          {
            id: 52,
            name: "커피",
            depth: 2,
            fullPath: "음료/커피/차 > 커피",
            displayOrder: 2,
            active: true,
            children: [],
          },
          {
            id: 53,
            name: "차",
            depth: 2,
            fullPath: "음료/커피/차 > 차",
            displayOrder: 3,
            active: true,
            children: [],
          },
        ],
      },
      {
        id: 6,
        name: "과자/빵/디저트",
        depth: 1,
        fullPath: "과자/빵/디저트",
        displayOrder: 6,
        active: true,
        children: [
          {
            id: 61,
            name: "과자/스낵",
            depth: 2,
            fullPath: "과자/빵/디저트 > 과자/스낵",
            displayOrder: 1,
            active: true,
            children: [],
          },
          {
            id: 62,
            name: "빵",
            depth: 2,
            fullPath: "과자/빵/디저트 > 빵",
            displayOrder: 2,
            active: true,
            children: [],
          },
          {
            id: 63,
            name: "케이크/디저트",
            depth: 2,
            fullPath: "과자/빵/디저트 > 케이크/디저트",
            displayOrder: 3,
            active: true,
            children: [],
          },
        ],
      },
      {
        id: 7,
        name: "건강식품",
        depth: 1,
        fullPath: "건강식품",
        displayOrder: 7,
        active: true,
        children: [
          {
            id: 71,
            name: "영양제",
            depth: 2,
            fullPath: "건강식품 > 영양제",
            displayOrder: 1,
            active: true,
            children: [],
          },
          {
            id: 72,
            name: "건강즙/건강음료",
            depth: 2,
            fullPath: "건강식품 > 건강즙/건강음료",
            displayOrder: 2,
            active: true,
            children: [],
          },
        ],
      },
      {
        id: 8,
        name: "생활용품",
        depth: 1,
        fullPath: "생활용품",
        displayOrder: 8,
        active: true,
        children: [
          {
            id: 81,
            name: "세제/세정제",
            depth: 2,
            fullPath: "생활용품 > 세제/세정제",
            displayOrder: 1,
            active: true,
            children: [],
          },
          {
            id: 82,
            name: "화장지/물티슈",
            depth: 2,
            fullPath: "생활용품 > 화장지/물티슈",
            displayOrder: 2,
            active: true,
            children: [],
          },
          {
            id: 83,
            name: "주방용품",
            depth: 2,
            fullPath: "생활용품 > 주방용품",
            displayOrder: 3,
            active: false,
            children: [],
          },
        ],
      },
    ],
  },
};

interface ProductListProps {
  products: Product[];
  filteredProducts: Product[];
  selectedProducts: string[];
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;
  selectedStoreCategory: string;
  onSearchTermChange: (term: string) => void;
  onSelectStatus: (status: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectStoreCategory: (category: string) => void;
  onSelectProduct: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAddProduct: () => void;
  onEditProduct: () => void;
  onDeleteProducts: () => void;
  onResetSearch: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  filteredProducts,
  selectedProducts,
  searchTerm,
  selectedStatus,
  selectedCategory,
  selectedStoreCategory,
  onSearchTermChange,
  onSelectStatus,
  onSelectCategory,
  onSelectStoreCategory,
  onSelectProduct,
  onSelectAll,
  onAddProduct,
  onEditProduct,
  onDeleteProducts,
  onResetSearch,
}) => {
  // const { data, isLoading } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: async () => {
  //     const res = await getCategories();

  //     return res;
  //   },
  //   staleTime: 1000 * 60 * 5, // 5분간 캐싱
  // });
  // 상품 카테고리 열기
  const [isOpen, setIsOpen] = useState(false);

  const { storeId } = useStoreIdStore();
  const [storeCategory, setStoreCategory] = useState<HomeCategoryResponse>({
    success: false,
    data: {
      storeId: 0,
      categories: [],
    },
  }); // 가게 홈 카테고리

  useEffect(() => {
    handleGetStore();
  }, []);

  // 가게홈 카테고리 조회
  const handleGetStore = async () => {
    if (!storeId) return;
    try {
      const categories = await getHomeCategories(storeId);
      setStoreCategory(categories);
    } catch (error) {
      console.error("홈 카테고리 조회 실패", error);
    }
  };

  // 상품 카테고리 조회

  const [hoveredPath, setHoveredPath] = useState<{
    depth1: number | null;
    depth2: number | null;
  }>({
    depth1: null,
    depth2: null,
  });

  return (
    <div className="px-4 py-4 border-b space-y-4 bg-white rounded-t-lg">
      {/* 검색 및 필터 영역 */}
      <div className="px-4 py-4 border-1 rounded-lg space-y-4">
        {/* 검색창 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">검색어</span>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="상품명을 입력해주세요"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            className="px-3 py-2 border rounded-md text-sm flex items-center gap-1"
            onClick={onResetSearch}
          >
            초기화
          </button>
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
            onClick={() => {}}
          >
            검색
          </button>
        </div>

        {/* 카테고리 및 상태 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">판매상태</span>
          <button
            className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 ${
              selectedStatus === "전체" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => onSelectStatus("전체")}
          >
            전체
          </button>
          <button
            className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 ${
              selectedStatus === "판매중" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => onSelectStatus("판매중")}
          >
            판매중
          </button>
          <button
            className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 ${
              selectedStatus === "판매종료" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => onSelectStatus("판매종료")}
          >
            판매종료
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">상품 카테고리</span>
          <div className="relative">
            <button
              className="px-3 py-1.5 border rounded-full text-sm"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {selectedCategory || "상품 카테고리 선택"}
              <ChevronDown className="inline-block ml-2 w-4 h-4" />
            </button>
            {isOpen && (
              <div
                className="absolute top-full left-0 bg-white border rounded shadow z-10 flex flex-col"
                onMouseLeave={() =>
                  setHoveredPath({ depth1: null, depth2: null })
                }
              >
                {/* depth1 */}
                <div className="w-full">
                  {mockCategoryResponse.data.categories.map((depth1) => (
                    <div
                      key={depth1.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                      onMouseEnter={() =>
                        setHoveredPath({ depth1: depth1.id, depth2: null })
                      }
                    >
                      {depth1.name}
                      {/* depth 2 */}
                      {hoveredPath.depth1 === depth1.id &&
                        depth1.children.length > 0 && (
                          <div className="absolute left-full top-0 bg-white border rounded shadow z-20 flex flex-col w-full">
                            {depth1.children.map((depth2) => (
                              <div
                                key={depth2.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                                onMouseEnter={() =>
                                  setHoveredPath({
                                    depth1: depth1.id,
                                    depth2: depth2.id,
                                  })
                                }
                              >
                                {depth2.name}
                                {/* depth 3 */}
                                {hoveredPath.depth2 === depth2.id &&
                                  depth2.children.length > 0 && (
                                    <div className="absolute left-full top-0 bg-white border rounded shadow z-30 w-full">
                                      {depth2.children.map((depth3) => (
                                        <div
                                          key={depth3.id}
                                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                                          onClick={() => {
                                            onSelectCategory(depth3.fullPath);
                                            setIsOpen(false);
                                          }}
                                        >
                                          {depth3.name}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">가게홈 카테고리</span>
          <div className="relative">
            <select
              className="px-3 py-1.5 border rounded-full text-sm appearance-none pr-8"
              value={selectedStoreCategory}
              onChange={(e) => onSelectStoreCategory(e.target.value)}
            >
              <option value="">가게홈 카테고리 선택</option>
              {storeCategory.data.categories.map((category, idx) => (
                <option key={idx} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
      {/* 액션 버튼 영역 */}
      <div className="px-4 py-3 border-b flex items-center justify-end gap-2">
        <button
          className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1"
          onClick={onDeleteProducts}
          disabled={selectedProducts.length === 0}
        >
          삭제
        </button>
        <button
          className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1"
          onClick={onEditProduct}
          disabled={selectedProducts.length !== 1}
        >
          수정
        </button>
        <button
          className="flex items-center gap-1 text-blue-500 text-sm"
          onClick={onAddProduct}
        >
          <Plus className="w-4 h-4" />
          상품 등록
        </button>
      </div>
      {/* 상품 목록 */}
      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500 sticky top-0 whitespace-nowrap">
              <div className="pr-4 flex-shrink-0">
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                />
              </div>
              <div className="w-20 flex-shrink-0">상품ID</div>
              <div className="w-40 flex-shrink-0">상품명</div>
              <div className="w-20 flex-shrink-0">판매상태</div>
              <div className="w-20 flex-shrink-0">재고</div>
              <div className="w-20 flex-shrink-0">정상가</div>
              <div className="w-20 flex-shrink-0">판매가</div>
              <div className="w-20 flex-shrink-0">재고</div>
              <div className="w-24 flex-shrink-0">배송방식</div>
              <div className="w-24 flex-shrink-0">등록 이력</div>
              <div className="w-32 flex-shrink-0">최근 수정 이력</div>
            </div>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex px-4 py-3 border-b text-sm hover:bg-gray-50 whitespace-nowrap"
              >
                <div className="pr-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onSelectProduct(product.id)}
                  />
                </div>
                <div className="w-20 flex-shrink-0">{product.id}</div>
                <div className="w-40 flex-shrink-0 text-blue-500">
                  {product.name}
                </div>
                <div className="w-20 flex-shrink-0">{product.status}</div>
                <div className="w-20 flex-shrink-0">{product.stock}</div>
                <div className="w-20 flex-shrink-0">
                  {product.price.toLocaleString()}원
                </div>
                <div className="w-20 flex-shrink-0">
                  {product.salePrice.toLocaleString()}원
                </div>
                <div className="w-20 flex-shrink-0">{product.unit}</div>
                <div className="w-24 flex-shrink-0">{product.deliveryType}</div>
                <div className="w-24 flex-shrink-0">{product.createdAt}</div>
                <div className="w-32 flex-shrink-0">{product.updatedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
