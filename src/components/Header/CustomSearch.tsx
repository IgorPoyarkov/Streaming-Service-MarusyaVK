import { useState } from "react";
import CustomDropListToSearch from "./CustomDropListToSearch";
import { asset } from "../../utils/asset";

interface CustomSearchProps {}

export interface OpenDropList {
  searchFilm: string;
  open: boolean;
}

const CustomSearch = ({}: CustomSearchProps) => {
  const [openDropList, setOpenDropList] = useState<OpenDropList>({
    searchFilm: "",
    open: false,
  });

  function closeSearchList(): void {
    setOpenDropList({
      searchFilm: "",
      open: false,
    });
  }

  function cleerSearchList(): void {
    setOpenDropList({ ...openDropList, searchFilm: "", open: false });
  }

  return (
    <div
      className={`custom-search ${openDropList.open ? "custom-search--open" : ""}`}
    >
      <input
        className="custom-search__input"
        name="custom-search"
        type="text"
        onChange={(e) => {
          const value = e.target.value;
          setOpenDropList({
            searchFilm: value,
            open: value.trim().length > 0,
          });
        }}
        value={openDropList.searchFilm}
        placeholder="Поиск"
      />
      <svg className="custom-search__icon">
        <use href={asset("/sprite.svg#search-icon")} />
      </svg>

      <button
        className="custom-search__delete btn"
        type="button"
        onClick={cleerSearchList}
      >
      </button>

      <CustomDropListToSearch
        openDropList={openDropList}
        closeSearchList={closeSearchList}
      />
    </div>
  );
};

export default CustomSearch;
