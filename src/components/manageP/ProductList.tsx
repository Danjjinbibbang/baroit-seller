import React from "react";
import { Search, Plus, ChevronDown } from "lucide-react";

// 임시 카테고리 데이터
const productCategories = [
  "과일/채소",
  "정육/계란",
  "수산/해산물",
  "간편식/반찬",
  "음료/커피/차",
  "과자/빵/디저트",
  "건강식품",
  "생활용품",
];

const storeCategories = [
  "신상품",
  "베스트",
  "특가/할인",
  "제철식품",
  "선물세트",
  "지역특산물",
  "친환경/유기농",
];

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
  products,
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">상품 카테고리</span>
          <div className="relative">
            <select
              className="px-3 py-1.5 border rounded-full text-sm appearance-none pr-8"
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
            >
              <option value="">상품 카테고리 선택</option>
              {productCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
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
              {storeCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
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
              <div className="w-24 flex-shrink-0">재고 관리</div>
              <div className="w-20 flex-shrink-0">정상가</div>
              <div className="w-20 flex-shrink-0">판매가</div>
              <div className="w-20 flex-shrink-0">음식개수</div>
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
                <div className="w-24 flex-shrink-0">
                  {product.stockManagement}
                </div>
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
