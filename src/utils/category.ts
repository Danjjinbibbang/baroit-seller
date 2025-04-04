// 카테고리 트리 조회
export async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories/tree`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "카테고리 조회에 실패했습니다.");
  }

  return res;
}

// 하위 카테고리 조회
export async function getSubCategories(parentId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories/children?parentId=${parentId}`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "하위 카테고리 조회에 실패했습니다.");
  }

  return res;
}
