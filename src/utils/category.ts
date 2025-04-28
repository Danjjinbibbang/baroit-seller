// 카테고리 트리 조회
export interface CategoryResponse {
  success: boolean;
  data: {
    categories: {
      id: number;
      name: string;
      depth: number;
      fullPath: string;
      displayOrder: number;
      active: boolean;
      children: CategoryChildren[];
    }[];
  };
}

export interface CategoryChildren {
  id: number;
  name: string;
  depth: number;
  fullPath: string;
  displayOrder: number;
  active: boolean;
  children: CategoryChildren[];
}

// 카테고리 트리 조회
export async function getCategories(): Promise<CategoryResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories/tree`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  console.log("카테고리 응답: ", data);
  if (!data.success) {
    const error = await res.json();
    throw new Error(error.message || "카테고리 조회에 실패했습니다.");
  }

  return data;
}

// 하위 카테고리 조회
export async function getSubCategories(parentId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories/children?parentId=${parentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  if (!data.success) {
    const error = await res.json();
    throw new Error(error.message || "하위 카테고리 조회에 실패했습니다.");
  }

  return res;
}
