import type React from "react";
import { useMovieUtils } from "../../hooks/useMovieUtils";

interface LoaderProps {
  count?: number;
  size?: number;
  gap?: number;
  modif?: string;
}

const Loader = ({
  count = 3,
  size = 100,
  gap = 12,
  modif = "",
}: LoaderProps) => {
  const { maxCountLoader } = useMovieUtils();
  return (
    <div
      className={`loader ${modif !== "" ? `loader--${modif}` : ""}`}
      style={
        {
          "--items-count": maxCountLoader(count, size, gap),
          "--size-loader": size,
        } as React.CSSProperties
      }
    >
      <ul className="loader-list">
        {Array.from({ length: maxCountLoader(count, size, gap) }).map(
          (_, index) => (
            <li
              className="loader-item"
              key={index}
              style={
                {
                  "--index": index,
                } as React.CSSProperties
              }
            >
              <span className="loader-element"></span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default Loader;
