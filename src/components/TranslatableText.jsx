import { useEffect, useRef } from "react";
import { useTextTranslation } from "../hooks/useTextTranslation";
import { useTranslation } from "react-i18next";

// Wrapper component that makes any child component translatable
export const TranslatableText = ({ children, className = "", style = {} }) => {
  const elementRef = useRef(null);
  const translation = useTextTranslation();
  const { t } = useTranslation();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseUp = () => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        translation.handleTextSelection(element);
      }, 10);
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest(".translation-menu")) {
        translation.hideMenu();
      }
    };

    // Listen to document-level mouseup to catch selections that end outside the element
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [translation]);

  return (
    <>
      <div
        ref={elementRef}
        className={className}
        style={{ userSelect: "text", ...style }}
      >
        {children}
      </div>

      {/* Translation Menu */}
      {translation.showMenu && (
        <div
          className="translation-menu fixed bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 text-black"
          style={{
            left: `${translation.menuPosition.x}px`,
            top: `${translation.menuPosition.y}px`,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          {translation.isTranslating ? (
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
              {t("common.translating")}
            </div>
          ) : (
            <button
              onClick={() => translation.handleTranslate()}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors w-full"
            >
              <span>🌐</span>
              <span>{t("common.translate")}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
