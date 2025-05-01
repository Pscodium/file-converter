import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface PathElement {
    id: string;
    element: SVGElement;
    originalFill: string | null;
    originalStroke: string | null;
    currentFill: string | null;
    currentStroke: string | null;
}

type SvgColorEditorContextType = {
    svgContent: string | null;
    setSvgContent: React.Dispatch<React.SetStateAction<string | null>>;
    svgElements: PathElement[];
    setSvgElements: React.Dispatch<React.SetStateAction<PathElement[]>>;
    selectedElement: string | null;
    setSelectedElement: React.Dispatch<React.SetStateAction<string | null>>;
    editMode: 'fill' | 'stroke';
    setEditMode: React.Dispatch<React.SetStateAction<'fill' | 'stroke'>>;
    updateElementColor: (id: string, color: string) => void;
    updateMultipleElementColors: (ids: string[], color: string) => void;
    resetColors: () => void;
    generateModifiedSvg: () => string | null;
    updateSvgInDom: (elements: { id: string; attribute: string; value: string | null }[]) => void;
};

const SvgColorEditorContext = createContext<SvgColorEditorContextType | undefined>(undefined);

export const useSvgColorEditor = () => {
    const context = useContext(SvgColorEditorContext);
    if (!context) {
        throw new Error('useSvgColorEditor deve ser usado dentro do SvgColorEditorProvider');
    }
    return context;
};

type ProviderProps = {
    children: ReactNode;
};

export const SvgColorEditorProvider: React.FC<ProviderProps> = ({ children }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [svgElements, setSvgElements] = useState<PathElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<'fill' | 'stroke'>('fill');

    const updateSvgInDom = (elements: { id: string; attribute: string; value: string | null }[]) => {
        const svgContainers = document.querySelectorAll('svg');
        if (svgContainers.length === 0) return;

        svgContainers.forEach((svgContainer) => {
            elements.forEach(({ id, attribute, value }) => {
                let element = svgContainer.querySelector(`#${id}`);

                if (!element) {
                    element = svgContainer.querySelector(`[id="${id}"]`);
                }

                if (element) {
                    console.log(`Updating element ${id}, setting ${attribute} to ${value}`);
                    if (value === null) {
                        element.removeAttribute(attribute);
                    } else {
                        element.setAttribute(attribute, value);
                    }
                }
            });
        });
    };

    const updateElementColor = (id: string, color: string) => {
        setSvgElements((prevElements) => {
            return prevElements.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        currentFill: editMode === 'fill' ? color : el.currentFill,
                        currentStroke: editMode === 'stroke' ? color : el.currentStroke,
                    };
                }
                return el;
            });
        });

        updateSvgInDom([
            {
                id,
                attribute: editMode === 'fill' ? 'fill' : 'stroke',
                value: color,
            },
        ]);
    };

    const updateMultipleElementColors = (ids: string[], color: string) => {
        setSvgElements((prevElements) => {
            return prevElements.map((el) => {
                if (ids.includes(el.id)) {
                    return {
                        ...el,
                        currentFill: editMode === 'fill' ? color : el.currentFill,
                        currentStroke: editMode === 'stroke' ? color : el.currentStroke,
                    };
                }
                return el;
            });
        });

        const updates = ids.map((id) => ({
            id,
            attribute: editMode === 'fill' ? 'fill' : 'stroke',
            value: color,
        }));
        updateSvgInDom(updates);
    };

    const resetColors = () => {
        const updates: { id: string; attribute: string; value: string | null }[] = [];

        svgElements.forEach((el) => {
            if (el.currentFill !== el.originalFill) {
                updates.push({
                    id: el.id,
                    attribute: 'fill',
                    value: el.originalFill,
                });
            }

            if (el.currentStroke !== el.originalStroke) {
                updates.push({
                    id: el.id,
                    attribute: 'stroke',
                    value: el.originalStroke,
                });
            }
        });

        setSvgElements((prevElements) => {
            return prevElements.map((el) => ({
                ...el,
                currentFill: el.originalFill,
                currentStroke: el.originalStroke,
            }));
        });

        updateSvgInDom(updates);
    };

    const generateModifiedSvg = (): string | null => {
        if (!svgContent) return null;

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

        svgElements.forEach((el) => {
            const element = svgDoc.getElementById(el.id) || svgDoc.querySelector(`[id="${el.id}"]`);

            if (element) {
                if (el.currentFill !== null) {
                    element.setAttribute('fill', el.currentFill);
                } else if (element.hasAttribute('fill')) {
                    element.removeAttribute('fill');
                }

                if (el.currentStroke !== null) {
                    element.setAttribute('stroke', el.currentStroke);
                } else if (element.hasAttribute('stroke')) {
                    element.removeAttribute('stroke');
                }
            }
        });

        const serializer = new XMLSerializer();
        return serializer.serializeToString(svgDoc);
    };

    useEffect(() => {
        if (!svgContent) return;

        const updates: { id: string; attribute: string; value: string | null }[] = [];

        svgElements.forEach((el) => {
            if (el.currentFill !== null) {
                updates.push({
                    id: el.id,
                    attribute: 'fill',
                    value: el.currentFill,
                });
            }

            if (el.currentStroke !== null) {
                updates.push({
                    id: el.id,
                    attribute: 'stroke',
                    value: el.currentStroke,
                });
            }
        });

        if (updates.length > 0) {
            setTimeout(() => updateSvgInDom(updates), 0);
        }
    }, [svgElements]);

    return (
        <SvgColorEditorContext.Provider
            value={{
                svgContent,
                setSvgContent,
                svgElements,
                setSvgElements,
                selectedElement,
                setSelectedElement,
                editMode,
                setEditMode,
                updateElementColor,
                updateMultipleElementColors,
                resetColors,
                generateModifiedSvg,
                updateSvgInDom,
            }}
        >
            {children}
        </SvgColorEditorContext.Provider>
    );
};
