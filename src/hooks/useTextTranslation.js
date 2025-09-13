import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import taxios from '../utils/taxios';

// Custom hook for text selection translation
export const useTextTranslation = () => {
    const {i18n} = useTranslation();
    const [selectedText, setSelectedText] = useState('');
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const [showMenu, setShowMenu] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [selectionRange, setSelectionRange] = useState(null);

    // Translation function that sends to backend server
    const translateText = async (text, currentLanguage) => {
        setIsTranslating(true);

        try {
            const response = await taxios.post('/common/translate', {
                text,
                targetLanguage: currentLanguage
            });

            const data = await response.data;
            setIsTranslating(false);
            return data.translatedText;

        } catch (error) {
            console.error('Translation error:', error);
            setIsTranslating(false);
            return text;
        }
    };

    const handleTranslate = async () => {
        if (!selectedText || !selectionRange) return;

        try {
            const translatedText = await translateText(selectedText, i18n.language);

            // Use the stored range to replace text
            selectionRange.deleteContents();
            selectionRange.insertNode(document.createTextNode(translatedText));

            // Clear selection
            window.getSelection()?.removeAllRanges();

            setShowMenu(false);
            setSelectedText('');
            setSelectionRange(null);
        } catch (error) {
            console.error('Translation error:', error);
            setShowMenu(false);
        }
    };

    const handleTextSelection = useCallback((element) => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedElement = range.commonAncestorContainer;

            // Check if selection is within the target element
            const isWithinElement = element.contains(
                selectedElement.nodeType === Node.TEXT_NODE
                    ? selectedElement.parentNode
                    : selectedElement
            );

            if (isWithinElement) {
                const rect = range.getBoundingClientRect();

                setSelectedText(text);
                setSelectionRange(range.cloneRange());
                setMenuPosition({
                    x: rect.left + (rect.width / 2),
                    y: rect.top - 10
                });
                setShowMenu(true);
                return;
            }
        }

        setShowMenu(false);
        setSelectedText('');
        setSelectionRange(null);
    }, []);

    return {
        selectedText,
        menuPosition,
        showMenu,
        isTranslating,
        handleTranslate,
        handleTextSelection,
        hideMenu: () => setShowMenu(false)
    };
};
