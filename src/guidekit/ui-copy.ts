import type { LanguageCode } from "./types.ts";

type UiCopy = {
  allRegions: string;
  allShops: string;
  age: string;
  call: string;
  close: string;
  contact: string;
  empty: string;
  featured: string;
  height: string;
  hotels: string;
  language: string;
  photos: string;
  prices: string;
  region: string;
  search: string;
  searchPlaceholder: string;
  shop: string;
  today: string;
  updated: string;
  view: string;
  ageGateTitle: string;
  ageGateCopy: string;
  confirmAge: string;
  leave: string;
};

export const uiCopy: Record<LanguageCode, UiCopy> = {
  "zh-Hant": {
    allRegions: "全部地區",
    allShops: "全部店家",
    age: "年齡",
    call: "電話",
    close: "關閉",
    contact: "聯絡",
    empty: "目前沒有符合條件的項目。",
    featured: "推薦",
    height: "身高",
    hotels: "地點",
    language: "語言",
    photos: "張照片",
    prices: "價格",
    region: "地區",
    search: "搜尋",
    searchPlaceholder: "名稱、地區或標籤",
    shop: "店家",
    today: "今日",
    updated: "更新",
    view: "查看",
    ageGateTitle: "請確認你已達法定年齡",
    ageGateCopy: "這個範本用於成人向導覽網站。請依你的部署地區調整合規文案。",
    confirmAge: "我已達法定年齡",
    leave: "離開",
  },
  "zh-Hans": {
    allRegions: "全部地区",
    allShops: "全部店家",
    age: "年龄",
    call: "电话",
    close: "关闭",
    contact: "联系",
    empty: "目前没有符合条件的项目。",
    featured: "推荐",
    height: "身高",
    hotels: "地点",
    language: "语言",
    photos: "张照片",
    prices: "价格",
    region: "地区",
    search: "搜索",
    searchPlaceholder: "名称、地区或标签",
    shop: "店家",
    today: "今日",
    updated: "更新",
    view: "查看",
    ageGateTitle: "请确认你已达到法定年龄",
    ageGateCopy: "这个模板用于成人向导览网站。请按你的部署地区调整合规文案。",
    confirmAge: "我已达到法定年龄",
    leave: "离开",
  },
  ja: {
    allRegions: "すべての地域",
    allShops: "すべての店舗",
    age: "年齢",
    call: "電話",
    close: "閉じる",
    contact: "連絡",
    empty: "条件に合う項目はありません。",
    featured: "おすすめ",
    height: "身長",
    hotels: "場所",
    language: "言語",
    photos: "枚",
    prices: "料金",
    region: "地域",
    search: "検索",
    searchPlaceholder: "名前、地域、タグ",
    shop: "店舗",
    today: "本日",
    updated: "更新",
    view: "詳細",
    ageGateTitle: "法定年齢に達していることを確認してください",
    ageGateCopy: "このテンプレートは成人向けガイドサイト用です。公開地域に合わせて文言を調整してください。",
    confirmAge: "法定年齢に達しています",
    leave: "離れる",
  },
  ko: {
    allRegions: "전체 지역",
    allShops: "전체 매장",
    age: "나이",
    call: "전화",
    close: "닫기",
    contact: "연락",
    empty: "조건에 맞는 항목이 없습니다.",
    featured: "추천",
    height: "키",
    hotels: "장소",
    language: "언어",
    photos: "장",
    prices: "요금",
    region: "지역",
    search: "검색",
    searchPlaceholder: "이름, 지역 또는 태그",
    shop: "매장",
    today: "오늘",
    updated: "업데이트",
    view: "보기",
    ageGateTitle: "법적 연령에 도달했는지 확인해 주세요",
    ageGateCopy: "이 템플릿은 성인용 가이드 사이트에 사용할 수 있습니다. 배포 지역에 맞게 문구를 조정하세요.",
    confirmAge: "법적 연령에 도달했습니다",
    leave: "나가기",
  },
  en: {
    allRegions: "All regions",
    allShops: "All shops",
    age: "Age",
    call: "Call",
    close: "Close",
    contact: "Contact",
    empty: "No items match the current filters.",
    featured: "Featured",
    height: "Height",
    hotels: "Places",
    language: "Language",
    photos: "photos",
    prices: "Prices",
    region: "Region",
    search: "Search",
    searchPlaceholder: "Name, region, or tag",
    shop: "Shop",
    today: "Today",
    updated: "Updated",
    view: "View",
    ageGateTitle: "Please confirm you are of legal age",
    ageGateCopy: "This template supports adult-oriented guide sites. Adjust compliance copy for your deployment region.",
    confirmAge: "I am of legal age",
    leave: "Leave",
  },
};
