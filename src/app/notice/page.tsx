"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, X } from "lucide-react";

// 임시 공지 데이터
const initialNotices = [
  {
    id: 1,
    title: "휴무 안내",
    content: "2023년 1월 1일부터 3일까지 휴무입니다.",
    createdAt: "2023-12-25",
    updatedAt: "2023-12-25",
    isActive: true,
  },
  {
    id: 2,
    title: "배달 지연 안내",
    content: "기상 악화로 인해 배달이 30분 정도 지연될 수 있습니다.",
    createdAt: "2023-12-20",
    updatedAt: "2023-12-20",
    isActive: true,
  },
  {
    id: 3,
    title: "신메뉴 출시 안내",
    content: "1월 1일부터 새로운 메뉴가 출시됩니다!",
    createdAt: "2023-12-15",
    updatedAt: "2023-12-15",
    isActive: false,
  },
];

export default function Notice() {
  const [notices, setNotices] = useState(initialNotices);
  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredNotices, setFilteredNotices] = useState(notices);
  const [showModal, setShowModal] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<any>(null);
  const [isNewNotice, setIsNewNotice] = useState(false);

  // 검색어 디바운싱 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // 검색어에 따른 필터링
  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = notices.filter((notice) =>
        notice.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredNotices(filtered);
    } else {
      setFilteredNotices(notices);
    }
  }, [debouncedSearchTerm, notices]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedNotices(filteredNotices.map((n) => n.id));
    } else {
      setSelectedNotices([]);
    }
  };

  const handleSelectNotice = (id: number) => {
    setSelectedNotices((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditNotice = () => {
    if (selectedNotices.length !== 1) return;

    const noticeToEdit = notices.find((n) => n.id === selectedNotices[0]);
    if (noticeToEdit) {
      setCurrentNotice({ ...noticeToEdit });
      setIsNewNotice(false);
      setShowModal(true);
    }
  };

  const handleAddNotice = () => {
    const newId = Math.max(...notices.map((n) => n.id), 0) + 1;
    const today = new Date().toISOString().split("T")[0];

    setCurrentNotice({
      id: newId,
      title: "",
      content: "",
      createdAt: today,
      updatedAt: today,
      isActive: true,
    });
    setIsNewNotice(true);
    setShowModal(true);
  };

  const handleDeleteNotices = () => {
    if (selectedNotices.length === 0) return;

    setNotices((prev) =>
      prev.filter((notice) => !selectedNotices.includes(notice.id))
    );
    setSelectedNotices([]);
  };

  const handleSaveNotice = () => {
    if (!currentNotice) return;

    const today = new Date().toISOString().split("T")[0];
    const updatedNotice = {
      ...currentNotice,
      updatedAt: today,
    };

    if (isNewNotice) {
      setNotices((prev) => [...prev, updatedNotice]);
    } else {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === updatedNotice.id ? updatedNotice : notice
        )
      );
    }

    setShowModal(false);
    setCurrentNotice(null);
    setSelectedNotices([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentNotice((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isActive = e.target.value === "true";
    setCurrentNotice((prev: any) => ({
      ...prev,
      isActive,
    }));
  };

  return (
    <>
      <header className="mb-4">
        <h1 className="text-lg font-bold">공지 관리</h1>
      </header>

      {/* 검색 및 버튼 영역 */}
      <div className="px-4 py-4 border-b space-y-4 bg-white rounded-t-lg">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex-1 relative max-w-md">
            <input
              type="text"
              placeholder="공지 제목을 입력해주세요"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex gap-3">
            <button
              className="px-3 py-2 border border-blue-500 text-blue-500 rounded-md text-sm flex items-center gap-1"
              onClick={handleEditNotice}
              disabled={selectedNotices.length !== 1}
            >
              <Edit className="w-4 h-4" />
              수정
            </button>
            <button
              className="px-3 py-2 border border-blue-500 text-blue-500 rounded-md text-sm flex items-center gap-1"
              onClick={handleDeleteNotices}
              disabled={selectedNotices.length === 0}
            >
              <Trash className="w-4 h-4" />
              삭제
            </button>
            <button
              className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center gap-1"
              onClick={handleAddNotice}
            >
              <Plus className="w-4 h-4" />
              공지 등록
            </button>
          </div>
        </div>
      </div>

      {/* 공지 목록 */}
      <div className="flex-1 overflow-hidden bg-white rounded-b-lg">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500 sticky top-0 whitespace-nowrap">
              <div className="pr-4 flex-shrink-0">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedNotices.length === filteredNotices.length &&
                    filteredNotices.length > 0
                  }
                />
              </div>
              <div className="w-100 flex-shrink-0">제목</div>
              <div className="w-30 flex-shrink-0">등록일</div>
              <div className="w-30 flex-shrink-0">최종 수정일</div>
              <div className="w-20 flex-shrink-0">상태</div>
            </div>
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="flex px-4 py-3 border-b text-sm hover:bg-gray-50 whitespace-nowrap items-center"
              >
                <div className="pr-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedNotices.includes(notice.id)}
                    onChange={() => handleSelectNotice(notice.id)}
                  />
                </div>
                <div className="w-100 flex-shrink-0">
                  {notice.title}
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {notice.content}
                  </p>
                </div>
                <div className="w-30 flex-shrink-0 text-gray-500">
                  {notice.createdAt}
                </div>
                <div className="w-30 flex-shrink-0 text-gray-500">
                  {notice.updatedAt}
                </div>
                <div className="w-20 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      notice.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {notice.isActive ? "게시중" : "숨김"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 공지 수정/등록 모달 */}
      {showModal && currentNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">
                {isNewNotice ? "공지 등록" : "공지 수정"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">제목</label>
                  <input
                    type="text"
                    name="title"
                    value={currentNotice.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">내용</label>
                  <textarea
                    name="content"
                    value={currentNotice.content}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md h-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">상태</label>
                  <select
                    value={currentNotice.isActive.toString()}
                    onChange={handleStatusChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="true">게시중</option>
                    <option value="false">숨김</option>
                  </select>
                </div>
                {!isNewNotice && (
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        등록일
                      </label>
                      <input
                        type="text"
                        value={currentNotice.createdAt}
                        disabled
                        className="w-full px-3 py-2 border rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        최종 수정일
                      </label>
                      <input
                        type="text"
                        value={currentNotice.updatedAt}
                        disabled
                        className="w-full px-3 py-2 border rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleSaveNotice}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
