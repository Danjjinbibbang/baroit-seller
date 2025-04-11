"use client";

import React, { useState, useEffect } from "react";
import {
  createHomeCategory,
  getHomeCategories,
  updateHomeCategory,
  deleteHomeCategory,
} from "@/utils/store";

interface HomeCategory {
  storeCategoryId: number;
  categoryName: string;
}

interface Props {
  storeId: number | null;
}

export function HomeCategories({ storeId }: Props) {
  const [homeCategories, setHomeCategories] = useState<HomeCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchCategories = async () => {
      if (!storeId) return;

      try {
        const categories = await getHomeCategories(storeId);
        setHomeCategories(
          categories.data.categories.map((category) => ({
            storeCategoryId: category.id,
            categoryName: category.name,
          }))
        );
      } catch (error) {
        console.error("홈 카테고리 불러오기 실패:", error);
        if (error instanceof Error && error.message.includes("401")) {
          alert("인증 오류가 발생했습니다. 다시 로그인 해주세요.");
        }
      }
    };

    fetchCategories();
  }, [storeId]);

  const handleAddCategory = async () => {
    if (!storeId) return;

    try {
      const newCategory = await createHomeCategory(storeId, {
        name: newCategoryName,
      });
      console.log("newCategory", newCategory);
      setHomeCategories((prev) => [
        ...prev,
        {
          storeCategoryId: newCategory.data.storeCategoryId,
          categoryName: newCategory.data.categoryName,
        },
      ]);
      setNewCategoryName("");
    } catch (error) {
      console.error("홈 카테고리 생성 실패:", error);
      alert(error instanceof Error ? error.message : "생성에 실패했습니다.");
    }
  };

  const handleEditCategory = async () => {
    if (!storeId || editingCategoryId === null) return;

    try {
      await updateHomeCategory(storeId, editingCategoryId, {
        name: newCategoryName,
      });

      setHomeCategories((prev) =>
        prev.map((category) =>
          category.storeCategoryId === editingCategoryId
            ? {
                ...category,
                categoryName: newCategoryName,
              }
            : category
        )
      );

      setIsEditingCategory(false);
      setEditingCategoryId(null);
      setNewCategoryName("");
    } catch (error) {
      console.error("홈 카테고리 수정 실패:", error);
      alert(error instanceof Error ? error.message : "수정에 실패했습니다.");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!storeId) return;

    try {
      await deleteHomeCategory(storeId, categoryId);
      setHomeCategories((prev) =>
        prev.filter((c) => c.storeCategoryId !== categoryId)
      );
    } catch (error) {
      console.error("홈 카테고리 삭제 실패:", error);
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">가게 홈 카테고리 관리</h3>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="카테고리 이름"
            className="w-full p-2 border rounded-md"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button
            onClick={isEditingCategory ? handleEditCategory : handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {isEditingCategory ? "수정" : "추가"}
          </button>
        </div>

        <ul className="list-disc pl-5 space-y-2">
          {homeCategories.map((category) => (
            <li
              key={category.storeCategoryId}
              className="flex justify-between items-center"
            >
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditingCategory(true);
                    setEditingCategoryId(category.storeCategoryId);
                    setNewCategoryName(category.categoryName);
                  }}
                  className="text-blue-500"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.storeCategoryId)}
                  className="text-red-500"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
