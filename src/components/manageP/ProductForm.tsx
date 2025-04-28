import React, { useState, useEffect } from "react";
import { ArrowLeft, X, Upload } from "lucide-react";
import { Product, ProductOption } from "@/types/product";
import { useStoreIdStore } from "@/zustand/store";
import { getHomeCategories, HomeCategoryResponse } from "@/utils/store";
import { postOptionProduct, postSingleProduct } from "@/utils/product";

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

interface ProductFormProps {
  currentProduct: Product | null;
  isNewProduct: boolean;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  currentProduct,
  isNewProduct,
  onSave,
  onCancel,
}) => {
  const [product, setProduct] = useState<Product | null>(currentProduct);
  const [tempOptionValues, setTempOptionValues] = useState<string[]>([]);
  const [optionList, setOptionList] = useState<ProductOption[]>([]);
  const { storeId } = useStoreIdStore();
  const [storeCategory, setStoreCategory] = useState<HomeCategoryResponse>({
    success: false,
    data: {
      storeId: 0,
      categories: [],
    },
  }); // 가게 홈 카테고리
  const [selectedStoreCategoryIds, setSelectedStoreCategoryIds] = useState<
    number[]
  >([]); // 선택한 카테고리 ID 배열

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
  useEffect(() => {
    setProduct(currentProduct);
  }, [currentProduct]);

  if (!product) return null;

  const handleTempOptionValuesChange = (index: number, valuesText: string) => {
    //const values = valuesText.split(",").map((v) => v.trim());
    const newTempValues = [...tempOptionValues];
    newTempValues[index] = valuesText;
    setTempOptionValues(newTempValues);
  };

  const applyOptionList = () => {
    const combinations = product.options.reduce((acc, option, index) => {
      const values =
        tempOptionValues[index]?.split(",").map((v) => v.trim()) ||
        option.optionValues;
      if (acc.length === 0) return values.map((value) => [value]);
      return acc.flatMap((combination) =>
        values.map((value) => [...combination, value])
      );
    }, [] as string[][]);

    const newOptionList = combinations.map((combination, index) => {
      // 각 조합에 대해 올바른 옵션명을 가져옴
      const optionName =
        product.options[index % product.options.length]?.optionName || ""; // 안전하게 접근
      return {
        optionName: optionName,
        optionValues: combination,
        prices: [0],
        salePrices: [0],
        stocks: [0],
      };
    });

    setOptionList(newOptionList);

    // 옵션값을 product.options에 반영
    const updatedOptions = product.options.map((option, index) => ({
      ...option,
      optionValues:
        tempOptionValues[index]?.split(",").map((v) => v.trim()) ||
        option.optionValues,
    }));

    setProduct({
      ...product,
      options: updatedOptions,
    });
  };

  const updateOptionDetail = (
    optionIndex: number,
    field: "prices" | "salePrices" | "stocks",
    value: number
  ) => {
    const newOptionList = [...optionList];
    newOptionList[optionIndex][field][0] = value;
    setOptionList(newOptionList);
  };

  const handleSave = async () => {
    if (!product) return;
    if (storeId == null) return;
    try {
      if (product.optionType === "단일") {
        const response = await postSingleProduct(storeId, {
          name: product.name,
          description: product.description,
          displayCategoryId: 0, // 실제 값으로 대체
          storeCategoryIds: selectedStoreCategoryIds, // 선택한 카테고리 ID 배열
          imageUrl: product.image,
          fulfillmentMethod: product.deliveryType,
          originalPrice: product.price,
          sellingPrice: product.salePrice,
          stock: product.stockQuantity,
        });
        console.log("단일 상품 저장 성공:", response);
      } else if (product.optionType === "옵션") {
        // API 호출 전에 optionValues 업데이트
        const updatedOptions = product.options.map((option, index) => ({
          ...option,
          optionValues:
            tempOptionValues[index]?.split(",").map((v) => v.trim()) ||
            option.optionValues,
        }));

        const response = await postOptionProduct(storeId, {
          name: product.name,
          description: product.description,
          displayCategoryId: 1, // 실제 값으로 대체
          storeCategoryIds: selectedStoreCategoryIds, // 선택한 카테고리 ID 배열
          fulfillmentMethod: product.deliveryType,
          optionGroups: updatedOptions.map((option) => ({
            name: option.optionName,
            values: option.optionValues,
          })),
          variants: optionList.flatMap((option) =>
            option.optionValues.map((value, i) => ({
              optionValues: [
                {
                  optionName:
                    product.options.length === 1
                      ? product.options[0].optionName // 단일 옵션일 경우
                      : product.options[i % product.options.length]
                          ?.optionName || "", // 다중 옵션 대응
                  optionValue: value,
                },
              ],
              originalPrice: option.prices[i],
              sellingPrice: option.salePrices[i],
              stock: option.stocks[i],
            }))
          ),
        });
        console.log("옵션 상품 저장 성공:", response);
      }

      onSave(product); // 부모 컴포넌트에 저장 완료 알림
    } catch (error) {
      console.error("상품 저장 실패:", error);
    }
  };

  const handleStoreCategoryChange = (categoryId: number) => {
    setSelectedStoreCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== categoryId);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, categoryId];
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">
            {isNewProduct ? "상품 등록" : "상품 수정"}
          </h2>
        </div>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-md"
        >
          저장
        </button>
      </div>

      {/* 상품 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-md font-medium pb-2 border-b">기본 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={product.name}
              onChange={(e) =>
                setProduct({
                  ...product,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">판매상태</label>
            <select
              className="w-full p-2 border rounded-md"
              value={product.status}
              onChange={(e) =>
                setProduct({
                  ...product,
                  status: e.target.value,
                })
              }
            >
              <option value="판매중">판매중</option>
              <option value="판매종료">판매종료</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              상품 카테고리
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={product.category}
              onChange={(e) =>
                setProduct({
                  ...product,
                  category: e.target.value,
                })
              }
            >
              <option value="">선택하세요</option>
              {productCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              가게홈 카테고리
            </label>
            <div className="space-y-2">
              {storeCategory.data.categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStoreCategoryIds.includes(category.id)}
                    onChange={() => handleStoreCategoryChange(category.id)}
                    className="mr-2"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            옵션 타입 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="optionType"
                value="단일"
                checked={product.optionType === "단일"}
                onChange={() =>
                  setProduct({
                    ...product,
                    optionType: "단일",
                    options: [],
                  })
                }
                className="mr-2"
              />
              단일 상품
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="optionType"
                value="옵션"
                checked={product.optionType === "옵션"}
                onChange={() =>
                  setProduct({
                    ...product,
                    optionType: "옵션",
                    options: [
                      {
                        optionName: "",
                        optionValues: [""],
                        prices: [0],
                        salePrices: [0],
                        stocks: [0],
                      },
                    ],
                  })
                }
                className="mr-2"
              />
              옵션 상품
            </label>
          </div>
        </div>

        {/* 단일 상품 정보 */}
        {product.optionType === "단일" && (
          <div className="pt-4">
            <h3 className="text-md font-medium pb-2 border-b">상품 구성</h3>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 border-b">정상가 (원)</th>
                  <th className="py-2 border-b">판매가 (원)</th>
                  <th className="py-2 border-b">재고수량</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 border-b">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={product.price}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td className="py-2 border-b">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={product.salePrice}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          salePrice: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td className="py-2 border-b">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={product.stockQuantity}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 옵션 설정 영역 */}
      {product.optionType === "옵션" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-0">
            <h3 className="text-md font-medium pb-2">옵션 설정</h3>
            {product.options.length < 3 && (
              <button
                onClick={() => {
                  setProduct({
                    ...product,
                    options: [
                      ...product.options,
                      {
                        optionName: "",
                        optionValues: [""],
                        prices: [0],
                        salePrices: [0],
                        stocks: [0],
                      },
                    ],
                  });
                }}
                className="text-blue-500 text-sm"
              >
                + 옵션 추가
              </button>
            )}
          </div>
          <hr className="w-full" />
          {product.options.map((option, optionIndex) => (
            <div key={optionIndex} className="border p-3 rounded-md mb-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="옵션명"
                  className="flex-1 p-2 border rounded-md"
                  value={option.optionName}
                  onChange={(e) => {
                    const newOptions = [...product.options];
                    newOptions[optionIndex].optionName = e.target.value;
                    setProduct({
                      ...product,
                      options: newOptions,
                    });
                  }}
                />
                <input
                  type="text"
                  placeholder="옵션값 (콤마로 구분)"
                  className="flex-1 p-2 border rounded-md"
                  value={
                    tempOptionValues[optionIndex] ||
                    option.optionValues.join(", ")
                  }
                  onChange={(e) =>
                    handleTempOptionValuesChange(optionIndex, e.target.value)
                  }
                />
                <button
                  className="text-red-500"
                  onClick={() => {
                    const newOptions = [...product.options];
                    newOptions.splice(optionIndex, 1);
                    setProduct({
                      ...product,
                      options: newOptions,
                    });
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button className="text-blue-500" onClick={applyOptionList}>
            옵션목록으로 적용
          </button>

          <h3 className="text-md font-medium pb-2 border-b">옵션 목록</h3>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 border-b">옵션명</th>
                <th className="py-2 border-b">옵션값</th>
                <th className="py-2 border-b">정상가 (원)</th>
                <th className="py-2 border-b">판매가 (원)</th>
                <th className="py-2 border-b">재고수량</th>
                <th className="py-2 border-b">삭제</th>
              </tr>
            </thead>
            <tbody>
              {optionList.map((option, index) => (
                <tr key={index}>
                  <td className="py-2 border-b pr-2">{option.optionName}</td>
                  <td className="py-2 border-b pr-2">{option.optionValues}</td>
                  <td className="py-2 border-b pr-2">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={option.prices[0]}
                      onChange={(e) =>
                        updateOptionDetail(
                          index,
                          "prices",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="py-2 border-b pr-2">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={option.salePrices[0]}
                      onChange={(e) =>
                        updateOptionDetail(
                          index,
                          "salePrices",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="py-2 border-b pr-2">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={option.stocks[0]}
                      onChange={(e) =>
                        updateOptionDetail(
                          index,
                          "stocks",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="py-2 border-b">
                    <button
                      className="text-red-500"
                      onClick={() => {
                        const newOptions = [...product.options];
                        newOptions.splice(index, 1);
                        setProduct({
                          ...product,
                          options: newOptions,
                        });
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 상품 이미지 및 설명 */}
      <div>
        <h3 className="text-md font-medium mb-2">상품 대표 이미지</h3>
        <label className="border-dashed border-2 p-8 rounded-md flex flex-col items-center justify-center cursor-pointer">
          {product.image ? (
            <img
              src={product.image}
              alt="상품 이미지"
              className="max-h-40 mb-2"
            />
          ) : (
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
          )}
          <p className="text-sm text-gray-500">
            이미지를 드래그하거나 클릭하여 업로드하세요
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setProduct({
                    ...product,
                    image: event.target?.result as string,
                  });
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>
      <div>
        <h3 className="text-md font-medium mb-2">상품 상세 설명</h3>
        <textarea
          className="w-full p-3 border rounded-md h-32"
          placeholder="상품에 대한 상세 설명을 입력하세요"
          value={product.description}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value,
            })
          }
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="minorPurchase"
          className="mr-2"
          checked={product.minorPurchase}
          onChange={(e) =>
            setProduct({
              ...product,
              minorPurchase: e.target.checked,
            })
          }
        />
        <label htmlFor="minorPurchase" className="text-sm">
          미성년자 구매 가능
        </label>
      </div>
    </div>
  );
};

export default ProductForm;
